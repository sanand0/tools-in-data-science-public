import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, writeFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const root = join(__dirname, "..");

export async function createQuestions(file, callback) {
  const questionFile = join(root, "questions", file);
  if (existsSync(questionFile)) return;
  writeFileSync(questionFile, JSON.stringify(await callback(), null, 2));
}

/** Pick n random elements from an array without replacement */
export const choose = (arr, n, random) => arr.sort(() => random() - 0.5).slice(0, n);

/** Pick a single random element from an array */
export const pick = (array, random) => array[Math.floor(random() * array.length)];

const format = Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 5,
});
const text = (number) => format.format(number);

export function getWrongChoices(correct, random, { diff, range } = { diff: 1, range: [0, 1e999] }) {
  // Randomly select 4 wrong choices sequentially before or after the correct choice
  let id = pick([0, 1, 2, 3], random);
  let start = correct - id * diff;
  while (start < range[0]) start += diff;
  while (start + 3 * diff > range[1]) start -= diff;
  const choices = [];
  for (let i = 0; i < 4; i++) {
    const value = start + i * diff;
    const error = Math.abs(value - correct);
    choices.push({ text: text(value), score: error < diff / 100 ? 1 : 0 });
  }
  return choices;
}
