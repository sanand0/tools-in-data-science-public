import { join } from "path";
import logUpdate from "log-update";
import { createReadStream, existsSync, readFileSync, writeFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { default as seedrandom } from "seedrandom";
import { sortBy, uniqBy } from "lodash-es";
import { point, distance, bbox, intersect, area, polygon, featureCollection, booleanPointInPolygon } from "@turf/turf";
import shapefile from "shapefile";
import { root, createQuestions, pick, getWrongChoices, choose } from "./utils.js";

const dataDir = join(root, "data", "eateries");
const records = parse(readFileSync(join(dataDir, "eateries.csv"), "utf-8"), { columns: true });
const eateries = records.reduce((acc, record) => {
  acc.push(record);
  return acc;
}, []);

const source = await shapefile.open(join(root, "data", "india-districts", "DISTRICT_BOUNDARY.shp"));
let features = [];
let _result;
while (!(_result = await source.read()).done) features.push(_result.value);

if (!existsSync(join(root, "questions", "temp.distances.json"))) {
  const dists = [];
  const points = eateries.map((e) => point([e.longitude, e.latitude]));
  for (let i = 0; i < points.length; i++) {
    logUpdate(`Creating pairwise distances... ${i + 1}/${points.length}`);
    for (let j = i + 1; j < points.length; j++) dists.push([i, j, distance(points[i], points[j], { units: "meters" })]);
  }
  logUpdate("Sorting...");
  const distances = sortBy(dists, (d) => d[2]);
  logUpdate.done();
  writeFileSync(join(root, "questions", "temp.distances.json"), JSON.stringify(distances));
}

await createQuestions("ga6.1.json", async function () {
  const random = seedrandom("tds-ga6.1");
  const results = [];
  while (results.length < 50) {
    const rows = choose(eateries, 2, random);
    const [p1, p2] = [point([rows[0].longitude, rows[0].latitude]), point([rows[1].longitude, rows[1].latitude])];
    const answer = Math.round(distance(p1, p2, { units: "meters" }));
    if (answer > 10)
      results.push({
        name1: rows[0].name,
        name2: rows[1].name,
        id1: rows[0].business_id,
        id2: rows[1].business_id,
        choices: getWrongChoices(answer, random, { diff: 100, range: [0, 1E9] }),
      });
  }
  return results;
});

await createQuestions("ga6.2.json", async function () {
  const distances = JSON.parse(readFileSync(join(root, "questions", "temp.distances.json"), "utf-8"));
  const random = seedrandom("tds-ga6.2");
  const results = [];
  while (results.length < 50) {
    // Randomly pick a row from the distances array. Not too small (+5000 indices) but in the first 10%
    let answer = Math.floor(random() * distances.length / 10) + 5000;
    const distance = Math.floor(distances[answer][2]);
    while (distances[answer][2] >= distance) answer--;
    if (answer > 10) results.push({ distance, answer, choices: getWrongChoices(answer, random) });
  }
  return results;
});

await createQuestions("ga6.4.json", async function () {
  const random = seedrandom("tds-ga6.4");
  const results = [];
  while (results.length < 50) {
    const district = pick(features, random);
    const [cx, cy, w, h] = getBounds(district);
    let inside;
    while (true) {
      inside = randomPoint(cx, cy, w, h, random);
      if (booleanPointInPolygon(inside, district)) break;
    }
    let outside = [];
    while (outside.length < 3) {
      const p = randomPoint(cx, cy, 2 * w, 2 * h, random);
      if (!booleanPointInPolygon(p, district)) outside.push(p);
    }
    results.push({
      district: district.properties.District,
      state: district.properties.STATE,
      choices: [
        { text: inside.geometry.coordinates.join(", "), score: 1 },
        ...outside.map((p) => ({ text: p.geometry.coordinates.join(", "), score: 0 })),
      ],
    });
  }
  return results;
});

function getBounds(feature) {
  const [lonMin, latMin, lonMax, latMax] = bbox(feature);
  const [cx, cy] = [(lonMin + lonMax) / 2, (latMin + latMax) / 2];
  const [w, h] = [lonMax - lonMin, latMax - latMin];
  return [cx, cy, w, h];
}

function randomPoint(cx, cy, w, h, random) {
  const [x, y] = [cx + (random() - 0.5) * w, cy + (random() - 0.5) * h];
  return point([Math.round(x * 10000) / 10000, Math.round(y * 10000) / 10000]);
}

await createQuestions("ga6.5.json", async function () {
  const random = seedrandom("tds-ga6.5");
  const results = [];
  while (results.length < 50) {
    const district = pick(features, random);
    const [cx, cy, w, h] = getBounds(district);
    const p1 = randomPoint(cx, cy, w, h, random);
    const p2 = randomPoint(cx, cy, w, h, random);
    const minX = Math.round(Math.min(p1.geometry.coordinates[0], p2.geometry.coordinates[0]) * 10000) / 10000;
    const minY = Math.round(Math.min(p1.geometry.coordinates[1], p2.geometry.coordinates[1]) * 10000) / 10000;
    const maxX = Math.round(Math.max(p1.geometry.coordinates[0], p2.geometry.coordinates[0]) * 10000) / 10000;
    const maxY = Math.round(Math.max(p1.geometry.coordinates[1], p2.geometry.coordinates[1]) * 10000) / 10000;
    const rect = polygon([
      [
        [minX, minY],
        [minX, maxY],
        [maxX, maxY],
        [maxX, minY],
        [minX, minY],
      ],
    ]);
    const intersected = intersect(featureCollection([rect, district]));
    if (intersected) {
      const intersectedArea = area(intersected);
      const totalArea = area(district.geometry);
      const answer = Math.round((intersectedArea / totalArea) * 10000) / 100;
      if (answer > 5)
        results.push({
          district: district.properties.District,
          state: district.properties.STATE,
          bbox: `Latitude: ${minY} to ${maxY}, Longitude: ${minX} to ${maxX}`,
          choices: getWrongChoices(answer, random, { diff: 1, range: [0, 100] }),
        });
    }
  }
  return results;
});
