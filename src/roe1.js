import { join } from "path";
import logUpdate from "log-update";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { promisify } from "util";
import { default as seedrandom } from "seedrandom";
import { regressionLinear } from "d3-regression";
import { groupBy, mean, maxBy, minBy, uniqBy } from "lodash-es";
import { root, createQuestions, pick, choose, getWrongChoices } from "./utils.js";

import { default as duckdb } from "duckdb";

const openaiApiKey = process.env.OPENAI_API_KEY;
const db = new duckdb.Database(":memory:"); // or a file name for a persistent DB
const schoolsDB = join(root, "data", "cdeschools", "cdeschools.db");
db.run(`ATTACH DATABASE '${schoolsDB}' AS cde;`);
const dbQuery = promisify((sql, callback) => db.all(sql, callback));
const subjects = ["Read", "Math", "Write"];

if (!existsSync(join(root, "questions", "temp.schoolembeddings.json"))) {
  const schoolNames = (await dbQuery(`SELECT DISTINCT School FROM cde.schools`)).map((d) => d.School).filter((d) => d);
  const embeddings = {};
  const step = 1000;
  // Get school embeddings in chunks of steps
  for (let i = 0; i < schoolNames.length; i += step) {
    logUpdate(`Embeddings: ${i}-${Math.min(i + step, schoolNames.length)} / ${schoolNames.length} (${Object.keys(embeddings).length})`);
    const result = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "text-embedding-3-small", input: schoolNames.slice(i, i + step) }),
    }).then((res) => res.json());
    Object.assign(embeddings, Object.fromEntries(result.data.map((d, j) => [schoolNames[i + j], d.embedding])));
  }
  logUpdate.done();
  writeFileSync(join(root, "questions", "temp.schoolembeddings.json"), JSON.stringify(embeddings, null, 2));
}

if (!existsSync(join(root, "data", "cdeschools", "score-los-angeles.html"))) {
  const data = await dbQuery(`SELECT * FROM cde.satscores WHERE rtype = 'S';`);
  for (const [cname, rows] of Object.entries(groupBy(data, "cname")))
    writeFileSync(
      join(root, "data", "cdeschools", `score-${cname.replace(/\s+/g, "-").toLowerCase()}.html`),
      /* html */ `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <h1 class=text-center>${cname}</h1>
      <div class="container">
        <div class="row">
          ${rows
            .map(
              ({ cds, sname, dname, NumTstTakr, AvgScrRead, AvgScrMath, AvgScrWrite, NumGE1500, PctGE1500 }) => /* html */ `
              <div class="col-md-4 mb-4">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">${sname}</h5>
                    <p class="card-text"><strong>School Code:</strong> ${cds}</p>
                    <p class="card-text"><strong>District Name:</strong> ${dname}</p>
                    <p class="card-text"><strong>Number of test takers:</strong> ${NumTstTakr}</p>
                    <p class="card-text"><strong>Average Score: Read:</strong> ${AvgScrRead}</p>
                    <p class="card-text"><strong>Average Score: Math:</strong> ${AvgScrMath}</p>
                    <p class="card-text"><strong>Average Score: Write:</strong> ${AvgScrWrite}</p>
                    <p class="card-text"><strong>Number >= 1500:</strong> ${NumGE1500}</p>
                    <p class="card-text"><strong>Percent >= 1500:</strong> ${PctGE1500}%</p>
                  </div>
                </div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
    `,
    );
}

await createQuestions("roe1.1.json", async function () {
  // What is the Pearson correlation coeffiecient between **${column1}** and **${column2}** across all the schools in California?
  // Create the HTML files if required
  const columns = {
    NumTstTakr: "Number of test takers",
    AvgScrRead: "Average Score: Read",
    AvgScrMath: "Average Score: Math",
    AvgScrWrite: "Average Score: Write",
    NumGE1500: "Number >= 1500",
    PctGE1500: "Percent >= 1500",
  };
  const random = seedrandom("roe1");
  const result = [];
  for (const [column1, label1] of Object.entries(columns))
    for (const [column2, label2] of Object.entries(columns))
      if (column1 !== column2) {
        const stats = await dbQuery(`SELECT CORR(${column1}, ${column2}) AS correlation FROM cde.satscores WHERE rtype = 'S'`);
        const { correlation } = stats[0];
        result.push({ column1, column2, label1, label2, choices: getWrongChoices(correlation, random, { diff: 0.01, range: [-1, 1] }) });
      }
  return result;
});

await createQuestions("roe1.2.json", async function () {
  // Which of these cities have the highest average distance between schools in the city?
  const data = await dbQuery(`SELECT City, Latitude, Longitude FROM cde.schools WHERE Latitude IS NOT NULL and Longitude IS NOT NULL`);
  // Calculate the average distance between every pair of schools in each city
  const distances = [];
  for (const [city, schools] of Object.entries(groupBy(data, (d) => d.City))) {
    if (schools.length < 5) continue;
    let dists = [];
    for (const school1 of schools)
      for (const school2 of schools)
        if (school1 !== school2)
          dists.push(Math.sqrt((school1.Latitude - school2.Latitude) ** 2 + (school1.Longitude - school2.Longitude) ** 2));
    distances[city] = mean(dists);
  }
  const random = seedrandom("roe2");
  const result = [];
  while (result.length < 50) {
    const sample = choose(Object.keys(distances), 4, random).map((city) => ({ city, distance: distances[city] }));
    // Pick the city name with the highest average distance as the correct answer
    const { city, distance } = maxBy(sample, "distance");
    const choices = sample.map(({ city: sampleCity }) => ({ text: sampleCity, score: sampleCity === city ? 1 : 0 }));
    result.push({ city, distance, choices });
  }
  return result;
});

await createQuestions("roe1.3.json", async function () {
  // How many distinct counties (as idenfied by the County Code) have an **NSLP Provision Status** of **${status}** and a **Low Grade** of **${grade} or above**?
  const data = await dbQuery(`SELECT "County Code", "School Type", "Low Grade" FROM cde.frpm`);
  // Replace data["Low Grade"] with an integer mapping K to 0 and P to -1
  for (const row of data)
    row["Low Grade"] = row["Low Grade"] === "K" ? 0 : row["Low Grade"] === "P" ? -1 : row["Low Grade"] === "Adult" ? 13 : +row["Low Grade"];
  // Get all distinct status and grade combinations
  const types = [
    "Elementary Schools (Public)",
    "High Schools (Public)",
    "Intermediate/Middle Schools (Public)",
    "Continuation High Schools",
    "Alternative Schools of Choice",
    "K-12 Schools (Public)",
    "Elemen Schools In 1 School Dist. (Public)",
    "District Community Day Schools",
    "Special Education Schools (Public)",
    "County Community",
  ];
  const random = seedrandom("roe3");
  const result = [];
  for (const type of types)
    for (const grade of [-1, 0, 1, 6, 9]) {
      const counties = new Set(data.filter((d) => d["School Type"] === type && d["Low Grade"] >= grade).map((d) => d["County Code"]));
      if (counties.size < 2) continue;
      result.push({ type, grade: grade == 0 ? "K" : grade == -1 ? "P" : `${grade}`, choices: getWrongChoices(counties.size, random) });
    }
  return result;
});

await createQuestions("roe1.4.json", async function () {
  // How many schools in within the bounding box of **${lat1}** to **${lat2}** latitude and
  // **${lon1}** to **${lon2}** longitude have an SAT average **${subject}** score of **${score}** or above?
  const schools = await dbQuery(
    `SELECT
      school.Latitude as Latitude,
      school.Longitude as Longitude,
      scores.NumTstTakr AS NumTstTakr,
      scores.AvgScrRead AS AvgScrRead,
      scores.AvgScrWrite AS AvgScrWrite,
      scores.AvgScrMath AS AvgScrMath
    FROM cde.schools AS school
    JOIN cde.satscores AS scores
    ON school.CDSCode = scores.cds
    WHERE scores.rtype = 'S'`,
  );
  // Get the lat-lon ranges
  const lat = [32.55, 44.21];
  const lon = [-124.28, -83.7];
  const random = seedrandom("roe4");
  const result = [];
  while (result.length < 50) {
    const [lat1, lat2] = [random() * (lat[1] - lat[0]) + lat[0], random() * (lat[1] - lat[0]) + lat[0]].sort().map((d) => d.toFixed(2));
    const [lon1, lon2] = [random() * (lon[1] - lon[0]) + lon[0], random() * (lon[1] - lon[0]) + lon[0]].sort().map((d) => d.toFixed(2));
    const subject = pick(subjects, random);
    const score = Math.floor(random() * 350 + 300);
    const answer = schools.filter(
      (school) =>
        school.Latitude >= lat1 &&
        school.Latitude <= lat2 &&
        school.Longitude >= lon1 &&
        school.Longitude <= lon2 &&
        school[`AvgScr${subject}`] >= score,
    ).length;
    if (answer < 5) continue;
    result.push({ lat1, lat2, lon1, lon2, subject, score, choices: getWrongChoices(answer, random) });
  }
  return result;
});

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

await createQuestions("roe1.5.json", async function () {
  // How many schools in **${county}** have an OpenDate that falls on a **${dayOfWeek}**?
  // Get County, Weekday of OpenDate, Count. Remove schools with null weekday
  const schools = (
    await dbQuery(
      `SELECT County, strftime('%w', OpenDate) AS Weekday, COUNT(*) AS Count
     FROM cde.schools
     GROUP BY County, Weekday`,
    )
  ).filter((school) => school.Weekday !== null);
  const counties = [...new Set(schools.map(({ County }) => County))];
  const weekdays = [...new Set(schools.map(({ Weekday }) => Weekday))];
  const random = seedrandom("roe5");
  const result = [];
  while (result.length < 50) {
    const county = pick(counties, random);
    const weekday = pick(weekdays, random);
    const answer = schools.find((school) => school.County === county && school.Weekday === weekday)?.Count ?? 0;
    if (answer < 5) continue;
    result.push({ county, weekday: daysOfWeek[+weekday], choices: getWrongChoices(new Number(answer), random) });
  }
  return result;
});

await createQuestions("roe1.6.json", async function () {
  // For every unit increase in the average **${subject1}** score, how much does the average **${subject2}** score
  // change in these 20 counties?
  const data = await dbQuery(`SELECT * FROM cde.satscores WHERE rtype = 'S' AND AvgScrMath > 0 AND AvgScrRead > 0`);
  data.forEach((d) => {
    d.AvgScrMath = new Number(d.AvgScrMath);
    d.AvgScrRead = new Number(d.AvgScrRead);
  });
  const counties = [...new Set(data.map(({ cname }) => cname))];
  const random = seedrandom("roe6");
  const result = [];
  while (result.length < 50) {
    const countyList = new Set(choose(counties, 20, random));
    const filtered = data.filter((d) => countyList.has(d.cname));
    const regression = regressionLinear()
      .x((d) => d.AvgScrMath)
      .y((d) => d.AvgScrRead)(filtered);
    const answer = regression.a;
    result.push({
      subject1: "Math",
      subject2: "Read",
      countyList: [...countyList].join(", "),
      choices: getWrongChoices(answer, random, { diff: 0.01, range: [-0.9, +1.1] }),
    });
  }
  return result;
});

await createQuestions("roe1.7.json", async function () {
  // Find the counties that have a free-meal enrollment of at least **${percent}**.
  // In these counties, what is the average SAT score for **${subject}** weighted by the
  // number of test takers?
  const meals = await dbQuery(
    `SELECT
      "County Name" AS County,
      SUM("Free Meal Count (K-12)") AS Meals,
      SUM("Enrollment (K-12)") AS Enrolled
    FROM cde.frpm
    GROUP BY County`,
  );
  const scores = await dbQuery(`SELECT * FROM cde.satscores WHERE rtype = 'S';`);
  for (const row of scores) {
    row.AvgScrMath = new Number(row.AvgScrMath);
    row.AvgScrRead = new Number(row.AvgScrRead);
    row.AvgScrWrite = new Number(row.AvgScrWrite);
    row.NumTstTakr = new Number(row.NumTstTakr);
  }
  const result = [];
  const random = seedrandom("roe7");
  while (result.length < 50) {
    const percent = Math.floor(random() * 70 + 20);
    const subject = pick(subjects, random);
    const counties = meals.filter((d) => (d.Meals / d.Enrolled) * 100 >= percent).map((d) => d.County);
    if (counties.length < 5) continue;
    const countySet = new Set(counties);
    // Find average SAT score for each subject weighted by the number of test takers
    const filtered = scores.filter((d) => countySet.has(d.cname));
    const totalTakers = filtered.reduce((acc, d) => acc + d.NumTstTakr, 0);
    const answer = filtered.reduce((acc, d) => acc + d.NumTstTakr * d[`AvgScr${subject}`], 0) / totalTakers;
    result.push({
      percent,
      subject,
      choices: getWrongChoices(answer.toFixed(3), random),
    });
  }
  return result;
});

await createQuestions("roe1.8.json", async function () {
  const embeddings = JSON.parse(readFileSync(join(root, "questions", "temp.schoolembeddings.json")));
  function distance(word1, word2, embeddings) {
    const embedding1 = embeddings[word1];
    const embedding2 = embeddings[word2];
    return embedding1.reduce((acc, v, i) => acc + v * embedding2[i], 0);
  }

  const data = await dbQuery(`
    SELECT StatusType, School, City, strftime('%Y', OpenDate) AS Year
    FROM cde.schools
    WHERE School IS NOT NULL
    AND OpenDate IS NOT NULL
    AND City IS NOT NULL
    AND StatusType IS NOT NULL`);
  const statusTypes = [...new Set(data.map(({ StatusType }) => StatusType))];
  const cities = [...new Set(data.map(({ City }) => City))];
  const years = [...new Set(data.map(({ Year }) => Year))];

  const random = seedrandom("roe8");
  const result = [];
  while (result.length < 50) {
    const statusType = pick(statusTypes, random);
    const city = pick(cities, random);
    const year = pick(years, random);
    const filtered = data.filter((d) => d.StatusType === statusType && d.City === city && d.Year === year);
    if (filtered.length < 5) continue;
    for (const row of filtered) row.embedding = embeddings[row.School];
    const similarities = [];
    for (const school1 of filtered)
      for (const school2 of filtered)
        if (school1.School < school2.School)
          similarities.push({ school1, school2, distance: distance(school1.School, school2.School, embeddings) });
    const answer = minBy(similarities, (d) => d.distance);
    const choices = [answer];
    similarities.sort((a, b) => Math.random() - 5);
    for (const { school1, school2, distance } of similarities)
      if (school1 !== answer.school1 && school2 !== answer.school2) {
        choices.push({ school1, school2, distance });
        if (choices.length >= 4) break;
      }
    choices.sort((a, b) => Math.random() - 0.5);
    result.push({
      statusType,
      city,
      year,
      distance: answer.distance.toFixed(3),
      choices: choices.map(({ school1, school2 }) => ({
        text: `${school1.School} and ${school2.School}`,
        score: school1 === answer.school1 && school2 === answer.school2 ? 1 : 0,
      })),
    });
  }
  return result;
});
