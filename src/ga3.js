import { join } from "path";
import { createReadStream, existsSync, readFileSync, writeFileSync } from "fs";
import { createGunzip } from "zlib";
import { parse } from "csv-parse";
import { promisify } from "util";
import stream from "stream";
import logUpdate from "log-update";
import { default as seedrandom } from "seedrandom";
import { root, createQuestions, pick, getWrongChoices } from "./utils.js";

const monthMap = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const _logs = [];
/** Read logs from data/logs/ as an array of records. Cache in a temp file as JSON **/
async function readLogs() {
  // Read from memory cache
  if (_logs.length) return _logs;

  // Read from temporary store
  const tempLogs = join(root, "questions", "temp.apachelogs.json");
  if (existsSync(tempLogs)) {
    for (const row of JSON.parse(readFileSync(tempLogs, "utf-8"))) _logs.push(row);
    return _logs;
  }

  // Parse as CSV
  const logFile = join(root, "data", "logs", "s-anand.net-May-2024.gz");
  const parser = parse({
    delimiter: " ",
    quote: '"',
    escape: "\\",
    columns: ["ip", "identd", "userid", "datetime", "timezone", "request", "status", "size", "referer", "userAgent", "host", "serverIp"],
  });
  parser.on("data", (row) => {
    // Ignore row.timezone which is is like "-0500]". Pretend everything is local time.
    delete row.timezone;
    // row.datetime is like "[01/May/2024:00:00:00" -- with a leading "[".
    const original = row.datetime;
    const day = row.datetime.slice(1, 3);
    const month = monthMap[row.datetime.slice(4, 7)];
    const year = row.datetime.slice(8, 12);
    const time = row.datetime.slice(13);
    const date = new Date(row.datetime.slice(1, 12));
    row.datetime = `${year}-${month}-${day}T${time}`;
    [row.method, row.url, row.protocol] = row.request.split(" ");
    row.weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    if (_logs.length % 1000 === 0) logUpdate(_logs.length);
    _logs.push(row);
  });
  const input = createReadStream(logFile);
  const pipeline = promisify(stream.pipeline);
  const gunzip = new createGunzip();
  await pipeline(input, gunzip, parser);
  writeFileSync(tempLogs, JSON.stringify(_logs));
  return _logs;
}

const logFolders = [
  "blog",
  "carnatic",
  "hindi",
  "hindimp3",
  "kannada",
  "kannadamp3",
  "malayalam",
  "malayalammp3",
  "tamil",
  "tamilmp3",
  "telugu",
  "telugump3",
  "wp-content",
  "wp-includes",
];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

await createQuestions("ga3.1.json", async function () {
  // **Question**: How many **successful** **GET** requests were there for pages under `/${folder}/` starting `${hourStart}:00` and before `${hourEnd}:00` hours over all ${weekday}s?
  const random = seedrandom("tds");
  const logs = await readLogs();
  const results = [];
  while (results.length < 50) {
    const folder = pick(logFolders, random);
    const weekday = pick(weekdays, random);
    // pick a random range of hours from 0 - 24 hours so that the duration is at least 2 hours
    const startHour = Math.floor(random() * 23);
    const endHour = startHour + 2 + Math.floor(random() * (24 - startHour - 2));
    const requests = logs.filter(
      (log) =>
        log.weekday === weekday &&
        log.method === "GET" &&
        +log.status >= 200 &&
        +log.status < 300 &&
        log.url.startsWith(`/${folder}/`) &&
        +log.datetime.slice(11, 13) >= startHour &&
        +log.datetime.slice(11, 13) < endHour,
    );
    if (requests.length > 10)
      results.push({
        folder,
        startHour,
        endHour,
        weekday,
        choices: getWrongChoices(requests.length, random),
      });
  }
  return results;
});

await createQuestions("ga3.2.json", async function () {
  // How many unique IPs accessed pages under `/{folder}/` at its peak hour on ${weekday}s?
  const random = seedrandom("tds");
  const logs = await readLogs();
  const results = [];
  while (results.length < 50) {
    const folder = pick(logFolders, random);
    const weekday = pick(weekdays, random);
    const hourlyIPs = {};
    logs
      .filter((log) => log.url.startsWith(`/${folder}/`) && log.weekday == weekday)
      .forEach((log) => {
        const hour = log.datetime.slice(11, 13);
        hourlyIPs[hour] = hourlyIPs[hour] ?? new Set();
        hourlyIPs[hour].add(log.ip);
      });
    const answer = Math.max(...Object.values(hourlyIPs).map((d) => d.size));
    if (answer > 10) results.push({ folder, weekday, choices: getWrongChoices(answer, random) });
  }
  return results;
});

await createQuestions("ga3.3.json", async function () {
  // Total the "Size" of responses for pages under `/${folder}/` on ${date} by IP.
  // How many bytes did the top downloader download?
  const random = seedrandom("tds");
  const logs = await readLogs();
  const dates = [...new Set(logs.map((log) => log.datetime.slice(0, 10)))];
  const results = [];
  while (results.length < 50) {
    const folder = pick(logFolders, random);
    const date = pick(dates, random);
    const ipSize = {};
    const requests = logs.filter((log) => log.url.startsWith(`/${folder}/`) && log.datetime.startsWith(date));
    requests.forEach((log) => (ipSize[log.ip] = +log.size + (ipSize[log.ip] ?? 0)));
    const answer = Math.max(...Object.values(ipSize));
    if (answer > 10) results.push({ folder, date, choices: getWrongChoices(answer, random) });
  }
  return results;
});

await createQuestions("ga3.4.json", async function () {
  // find the number of times the browser with most common major Chrome version accessed the site on `${date}`
  const random = seedrandom("tds");
  const logs = await readLogs();
  const results = [];
  for (let day = 1; day <= 31; day++) {
    const date = `2024-05-${day.toString().padStart(2, "0")}`;
    const chromeCount = {};
    logs
      .filter((log) => log.datetime.startsWith(date))
      .forEach((log) => {
        const match = log.userAgent.match(/Chrome\/\d+/);
        if (match) chromeCount[match[0]] = (chromeCount[match[0]] ?? 0) + 1;
      });
    const answer = Math.max(...Object.values(chromeCount));
    if (answer > 10) results.push({ date, choices: getWrongChoices(answer, random) });
  }
  return results;
});

const cities = [
  ["Tokyo", "Tokio", "Tokeyo", "Tokyoo", "Toikyo", "Tokyoo"],
  ["Delhi", "Deli", "Dehli", "Dhelhi", "Delly", "Dehly"],
  ["Shanghai", "Shangai", "Shanhai", "Shanghii", "Shangaai", "Shungai"],
  ["São Paulo", "Sao Paulo", "Sao Paolo", "Sao Paoulo", "Sau Paulo", "Sao Pualo"],
  ["Mumbai", "Mumbay", "Mombai", "Mumby", "Mumbbi", "Mumbei"],
  ["Beijing", "Bejing", "Bijing", "Bejeing", "Beijng", "Bejjing"],
  ["Cairo", "Kairo", "Kairoo", "Ciro", "Cairio", "Caiiro"],
  ["Dhaka", "Daka", "Dhaaka", "Dhakaa", "Dhacka", "Dhaka"],
  ["Mexico City", "Mexico Cty", "Mexiko City", "Mexicocity", "Mexicoo City", "Mexico-City"],
  ["Osaka", "Osaca", "Oosaka", "Osakka", "Osakkaa", "Osakaa"],
  ["Karachi", "Karachee", "Karrchi", "Karachii", "Karrachii", "Karachi"],
  ["Chongqing", "Chongquin", "Chongching", "Chongching", "Chongqinq", "Chongquiing"],
  ["Istanbul", "Istambul", "Istanbul", "Istaanbul", "Istanboul", "Istnabul"],
  ["Buenos Aires", "Buenes Aires", "Buenos Aeres", "Buienos Aires", "Buenos Airres", "Buenoss Aires"],
  ["Kolkata", "Kolkotta", "Kolkatta", "Kolcata", "Kolcotta", "Kolkataa"],
  ["Lagos", "Lagoss", "Laggos", "Laggoss", "Lagoss", "Lagose"],
  ["Kinshasa", "Kinshasaa", "Kinshasha", "Kinshassa", "Kinshas", "Kinshasaa"],
  ["Manila", "Manilla", "Manilaa", "Manla", "Manil", "Mannila"],
  ["Tianjin", "Tianjin", "Tianjing", "Tiajin", "Tianjjin", "Tianjjin"],
  ["Rio de Janeiro", "Rio de Janero", "Rio de Janeirro", "Rio de Janiro", "Rio de Janerio", "Rio de Janiero"],
  ["Guangzhou", "Guangzho", "Guangzou", "Guangzhoo", "Guanzhou", "Gwangzhou"],
  ["Lahore", "Lahor", "Lahoore", "Lahoore", "Lahorre", "Lahhore"],
  ["Bangalore", "Banglore", "Bangalor", "Bengalore", "Bangaloore", "Bangaloree"],
  ["Shenzhen", "Shenzen", "Shenzen", "Shenzhen", "ShenZhen", "Shenzheen"],
  ["Moscow", "Moskow", "Mosco", "Moskoww", "Moscow", "Mowscow"],
  ["Chennai", "Chenai", "Chennay", "Chennnai", "Chenaii", "Chennnai"],
  ["Bogotá", "Bogota", "Bogotaa", "Bogotta", "Bogata", "Bogotaa"],
  ["Paris", "Parris", "Parris", "Pariss", "Paris", "Paries"],
  ["Jakarta", "Jakarata", "Jakata", "Jakkarta", "Jakarata", "Jakkarta"],
  ["London", "Londen", "Londn", "Lonndon", "Londonn", "Londdon"],
];
const products = ["Apples", "Bananas", "Chairs", "Detergent", "Eggs", "Flour", "Grapes", "Hats", "Ice Cream", "Juice"];

await createQuestions("ga3.5.json", async function () {
  let random = seedrandom("tds");
  const salesFile = join(root, "data", "city-product-sales.json");
  const secretFile = join(root, "data", "city-product-sales-secret.json");
  if (!existsSync(salesFile) || !existsSync(secretFile)) {
    const sales = Array.from({ length: 2500 }, () => {
      const cityList = pick(cities, random);
      // Create an exponential distribution of mis-spellings. If index is out of bounds, pick the first (correct) city
      const city = cityList[Math.min(Math.floor(Math.log2(random() * 2 ** cityList.length)), cityList.length - 1)] ?? cityList[0];
      return {
        original: cityList[0],
        city,
        product: pick(products, random),
        sales: Math.floor(random() * 90) + 10,
      };
    });
    writeFileSync(secretFile, JSON.stringify(sales));
    writeFileSync(salesFile, JSON.stringify(sales.map(({ city, product, sales }) => ({ city, product, sales }))));
  }

  random = seedrandom("tds");
  const sales = JSON.parse(readFileSync(secretFile, "utf-8"));
  const results = [];
  while (results.length < 50) {
    const product = pick(products, random);
    const minSales = Math.floor(random() * 50) + 10;
    const productSales = sales.filter((d) => d.product === product && d.sales >= minSales);
    // Sum the sales of each city based on the original city name
    const citySales = {};
    for (const { original, sales } of productSales) citySales[original] = sales + (citySales[original] ?? 0);
    // Find the sales of the city with the maximum sales
    const answer = Math.max(...Object.values(citySales));
    results.push({ product, minSales, choices: getWrongChoices(answer, random) });
  }
  return results;
});
