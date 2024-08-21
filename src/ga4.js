import { join } from "path";
import { createReadStream, existsSync, readFileSync, writeFileSync } from "fs";
import { parse } from "csv-parse";
import { promisify } from "util";
import logUpdate from "log-update";
import { default as seedrandom } from "seedrandom";
import { regressionLinear } from "d3-regression";
import { groupBy } from "lodash-es";
import { root, createQuestions, pick, getWrongChoices } from "./utils.js";

import { default as duckdb } from "duckdb";

const db = new duckdb.Database(":memory:"); // or a file name for a persistent DB
const dbQuery = promisify((sql, callback) => db.all(sql, callback));

async function slope(data, city, furnishing) {
  const filtered = data.filter((d) => d["Furnishing Status"] === furnishing && d["City"] === city);
  // const regression = new linearRegression(filtered.map(d => [+d["Size"], +d["Rent"]]));
  const regression = regressionLinear()
    .x((d) => +d.Size)
    .y((d) => +d.Rent)(filtered);
  return regression.a;
}

await createQuestions("ga4.1.json", async function () {
  // **Question**: What's the difference in Pearson correlation between `DEPARTURE_DELAY` and `ARRIVAL_DELAY`
  // for flights traveling less than **${distance}** miles with
  // scheduled departure starting from **${startHour}:00** and before **${endHour}:00**?
  const random = seedrandom("tds-ga4.1");
  const result = [];
  while (result.length < 50) {
    // Pick distance as a random multiple of 50 up to 2,500
    const distance = Math.floor(random() * 50) * 50;
    // Pick a random range of hours from 0 - 24 hours so that the duration is at least 2 hours
    const startHour = Math.floor(random() * 23);
    const endHour = startHour + 2 + Math.floor(random() * (24 - startHour - 2));
    const stats = await dbQuery(`
      SELECT
        COUNT(*) AS n,
        CORR(DEPARTURE_DELAY, ARRIVAL_DELAY) AS correlation
      FROM "data/flights/flights.parquet"
      WHERE distance < ${distance}
      AND SCHEDULED_DEPARTURE >= ${startHour}
      AND SCHEDULED_DEPARTURE < ${endHour}
    `);
    const { n, correlation } = stats[0];
    const count = Number(n);
    logUpdate(`ga4.1 - ${result.length} / 50 (${count})`);
    if (count < 100) continue;
    if (correlation < 0.1) continue; // Too weak a correlation
    result.push({ distance, startHour, endHour, count, choices: getWrongChoices(correlation, random, { diff: 0.01, range: [0, 1] }) });
  }
  return result;
});

await createQuestions("ga4.2.json", async function () {
  // From the same [flights dataset (.parquet)](#TODO), how many arrival delays are outliers for
  // flights traveling less than **${distance}** miles with
  // scheduled departure starting from **${startHour}:00** and before **${endHour}:00**?
  const random = seedrandom("tds-ga4.2");
  const result = [];
  while (result.length < 50) {
    // Pick distance as a random multiple of 50 from 1,500 - 3,000
    const distance = Math.floor(random() * 30) * 50 + 1500;
    // Pick a random hour from 0 - 24 hours. Don't pick longer durations -- we need speed
    const startHour = Math.floor(random() * 23);
    const endHour = startHour + 1;

    const statsQuery = `
        SELECT
          COUNT(*) AS count,
          QUANTILE(ARRIVAL_DELAY, 0.25) AS q1,
          QUANTILE(ARRIVAL_DELAY, 0.75) AS q3
        FROM "data/flights/flights.parquet"
        WHERE distance < ${distance}
        AND SCHEDULED_DEPARTURE >= ${startHour}
        AND SCHEDULED_DEPARTURE < ${endHour}
    `;

    const stats = await dbQuery(statsQuery);
    const { count, q1, q3 } = stats[0];

    logUpdate(`ga4.2 - ${result.length} / 50 (${count})`);
    if (count < 100) continue;

    const iqr = q3 - q1;
    const lo = q1 - 1.5 * iqr;
    const hi = q3 + 1.5 * iqr;

    // DuckDB query to count the number of outliers outside of the [lo, hi] range
    const outliersQuery = `
        SELECT COUNT(*) AS outliers
        FROM "data/flights/flights.parquet"
        WHERE distance < ${distance}
          AND SCHEDULED_DEPARTURE >= ${startHour}
          AND SCHEDULED_DEPARTURE < ${endHour}
          AND (ARRIVAL_DELAY < ${lo} OR ARRIVAL_DELAY > ${hi})
    `;
    const outliersResult = await dbQuery(outliersQuery);
    const outliers = Number(outliersResult[0].outliers);

    result.push({ distance, startHour, endHour, choices: getWrongChoices(outliers, random) });
  }
  return result;
});

await createQuestions("ga4.3.json", async function () {
  // **Question**: How much faster does the rent increase per square foot for **${furnishing}** houses
  // in **${city1}** vs in **${city2}**?
  const input = createReadStream(join(root, "data", "house-rent", "house-rent.csv")).pipe(parse({ columns: true }));
  const data = [];
  for await (const record of input) data.push(record);
  const cities = [...new Set(data.map((d) => d["City"]))];
  const furnishings = [...new Set(data.map((d) => d["Furnishing Status"]))];
  // Pick 50 random pairs of cities and furnishings
  const random = seedrandom("tds-ga4.3");
  const result = [];
  while (result.length < 50) {
    const city1 = pick(cities, random);
    const city2 = pick(cities, random);
    const furnishing = pick(furnishings, random);
    logUpdate(`ga4.3 - ${result.length} / 50 (${city1}, ${city2}, ${furnishing})`);
    if (city1 === city2) continue;
    // Calculate the slope for each city and furnishing
    const slope1 = await slope(data, city1, furnishing);
    const slope2 = await slope(data, city2, furnishing);
    result.push({ city1, city2, furnishing, choices: getWrongChoices(Math.abs(slope2 - slope1), random) });
  }
  return result;
});

await createQuestions("ga4.5.json", async function () {
  const restbaseFile = join(root, "questions", "temp.restbase.json");
  if (!existsSync(restbaseFile)) {
    logUpdate("Downloading restbase data from MySQL...");
    const data = await dbQuery(`
      INSTALL mysql;
      LOAD mysql;
      ATTACH 'host=db.relational-data.org user=guest password=relational database=restbase' AS restbase (TYPE MYSQL);
      USE restbase;
      SELECT * FROM generalinfo;
    `);
    writeFileSync(restbaseFile, JSON.stringify(data));
  }
  const data = JSON.parse(readFileSync(restbaseFile, "utf-8"));

  const cityWise = groupBy(data, "city");
  const cuisineWise = groupBy(data, "food_type");
  // Create an object percent where percent[city][cuisine] = % of restaurants in city serving that cuisine
  const percent = {};
  for (const city in cityWise) {
    percent[city] = {};
    for (const cuisine in cuisineWise)
      percent[city][cuisine] = cityWise[city].filter((d) => d.food_type === cuisine).length / cityWise[city].length;
  }

  const random = seedrandom("tds-ga4.5");
  const result = [];
  while (result.length < 50) {
    const city = pick(Object.keys(cityWise).slice(0, 30), random);
    const cuisine = pick(Object.keys(cuisineWise).slice(0, 30), random);
    logUpdate(`ga4.5 - ${result.length} / 50 (${city}, ${cuisine})`);

    // Calculate the percentage of restaurants in the city serving the cuisine
    const percentage = percent[city][cuisine];
    if (percentage == 0) continue; // Skip if no restaurants serve that cuisine

    // Calculate the number of cities with a higher percentage
    const higher = Object.keys(percent).filter((c) => percent[c][cuisine] > percentage).length;
    result.push({ city, cuisine, count: cityWise[city].length, choices: getWrongChoices(higher, random) });
  }
  return result;
});
