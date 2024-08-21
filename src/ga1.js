import { join, basename } from "path";
import { readdirSync, readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { default as seedrandom } from "seedrandom";
import { root, createQuestions, pick } from "./utils.js";

await createQuestions("ga1.1.json", async function () {
  const random = seedrandom("tds");
  const data = {};
  const dataDir = join(root, "data", "world-happiness");
  const csvFiles = readdirSync(dataDir).filter((file) => file.endsWith(".csv"));
  csvFiles.forEach((path) => {
    const year = basename(path).split(".")[0];
    const csvContent = readFileSync(join(dataDir, path), "utf-8");
    const records = parse(csvContent, { columns: true });
    const df = records.reduce((acc, record) => {
      const country = record.Country || record["Country or region"];
      acc[country] = record;
      return acc;
    }, {});
    data[year] = df;
  });

  const results = [];
  while (results.length < 30) {
    const year = pick(Object.keys(data), random);
    const countries = Object.keys(data[year]);
    const country = pick(countries, random);
    const fields = Object.keys(data[year][country]).slice(2); // Skip first 2 columns (Country and Region)
    const field = pick(fields, random);
    const answer = data[year][country][field];
    if (answer === "") continue;
    const choices = [{ text: answer, score: 1.0 }];
    // Add 3 random wrong answers that are different from the correct answer
    while (choices.length < 4) {
      const wrongAnswer = data[year][pick(countries, random)][pick(fields, random)];
      if (wrongAnswer && wrongAnswer !== answer) choices.push({ text: wrongAnswer, score: 0.0 });
    }
    choices.sort(() => Math.random() - 0.5);
    results.push({ year, country, field, choices });
  }

  return results;
});
