import { join } from "path";
import { createReadStream, existsSync, readFileSync, writeFileSync } from "fs";
import { parse } from "csv-parse";
import { default as seedrandom } from "seedrandom";
import { encodingForModel } from "js-tiktoken";
import { root, createQuestions, pick, getWrongChoices, choose } from "./utils.js";

const openaiApiKey = process.env.OPENAI_API_KEY;
const words = [
  "Abundance",
  "Adventure",
  "Agreement",
  "Ambitious",
  "Animation",
  "Astronomy",
  "Attention",
  "Authority",
  "Available",
  "Beautiful",
  "Boundary",
  "Campaign",
  "Celebrate",
  "Champion",
  "Consider",
  "Creative",
  "Decision",
  "Different",
  "Discovery",
  "Economic",
  "Education",
  "Elevation",
  "Emotional",
  "Encourage",
  "Essential",
  "Establish",
  "Evolution",
  "Fantastic",
  "Favorite",
  "Flexible",
  "Generation",
  "Happiness",
  "Important",
  "Industry",
  "Invention",
  "Knowledge",
  "Learning",
  "Majority",
  "Marketing",
  "Medicine",
  "Optimistic",
  "Original",
  "Positive",
  "Priority",
  "Recovery",
  "Research",
  "Solution",
  "Strategy",
  "Talented",
  "Universe",
];

// questions/temp.openaimodels.json has model list from https://api.openai.com/v1/models
if (!existsSync(join(root, "questions", "temp.openaimodels.json"))) {
  const models = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  writeFileSync(join(root, "questions", "temp.openaimodels.json"), JSON.stringify(models, null, 2));
}

// questions/temp.wordembeddings.json has embeddings for the words in the list
if (!existsSync(join(root, "questions", "temp.wordembeddings.json"))) {
  const result = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "text-embedding-3-small", input: words }),
  }).then((res) => res.json());
  const embeddings = Object.fromEntries(result.data.map((d, i) => [words[i], d.embedding]));
  writeFileSync(join(root, "questions", "temp.wordembeddings.json"), JSON.stringify(embeddings, null, 2));
}

await createQuestions("ga5.1.json", async function () {
  // Get a list of all OpenAI models that were created before 15 May 2024. Sort the models as most recent first.
  const models = JSON.parse(readFileSync(join(root, "questions", "temp.openaimodels.json"), "utf8")).data;
  models.forEach((model) => (model.date = new Date(model.created * 1000)));
  const cutoff = new Date("2024-05-15");
  const filtered = models.filter((model) => model.date < cutoff);
  filtered.sort((a, b) => b.date - a.date);
  const random = seedrandom("tds-ga5.1");

  const results = [];
  while (results.length < 50) {
    // Get "right/wrong" for the 3 questions
    const [right1, right2, right3] = [random() < 0.5, random() < 0.5, random() < 0.5];
    // To a random model, randomly add 5 days to the date and convert to YYYY-MM-DD format
    const model1 = pick(filtered, random);
    const date = new Date(model1.date);
    if (!right1) date.setDate(date.getDate() + 5);
    const model1date = date.toISOString().split("T")[0];
    // Get the index of a random model
    const model2 = pick(filtered, random);
    const model2index = filtered.indexOf(model2) + (!right2 ? 1 : 0);
    // Get the number of models between 2 random models
    const model3 = pick(filtered, random);
    const model4 = pick(filtered, random);
    const model3diff = Math.abs(filtered.indexOf(model4) - filtered.indexOf(model3)) - 1 + (!right3 ? 1 : 0);
    // Get the score
    const score = right1 * 4 + right2 * 2 + right3;
    results.push({
      model1: model1.id,
      model1date,
      model2: model2.id,
      model2index,
      model3: model3.id,
      model4: model4.id,
      model3diff,
      choices: getWrongChoices(score, random, { diff: 1, range: [0, 7] }),
    });
  }
  return results;
});

function processCard(data) {
  return Object.keys(data)
    .sort()
    .reduce((obj, key) => {
      if (key === "adr") {
        const processedAdr = processCard(data[key]);
        if (Object.keys(processedAdr).length > 0) obj[key] = processedAdr;
      } else {
        const processedValue = data[key].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        if (processedValue !== "") obj[key] = processedValue;
      }
      return obj;
    }, {});
}

await createQuestions("ga5.3.json", async function () {
  const input = createReadStream(join(root, "data", "address", "address.csv")).pipe(parse({ columns: true }));
  const rows = [];
  for await (const record of input) rows.push(record);
  const random = seedrandom("tds-ga5.3");
  const results = [];
  while (results.length < 50) {
    const cards = [];
    const attendees = [];
    // Pick 20 random rows from addresses
    for (const { fn, bday, email, tel, country, org, title, photo, url, nickname, text } of choose(rows, 20, random)) {
      attendees.push(text);
      let card = { fn, bday, email, tel, org, title, photo, url, nickname };
      if (country) card.adr = { "country-name": country };
      // Convert from dd-mm-yyyy to yyyy-mm-dd
      if (card.bday) card.bday = card.bday.split("-").reverse().join("-");
      // Delete empty string values from card
      for (const key in card) if (card[key] === "") delete card[key];
      cards.push(card);
    }
    // Get the last 5 digits of the SHA-256 hash of all the cards
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(cards.map(processCard), null, 2)));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const decimalValue = BigInt(`0x${hashHex}`);
    const lastFiveDigits = Number(decimalValue % 100000n);
    results.push({
      attendees: attendees.join("\n"),
      choices: getWrongChoices(lastFiveDigits, random),
    });
  }
  return results;
});

await createQuestions("ga5.5.json", async function () {
  // In the embedding vector of the word **${word}** using `text-embedding-3-small`, how many of the 1,536 values are greater than **${cutoff}**?
  const random = seedrandom("tds-ga5.5");
  const embeddings = JSON.parse(readFileSync(join(root, "questions", "temp.wordembeddings.json"), "utf8"));
  const results = words.map((word, i) => {
    const embedding = embeddings[word];
    // Most embedding vector values are somewhat normally distributed between -0.05 to +0.05
    const cutoff = (random() - 0.5) * 0.1;
    const count = embedding.filter((v) => v > cutoff).length;
    return { word, cutoff, choices: getWrongChoices(count, random) };
  });
  return results;
});

function distance(word1, word2, embeddings) {
  const embedding1 = embeddings[word1];
  const embedding2 = embeddings[word2];
  return embedding1.reduce((acc, v, i) => acc + v * embedding2[i], 0);
}

await createQuestions("ga5.6.json", async function () {
  // What is the cosine similarity between the `text-embedding-3-small` embeddings of **${word1}** and **${word2}**?
  const random = seedrandom("tds-ga5.6");
  const embeddings = JSON.parse(readFileSync(join(root, "questions", "temp.wordembeddings.json"), "utf8"));
  const results = [];
  while (results.length < 50) {
    const [word1, word2] = choose(words, 2, random);
    results.push({ word1, word2, choices: getWrongChoices(distance(word1, word2, embeddings), random, { diff: 0.01, range: [0, 1] }) });
  }
  return results;
});

await createQuestions("ga5.7.json", async function () {
  // Which of the following word lists has the highest average cosine similarity with the word **${word}** using `text-embedding-3-small`?
  const random = seedrandom("tds-ga5.7");
  const embeddings = JSON.parse(readFileSync(join(root, "questions", "temp.wordembeddings.json"), "utf8"));
  const results = [];
  while (results.length < 50) {
    const word = pick(words, random);
    const wordsets = Array.from({ length: 4 }, () => choose(words, 4, random));
    const distances = wordsets.map((words) => words.map((w) => distance(word, w, embeddings)));
    const meanDistances = distances.map((d) => d.reduce((acc, v) => acc + v, 0) / d.length);
    const maxMeanDistance = Math.max(...meanDistances);
    const choices = wordsets.map((wordset, i) => ({
      text: wordset.join(", "),
      score: meanDistances[i] === maxMeanDistance ? 1 : 0,
    }));
    results.push({ word, choices });
  }
  return results;
});

await createQuestions("ga5.8.json", async function () {
  // If you passed the following text to the `gpt-3.5-turbo-0125` model, how many **cents** would it cost, assuming that the cost per million input token is 50 cents?
  const random = seedrandom("tds-ga4.1");
  const texts = [
    "The quick brown fox jumps over the lazy dog near the riverbank.",
    "Un chat noir marche lentement sur le toit d'une vieille maison en ruines.",
    "El sol brilla intensamente sobre la playa llena de turistas disfrutando del verano.",
    "La luna llena ilumina el camino del bosque oscuro y misterioso durante la noche.",
    "Eine kleine Maus läuft schnell durch den grünen Garten auf der Suche nach Käse.",
    "Il vento soffia forte tra gli alberi alti della foresta, creando un suono inquietante.",
    "Uma criança brinca alegremente no parque, correndo atrás de uma pipa colorida no céu.",
    "Dans le silence de la nuit, on entend les chouettes hululer au loin.",
    "La neve cade lentamente, recoprendo il paesaggio di un bianco puro e immacolato.",
    "Un perro ladra ruidosamente mientras persigue a una ardilla por el patio trasero.",
    "Hej! Vad gör du här? Jag trodde att du var på semester med familjen.",
    "På en solig dag i juni, satt vi på stranden och njöt av värmen.",
    "En liten pojke spelar fotboll med sina vänner på en grön äng nära skolan.",
    "在一个晴朗的早晨，鸟儿在树枝上愉快地歌唱，迎接新的一天。",
    "在热闹的市场里，商贩们叫卖着各种新鲜的水果和蔬菜。",
    "私は静かな図書館で本を読みながら、時間の流れを忘れてしまいました。",
    "公園のベンチに座って、落ち葉が風に舞うのを見ていました。",
    "햇빛이 비치는 공원에서 아이들이 즐겁게 뛰어놀고 있습니다.",
    "따뜻한 봄날, 꽃들이 활짝 피어 아름다운 풍경을 이루고 있습니다.",
    "На берегу реки стояла старая лодка, наполовину скрытая в тени деревьев.",
    "В лесу, далеко от города, было тихо и спокойно, только птицы пели.",
    "Der Himmel war klar und blau, als die Sonne langsam hinter den Bergen verschwand.",
    "Die Kinder spielten fröhlich auf dem Spielplatz, ihre Stimmen erfüllten die Luft.",
    "Le bateau glissait doucement sur l'eau, laissant une traînée d'écume derrière lui.",
    "Les étoiles brillaient intensément dans le ciel nocturne, illuminant le chemin devant nous.",
    "El gato duerme plácidamente en el sofá, completamente ajeno al bullicio alrededor.",
    "En el jardín, las flores de colores vibrantes se balancean suavemente con la brisa.",
    "La ciudad estaba llena de vida, con personas yendo y viniendo sin cesar.",
    "En una noche fría de invierno, la chimenea ardía, calentando la casa.",
    "O mar estava calmo e azul, refletindo o céu sem nuvens acima dele.",
    "Em uma noite estrelada, sentamos na varanda, observando as constelações no céu.",
    "No bosque, os pássaros cantavam alegremente, criando uma sinfonia natural.",
    "Il pleut des cordes, et les rues de la ville sont désertes.",
    "La musique douce jouait en arrière-plan pendant que nous dînions.",
    "Un niño curioso mira por la ventana, esperando ver pasar el tren.",
    "Los árboles se mecían suavemente con el viento en la tarde de otoño.",
    "在古老的城市里，狭窄的小巷充满了历史的气息。",
    "夜晚的灯火映照在河面上，闪闪发光，犹如星辰。",
    "森林里的动物们在夜晚悄悄地活动，不被人们察觉。",
    "我们坐在篝火旁，听着老人的故事，感觉像回到了过去。",
    "空は青く澄んでいて、雲一つない晴天が広がっていた。",
    "小さなカフェで、コーヒーを飲みながら友人と楽しいひと時を過ごしました。",
    "여름의 따뜻한 햇살이 해변을 비추고, 사람들은 즐겁게 물놀이를 하고 있습니다.",
    "친구들과 함께 산책을 하며, 자연의 아름다움을 만끽했습니다.",
    "На крыше старого дома гнездились ласточки, готовясь к полету.",
    "Вечер был тихий и теплый, и мы сидели у реки, разговаривая.",
    "Das kleine Dorf lag friedlich im Tal, umgeben von hohen Bergen.",
    "Auf der Wiese blühten bunte Blumen, die Bienen summten fröhlich herum.",
    "La forêt était dense et mystérieuse, chaque pas résonnait dans le silence.",
    "Le soleil se levait lentement, baignant la campagne d'une lumière dorée.",
  ];
  const encoder = encodingForModel("gpt-3.5-turbo");
  const result = texts.map((text) => {
    const tokens = encoder.encode(text).length;
    const cents = (tokens / 1000000) * 50;
    return { text, choices: getWrongChoices(cents, random, { diff: 50 / 1e6, range: [0, 1] }) };
  });
  return result;
});
