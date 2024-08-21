import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Portal uses a CSS framework that clears list bullets, link colors, etc. Reset those.
const courseCSSReset = `<style scoped>${readFileSync(join(root, "html", "reset.css"), "utf8")}</style>`;

// Render Markdown text as HTML
function html(text, { course, questions } = {}) {
  let result = marked.parse(text).trim();
  // Tables format better with a class="table"
  result = result.replace(/<table>/g, '<table class="table">');
  // Use <gcb-code> instead of <code> because JK said so
  result = result.replace(/<pre><code>/g, "<gcb-code>").replace(/<\/code><\/pre>/g, "</gcb-code>");
  // Don't wrap single-line Markdown in <p> tags
  if ((text.match(/\n/g) ?? []).length < 2) result = result.replace(/^<p>|<\/p>$/g, "");
  if (course) {
    // Add course stylesheet
    result = courseCSSReset + result;
    // Remove the first <h1> tag
    result = result.replace(/<h1>.*?<\/h1>/, "");
  }
  return result;
}

// Check if file1 & file2 exist and file1 is newer than file2
function existsAndNewer(file1, file2) {
  if (!existsSync(file1) || !existsSync(file2)) return false;
  return statSync(file1).mtimeMs > statSync(file2).mtimeMs;
}

// These fields are common to all questions
const mcq_dict = {
  version: "1.5",
  defaultFeedback: "",
  all_or_nothing_grading: false,
  show_answer_when_incorrect: false,
  multiple_selections: false,
  multiple_correct: false,
  tags: [],
  type: 0,
};
const short_answer_dict = {
  version: "1.5",
  defaultFeedback: "",
  rows: 1,
  columns: 100,
  hint: "",
  inline_qtype: false,
  tags: [],
  type: 1,
};

// Convert questions/*.yaml to questions/*.json
const questionsDir = join(root, "questions");
const files = readdirSync(questionsDir).filter((file) => file.endsWith(".yaml"));
files.forEach((file) => {
  const yamlFileName = join(questionsDir, file);
  const jsonFileName = join(questionsDir, file.replace(".yaml", ".json"));
  if (existsAndNewer(jsonFileName, yamlFileName)) return;

  console.log(file, "updated");
  const questions = load(readFileSync(yamlFileName, "utf8"));
  const json_data = { question_type: "0", questions: [] };

  questions.forEach((item) => {
    // If "data": [...] is specified, create 1 question for each data element, substituting values using ${field}
    if (item.data) {
      // If "data": "ga1-1.json" load data from ga1-1.json
      const data = typeof item.data == "string" ? JSON.parse(readFileSync(join(questionsDir, item.data), "utf8")) : item.data;
      // Create a copy of the questions
      data.forEach((element, i) => {
        element.id = i + 1;
        // Replace ${field} with the value from the data element and add the question to the JSON
        json_data.questions.push({
          question: html(item.question.replace(/\${(.*?)}/g, (_, field) => element[field])),
          description: `${item.description}-${element.id}`,
          choices: element.choices.sort(() => Math.random() - 0.5),
          ...mcq_dict,
        });
      });
    } else if (item.choices) {
      // If "choices": [...] is specified directly, create 1 question with multiple choices
      json_data.questions.push({
        question: html(item.question),
        description: item.description,
        choices: item.choices.map((choice) => ({
          score: choice.score,
          text: html(String(choice.text)),
          feedback: "",
        })),
        ...mcq_dict,
      });
    } else if (item.graders) {
      json_data.questions.push({
        question: html(item.question),
        description: item.description,
        graders: item.graders,
        ...short_answer_dict,
      });
    }
  });

  // Validate that only one of the data[].choices has a score = 1 and rest have score = 0
  json_data.questions.forEach((question, i) => {
    if (question.choices) {
      const scores = question.choices.map((choice) => choice.score);
      const correctCount = scores.filter((d) => d === 1).length;
      const wrongCount = scores.filter((d) => d === 0).length;
      if (correctCount != 1 || correctCount + wrongCount != scores.length)
        throw new Error(`${question.description} #${i + 1} has wrong scores: ${JSON.stringify(question)}`);
    } else if (question.graders) {
      // Find the grader with score == 1
      const correctGrader = question.graders.find((grader) => grader.score == 1);
      if (!correctGrader) throw new Error(`${question.description} #${i + 1} has no correct grader: ${JSON.stringify(question)}`);
      // ensure grader has matcher, response fields
      if (!correctGrader.matcher || !correctGrader.response)
        throw new Error(`${question.description} #${i + 1} needs grader with matcher & response: ${JSON.stringify(question)}`);
    } else throw new Error(`${question.description} #${i + 1} has no choices or graders: ${JSON.stringify(question)}`);
  });

  writeFileSync(jsonFileName, JSON.stringify(json_data, null, 2), "utf8");
});

// Convert /*.md to html/*.html
const markdownDir = root;
const markdownFiles = readdirSync(markdownDir).filter((file) => file.endsWith(".md"));
markdownFiles.forEach((file) => {
  const markdownFileName = join(markdownDir, file);
  const htmlFileName = file.replace(".md", ".html");
  if (existsAndNewer(join(markdownDir, "html", htmlFileName), markdownFileName)) return;

  console.log(file, "updated");
  const markdown = readFileSync(markdownFileName, "utf8");
  const htmlText = html(markdown, { course: true });

  writeFileSync(join(markdownDir, "html", htmlFileName), htmlText, "utf8");
});
