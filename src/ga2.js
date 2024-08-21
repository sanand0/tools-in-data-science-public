import { join } from "path";
import { createWriteStream, existsSync, readFileSync, writeFileSync } from "fs";
import { default as seedrandom } from "seedrandom";
import { parse } from "node-html-parser";
import { root, createQuestions, choose, pick, getWrongChoices } from "./utils.js";
import logUpdate from "log-update";
import PDFDocument from "pdfkit";

/**
 * Fetches Pokemon character data from pokeapi.co and generates a quiz
 */
await createQuestions("ga2.3.json", async function () {
  const pokemonFile = join(root, "questions", "temp.pokemon.json");
  // If root/data/pokemon.json exists, use it. Else fetch all pokemon character data
  if (!existsSync(pokemonFile)) {
    const rows = [];
    const fetchChar = async (id) => await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then((res) => res.json());
    for (let id = 1; id <= 100; id++) {
      logUpdate(`ga2.3 - fetching pokemon stats ${id}/100`);
      const char = await fetchChar(id);
      char.moves.forEach((move) =>
        move.version_group_details.forEach((version) =>
          rows.push({
            name: char.name,
            move: move.move.name,
            version: version.version_group.name,
          }),
        ),
      );
    }
    writeFileSync(pokemonFile, JSON.stringify(rows));
  }
  const rows = JSON.parse(readFileSync(pokemonFile, "utf8"));

  // Get uniqe characters, and versions
  const chars = [...new Set(rows.map((row) => row.name))];
  const versions = [...new Set(rows.map((row) => row.version))];

  const data = [];
  const done = new Set();
  const random = seedrandom("tds");
  while (data.length < 50) {
    // Randomly select 2 distinct characters and a version
    const char1 = chars[Math.floor(random() * chars.length)];
    const char2 = chars[Math.floor(random() * chars.length)];
    if (char1 === char2) continue;
    const version = versions[Math.floor(random() * versions.length)];
    const key = `${char1}-${char2}-${version}`;
    if (done.has(key)) continue;
    done.add(key);

    // Get moves for each character and version
    const char1Moves = new Set(rows.filter((d) => d.name === char1 && d.version === version).map((d) => d.move));
    const char2Moves = new Set(rows.filter((d) => d.name === char2 && d.version === version).map((d) => d.move));
    // Get moves that are unique to char1
    const char1ExtraMoves = [...new Set([...char1Moves].filter((move) => !char2Moves.has(move)))];
    data.push({ char1, char2, version, choices: getWrongChoices(char1ExtraMoves.length, random) });
  }
  return data;
});

/**
 * Count images in WhiteHouse.gov archived versions
 */
await createQuestions("ga2.4.json", async function () {
  // Fetch all archived versions of whitehouse.gov
  const whiteHouseFile = join(root, "questions", "temp.whitehouse.json");
  if (!existsSync(whiteHouseFile)) {
    logUpdate(`ga2.4 - archive.org whitehouse history`);
    const url = "https://web.archive.org/cdx/search/cdx?url=https://www.whitehouse.gov/&output=json&fl=timestamp,original&collapse=digest";
    writeFileSync(whiteHouseFile, JSON.stringify(await fetch(url).then((res) => res.json())));
  }
  const rows = JSON.parse(readFileSync(whiteHouseFile, "utf8")).slice(1);
  const random = seedrandom("tds");

  // Cound these selectors in a random sample of 25 archived versions
  const data = [];
  const selectors = ["a img", '[class^="menu-"], [class*=" menu-"]'];
  const choices = choose(rows, 25, random);
  for (const [timestamp, source] of choices) {
    logUpdate(`ga2.4 - archive.org whitehouse page ${data.length / selectors.length + 1}/${choices.length}: ${timestamp}`);
    const url = `https://web.archive.org/web/${timestamp}id_/${source}`;
    const root = parse(await fetch(url).then((res) => res.text()));
    for (const selector of selectors)
      data.push({
        selector,
        url,
        choices: getWrongChoices(root.querySelectorAll(selector).length, random),
      });
  }
  return data;
});

await createQuestions("ga2.5.json", async function () {
  const places = [
    // Commented out places that are not a "city" in Nominatim
    // { city: "Tokyo", country: "Japan" },
    { city: "Delhi", country: "India" },
    { city: "Shanghai", country: "China" },
    // { city: "São Paulo", country: "Brazil" },
    { city: "Mumbai", country: "India" },
    { city: "Beijing", country: "China" },
    { city: "Cairo", country: "Egypt" },
    { city: "Dhaka", country: "Bangladesh" },
    { city: "Mexico City", country: "Mexico" },
    // { city: "Osaka", country: "Japan" },
    { city: "Karachi", country: "Pakistan" },
    { city: "Chongqing", country: "China" },
    { city: "Istanbul", country: "Turkey" },
    { city: "Buenos Aires", country: "Argentina" },
    { city: "Kolkata", country: "India" },
    { city: "Lagos", country: "Nigeria" },
    { city: "Kinshasa", country: "DR Congo" },
    { city: "Manila", country: "Philippines" },
    { city: "Tianjin", country: "China" },
    // { city: "Rio de Janeiro", country: "Brazil" },
    { city: "Guangzhou", country: "China" },
    { city: "Shenzhen", country: "China" },
    { city: "Lahore", country: "Pakistan" },
    { city: "Bangalore", country: "India" },
    { city: "Paris", country: "France" },
    { city: "Bogotá", country: "Colombia" },
    { city: "Jakarta", country: "Indonesia" },
    { city: "Chennai", country: "India" },
    { city: "Lima", country: "Peru" },
    { city: "Bangkok", country: "Thailand" },
    { city: "New York City", country: "USA" },
    { city: "Hyderabad", country: "India" },
    { city: "Wuhan", country: "China" },
    { city: "Chengdu", country: "China" },
    { city: "Nagoya", country: "Japan" },
    { city: "London", country: "United Kingdom" },
    { city: "Tehran", country: "Iran" },
    { city: "Ho Chi Minh City", country: "Vietnam" },
    { city: "Chicago", country: "USA" },
    { city: "Luanda", country: "Angola" },
    { city: "Ahmedabad", country: "India" },
    // { city: "Kuala Lumpur", country: "Malaysia" },
    // { city: "Hong Kong", country: "China" },
    { city: "Hangzhou", country: "China" },
    { city: "Quanzhou", country: "China" },
    { city: "Shijiazhuang", country: "China" },
    { city: "Foshan", country: "China" },
    { city: "Santiago", country: "Chile" },
    { city: "Riyadh", country: "Saudi Arabia" },
    { city: "Baghdad", country: "Iraq" },
  ];

  const random = seedrandom("tds");
  const data = [];
  for (const { city, country } of places) {
    logUpdate(`ga2.5 - city coordinates ${data.length / 2 + 1}/${places.length}: ${city}, ${country}`);
    const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams({ format: "jsonv2", city, country });
    const result = await fetch(url).then((res) => res.json());
    // Pick only addresstype == "city". Pick the highest importance item. (If multiple, just pick one)
    const options = result.filter((place) => place.addresstype === "city").sort((a, b) => b.importance - a.importance);
    const [osm_id, box] = [options[0].osm_id, options[0].boundingbox];
    const note = `Pick the osm_id ending with ${("" + osm_id).slice(-4)}.`;
    data.push({ city, country, osm_id, note, type: "minimum latitude", choices: getWrongChoices(box[0], random) });
    data.push({ city, country, osm_id, note, type: "maximum latitude", choices: getWrongChoices(box[1], random) });
  }
  return data;
});

await createQuestions("ga2.9.json", async function () {
  const random = seedrandom("tds");
  const [nPages, nRows] = [100, 30];
  const [tableTop, itemHeight, columnWidth, tableLeft, cellPadding] = [100, 20, 100, 50, 5];
  const subjects = ["Maths", "Physics", "English", "Economics", "Biology"];

  const marks = Array.from({ length: nPages }, () =>
    Array.from({ length: nRows }, () => subjects.map(() => Math.floor(random() * 90) + 10)),
  );

  const doc = new PDFDocument({ margin: 50 });
  const stream = createWriteStream(join(root, "questions", "ga2.9.pdf"));
  doc.pipe(stream);
  Array.from({ length: nPages }).forEach((_, pageIndex) => {
    if (pageIndex > 0) doc.addPage();
    doc.text(`Student marks - Group ${pageIndex + 1}`, { align: "center", underline: true });
    subjects.forEach((header, i) => {
      const x = tableLeft + i * columnWidth;
      doc.rect(x, tableTop, columnWidth, itemHeight).stroke();
      doc.text(header, x + cellPadding, tableTop + cellPadding);
    });
    marks[pageIndex].forEach((row, rowIndex) => {
      const y = tableTop + (rowIndex + 1) * itemHeight;
      row.forEach((cell, cellIndex) => {
        const x = tableLeft + cellIndex * columnWidth;
        doc.rect(x, y, columnWidth, itemHeight).stroke();
        doc.text(cell, x + cellPadding, y + cellPadding);
      });
    });
  });
  doc.end();

  const data = [];
  while (data.length < 50) {
    const start = Math.max(1, Math.floor(random() * nPages - 20));
    const end = Math.min(nPages, start + Math.floor(random() * 20) + 20);
    const subject = pick(subjects, random);
    const other = pick(subjects, random);
    const cutoff = Math.floor(random() * 70) + 10;
    const subjectIndex = subjects.indexOf(subject);
    const otherIndex = subjects.indexOf(other);
    const markSet = marks
      .slice(start - 1, end) // start, end are 1-based indices. Convert to 0-based indices
      .flat()
      .filter((row) => row[otherIndex] >= cutoff)
      .map((row) => row[subjectIndex]);
    const total = markSet.reduce((sum, mark) => sum + mark, 0);
    data.push({ subject, other, cutoff, start, end, choices: getWrongChoices(total, random) });
  }
  return data;
});
