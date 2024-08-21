import { join } from "path";
import logUpdate from "log-update";
import { createWriteStream, existsSync, readFileSync, writeFileSync } from "fs";
import { promisify } from "util";
import { default as seedrandom } from "seedrandom";
import { regressionLinear } from "d3-regression";
import { countBy, groupBy, mean, meanBy, maxBy, mapValues, sumBy, uniqBy } from "lodash-es";
import { root, createQuestions, pick, choose, getWrongChoices } from "./utils.js";
import PDFDocument from "pdfkit";

import { default as duckdb } from "duckdb";

const openaiApiKey = process.env.OPENAI_API_KEY;
const db = new duckdb.Database(":memory:"); // or a file name for a persistent DB
const sfDB = join(root, "data", "sfscores", "sfscores.db");
db.run(`ATTACH DATABASE '${sfDB}' AS sf;`);
const dbQuery = promisify((sql, callback) => db.all(sql, callback));
const postalCodes = (await dbQuery(`SELECT DISTINCT postal_code FROM sf.businesses WHERE postal_code IS NOT NULL`)).map(
  (d) => d.postal_code,
);
const riskCategories = (await dbQuery(`SELECT DISTINCT risk_category FROM sf.violations WHERE risk_category IS NOT NULL`)).map(
  (d) => d.risk_category,
);
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

if (!existsSync(join(root, "questions", "temp.descembeddings.json"))) {
  const descriptions = (await dbQuery(`SELECT DISTINCT description FROM sf.violations`)).map((d) => d.description).filter((d) => d);
  const result = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "text-embedding-3-small", input: descriptions }),
  }).then((res) => res.json());
  const embeddings = Object.fromEntries(result.data.map((d, i) => [descriptions[i], d.embedding]));
  writeFileSync(join(root, "questions", "temp.descembeddings.json"), JSON.stringify(embeddings, null, 2));
}

if (!existsSync(join(root, "data", "sfscores", "biz-94110.html"))) {
  const data = await dbQuery(`SELECT * FROM sf.businesses;`);
  const colPairs = [
    ["business_id", "address"],
    ["city", "postal_code"],
    ["latitude", "longitude"],
    ["phone_number", "tax_code"],
    ["business_certificate", "owner_zip"],
    ["owner_name", "owner_address"],
    ["owner_city", "owner_state"],
  ];
  const random = seedrandom("roe2");
  for (const [postal_code, rows] of Object.entries(groupBy(data, "postal_code"))) {
    const pairs = [...colPairs].sort(() => random() - 0.5);
    writeFileSync(
      join(root, "data", "sfscores", `biz-${postal_code}.html`),
      /* html */ `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <h1 class="text-center my-5">Businesses in ${postal_code}</h1>
      <div class="container">
        <div class="row">
          ${rows
            .map(
              (d) => /* html */ `
              <table class="table">
                <tr><th colspan="4">${d.name}</th></tr>
                ${pairs.map(([col1, col2]) => /* html */ `<tr><td>${col1}</td><td>${d[col1]}</td><td>${col2}</td><td>${d[col2]}</td></tr>`).join("")}
              </table>
            `,
            )
            .join("")}
        </div>
      </div>
    `,
    );
  }
}

if (!existsSync(join(root, "data", "sfscores", "inspections-2016-08.pdf"))) {
  const data = await dbQuery(`SELECT * FROM sf.inspections;`);
  data.forEach((d) => (d.month = d.date.toISOString().slice(0, 7)));
  const [tableTop, itemHeight, tableLeft, cellPadding] = [75, 20, 50, 5];
  const fields = { business_id: 80, date: 125, score: 80, type: 200 };
  for (const [month, rows] of Object.entries(groupBy(data, "month"))) {
    logUpdate(`Generating inspections for ${month}`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = createWriteStream(join(root, "data", "sfscores", `inspections-${month}.pdf`));
    doc.pipe(stream);
    for (let index = 0; index < rows.length; index += 30) {
      if (index > 0) doc.addPage();
      let x = tableLeft;
      for (const [field, width] of Object.entries(fields)) {
        doc.rect(x, tableTop, width, itemHeight).stroke();
        doc.text(field, x + cellPadding, tableTop + cellPadding);
        x += width;
      }
      rows.slice(index, index + 30).forEach((row, rowIndex) => {
        x = tableLeft;
        const y = tableTop + (rowIndex + 1) * itemHeight;
        for (const [field, width] of Object.entries(fields)) {
          doc.rect(x, y, width, itemHeight).stroke();
          doc.text(field == "date" ? row[field].toISOString().slice(0, 10) : row[field], x + cellPadding, y + cellPadding);
          x += width;
        }
      });
    }
    doc.end();
  }
  logUpdate.clear();
}

await createQuestions("roe2.1.json", async function () {
  const data = await dbQuery(`SELECT
      violations.risk_category as risk_category,
      weekday(violations.date) as weekday,
      businesses.postal_code as postal_code,
      COUNT(businesses.business_id) as count
FROM sf.businesses, sf.violations
WHERE businesses.business_id = violations.business_id
AND postal_code IS NOT NULL
GROUP BY risk_category, weekday, postal_code;`);
  const random = seedrandom("roe2.1");
  const result = [];
  while (result.length < 50) {
    const postalCode = pick(postalCodes, random);
    const riskCategory = pick(riskCategories, random);
    const weekday = pick(weekdays, random);
    const weekdayIndex = weekdays.indexOf(weekday);
    const answer =
      data.find((d) => d.postal_code == postalCode && d.risk_category == riskCategory && d.weekday == weekdayIndex)?.count || 0;
    if (answer > 5) result.push({ postalCode, riskCategory, weekday, choices: getWrongChoices(new Number(answer), random) });
  }
  return result;
});

await createQuestions("roe2.2.json", async function () {
  const data = (
    await dbQuery(`SELECT
      FLOOR(businesses.latitude * 100) / 100 AS lat,
      FLOOR(businesses.longitude * 100) / 100 AS long,
      AVG(inspections.score) AS score,
      COUNT(*) AS count,
      STRFTIME(inspections.date, '%Y-%m') AS month
    FROM sf.businesses, sf.inspections
    WHERE businesses.business_id = inspections.business_id
    AND score IS NOT NULL
    AND latitude IS NOT NULL
    AND longitude IS NOT NULL
    GROUP BY lat, long, month
    HAVING count > 5
    ORDER BY count DESC`)
  ).map((d) => ({ ...d, score: +d.score, count: new Number(d.count) }));
  const random = seedrandom("roe2.2");
  const result = [];
  for (const [month, rows] of Object.entries(groupBy(data, "month"))) {
    const maxRow = maxBy(rows, "score");
    result.push({ month, count: maxRow.count, choices: getWrongChoices(maxRow.score, random, { diff: 0.1, range: [0, 100.1] }) });
  }
  return result;
});

await createQuestions("roe2.3.json", async function () {
  const data = await dbQuery(`SELECT postal_code, latitude, longitude
    FROM sf.businesses
    WHERE postal_code IS NOT NULL
    AND latitude IS NOT NULL
    AND longitude IS NOT NULL`);
  const postalCodeList = Object.entries(countBy(data, "postal_code"))
    .filter(([, count]) => count > 3)
    .map((d) => d[0]);
  const random = seedrandom("roe2.3");
  const result = [];
  while (result.length < 50) {
    const postalCodes = choose(postalCodeList, 15, random);
    const distances = {};
    for (const postalCode of postalCodes) {
      const rows = data.filter((d) => d.postal_code == postalCode);
      const cLat = meanBy(rows, "latitude");
      const cLon = meanBy(rows, "longitude");
      distances[postalCode] = mean(rows.map((d) => (d.dist = Math.hypot(d.latitude - cLat, d.longitude - cLon))));
    }
    const answer = maxBy(postalCodes, (d) => distances[d]);
    const wrongChoices = choose(
      postalCodes.filter((d) => d != answer),
      3,
      random,
    );
    result.push({
      postalCodes: postalCodes.join(", "),
      choices: [{ text: answer, score: 1 }, ...wrongChoices.map((d) => ({ text: d, score: 0 }))].sort((d) => random() - 0.5),
    });
  }
  return result;
});

await createQuestions("roe2.4.json", async function () {
  const data = await dbQuery(`SELECT
    violations.risk_category AS risk_category,
    violations.business_id AS business_id,
    violations.date AS date,
    COUNT(*) AS count
FROM sf.violations
LEFT JOIN sf.inspections
ON violations.business_id = inspections.business_id
AND inspections.date = violations.date
WHERE inspections.business_id IS NULL
GROUP BY violations.business_id, violations.date, violations.risk_category
`);
  const dates = data.map((d) => d.date);
  const riskCategories = uniqBy(data, "risk_category").map((d) => d.risk_category);
  const random = seedrandom("roe2.4");
  const result = [];
  while (result.length < 50) {
    const date = pick(dates, random);
    const riskCategory = pick(riskCategories, random);
    const filter = data.filter((d) => d.date >= date && d.risk_category == riskCategory);
    const answer = sumBy(filter, "count");
    if (answer > 5)
      result.push({ date: date.toISOString().slice(0, 10), riskCategory, choices: getWrongChoices(new Number(answer), random) });
  }
  return result;
});

await createQuestions("roe2.5.json", async function () {
  const data = await dbQuery(`SELECT
    businesses.postal_code AS postal_code,
    inspections.score AS score,
    violations.description AS description
  FROM sf.businesses
  JOIN sf.inspections
  ON businesses.business_id = inspections.business_id
  JOIN sf.violations
  ON businesses.business_id = violations.business_id
  AND inspections.date = violations.date
  WHERE inspections.score IS NOT NULL
  AND postal_code IS NOT NULL
  AND description IS NOT NULL
  AND inspections.business_id IS NOT NULL`);
  const postalCodes = data.map((d) => d.postal_code);
  const scores = data.map((d) => d.score);
  const wordList =
    "contact|employee|equipment|facilities|facility|food|foods|high|improper|improperly|inadequate|mobile|moderate|noncompliance|permit|risk|safety|storage|time|unapproved|unclean|unsanitary|violation|water".split(
      "|",
    );
  const random = seedrandom("roe2.5");
  const result = [];
  while (result.length < 50) {
    const postalCode = pick(postalCodes, random);
    const score = pick(scores, random);
    const words = choose(wordList, 5, random);
    const filter = data.filter(
      (d) => d.postal_code == postalCode && d.score >= score && words.some((w) => new RegExp(`\\b${w}\\b`).test(d.description)),
    );
    const answer = filter.length;
    if (answer > 5) result.push({ postalCode, score, words: words.join(", "), choices: getWrongChoices(new Number(answer), random) });
  }
  return result;
});

await createQuestions("roe2.6.json", async function () {
  // Join  **business_id**, **latitude**, **longitude**, and **description** from businesses (Drop missing values)
  // with **business_id** and **description** from the **violations** table (Drop missing values)
  const data = await dbQuery(`SELECT businesses.business_id, businesses.latitude, businesses.longitude, violations.description
    FROM sf.businesses
    JOIN sf.violations
    ON businesses.business_id = violations.business_id
    WHERE businesses.latitude > 0
    AND businesses.longitude < 0
    AND violations.description IS NOT NULL`);
  const latExtent = [Math.min(...data.map((d) => d.latitude)), Math.max(...data.map((d) => d.latitude))];
  const lonExtent = [Math.min(...data.map((d) => d.longitude)), Math.max(...data.map((d) => d.longitude))];
  const embeddings = JSON.parse(readFileSync(join(root, "questions", "temp.descembeddings.json")));
  const random = seedrandom("roe2.6");
  const randRange = ([min, max]) => +(min + random() * (max - min)).toFixed(2);
  const result = [];
  while (result.length < 50) {
    const [latMin, lonMin] = [randRange(latExtent), randRange(lonExtent)];
    const [latMax, lonMax] = [latMin + 0.2, lonMin + 0.2];
    const filter = data.filter((d) => d.latitude >= latMin && d.latitude <= latMax && d.longitude >= lonMin && d.longitude <= lonMax);
    const descriptions = uniqBy(filter, "description").map((d) => d.description);
    if (descriptions.length < 4) continue;
    const descEmbeddings = descriptions.map((d) => embeddings[d]);
    // descEmbeddings = [[0.1, 0.2, ...], [0.2, 0.3, ...], ...]
    // Calculate the centroid
    const centroid = Array(descEmbeddings[0].length).fill(0);
    for (const row of descEmbeddings) for (let i = 0; i < row.length; i++) centroid[i] += row[i];
    for (let i = 0; i < centroid.length; i++) centroid[i] /= descEmbeddings.length;
    // Calculate the distance from the centroid for each description
    const distances = descEmbeddings.map((d) => Math.hypot(...d.map((v, i) => v - centroid[i])));
    // Find the embedding with the maximum distance
    const outlier = descriptions[distances.indexOf(Math.max(...distances))];
    // Count the number of unique business_ids with this description in the filter
    const answer = uniqBy(
      filter.filter((d) => d.description == outlier),
      "business_id",
    ).length;
    if (answer >= 5)
      result.push({
        latMin: latMin.toFixed(2),
        latMax: latMax.toFixed(2),
        lonMin: lonMin.toFixed(2),
        lonMax: lonMax.toFixed(2),
        choices: getWrongChoices(new Number(answer), random),
      });
  }
  return result;
});

await createQuestions("roe2.7.json", async function () {
  // Join **business_id**, **date** and **score** from inspections with **business_id** and **postal_code** businesses. Drop any missing values.
  const data = await dbQuery(`SELECT inspections.business_id, inspections.date, inspections.score, businesses.postal_code
    FROM sf.inspections
    JOIN sf.businesses
    ON inspections.business_id = businesses.business_id
    WHERE inspections.date IS NOT NULL
    AND inspections.score IS NOT NULL
    AND businesses.postal_code IS NOT NULL`);
  const postalCodeList = data.map((d) => d.postal_code);
  data.forEach((row) => (row.date = new Date(row.date)));
  const maxDate = new Date(maxBy(data, "date").date);
  const random = seedrandom("roe2.7");
  const result = [];
  while (result.length < 50) {
    const postalCodes = choose(postalCodeList, 5, random);
    // Pick a date randomly between 1 - 30 days after the maximum date in the data
    const time = maxDate.getTime() + random() * 30 * 24 * 60 * 60 * 1000;
    const date = new Date(time);
    const filtered = data.filter((d) => postalCodes.includes(d.postal_code));
    if (filtered.length < 30) continue;
    const regression = regressionLinear()
      .x((d) => +d.date)
      .y((d) => d.score)(filtered);
    const answer = +regression.predict(date.getTime()).toFixed(2);
    result.push({
      postalCodes: postalCodes.join(", "),
      date: date.toISOString().slice(0, 10),
      choices: getWrongChoices(answer, random, { diff: 0.2, range: [0, 100] }),
    });
  }
  return result;
});

const processObject = (input) => {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    return Object.keys(input)
      .sort()
      .reduce((acc, key) => {
        if (key !== "required") acc[key] = processObject(input[key]);
        return acc;
      }, {});
  }
  return input;
};

await createQuestions("roe2.8.json", async function () {
  const schema = [
    { table: "businesses", field: "business_id", type: "integer" },
    { table: "businesses", field: "name", type: "string" },
    { table: "businesses", field: "address", type: "string" },
    { table: "businesses", field: "city", type: "string" },
    { table: "businesses", field: "postal_code", type: "string" },
    { table: "businesses", field: "latitude", type: "number" },
    { table: "businesses", field: "longitude", type: "number" },
    { table: "businesses", field: "phone_number", type: "number" },
    { table: "businesses", field: "tax_code", type: "string" },
    { table: "businesses", field: "business_certificate", type: "integer" },
    { table: "businesses", field: "application_date", type: "string", format: "date" },
    { table: "businesses", field: "owner_name", type: "string" },
    { table: "businesses", field: "owner_address", type: "string" },
    { table: "businesses", field: "owner_city", type: "string" },
    { table: "businesses", field: "owner_state", type: "string" },
    { table: "businesses", field: "owner_zip", type: "string" },
    { table: "violations", field: "business_id", type: "integer" },
    { table: "violations", field: "date", type: "string", format: "date" },
    { table: "violations", field: "violation_type_id", type: "string" },
    { table: "violations", field: "risk_category", type: "string" },
    { table: "violations", field: "description", type: "string" },
    { table: "inspections", field: "business_id", type: "integer" },
    { table: "inspections", field: "score", type: "number" },
    { table: "inspections", field: "date", type: "string", format: "date" },
    { table: "inspections", field: "type", type: "string" },
  ];
  const random = seedrandom("roe2.8");
  const result = [];
  for (const { table, field } of schema) {
    const filtered = schema.filter((d) => !(d.table == table && d.field == field));
    const jsonSchema = {
      type: "object",
      properties: mapValues(groupBy(filtered, "table"), (rows) => ({
        type: "array",
        items: { type: "object", properties: Object.fromEntries(rows.map(({ table, field, ...properties }) => [field, properties])) },
      })),
    };
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(processObject(jsonSchema), null, 2)));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const decimalValue = BigInt(`0x${hashHex}`);
    const lastFiveDigits = Number(decimalValue % 100000n);
    result.push({ table, field, choices: getWrongChoices(lastFiveDigits, random) });
  }
  return result;
});
