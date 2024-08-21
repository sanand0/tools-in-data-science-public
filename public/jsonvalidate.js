document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(document.querySelector("form"));
  const input = data.get("json");
  const resultElement = document.getElementById("result");
  const processedJsonElement = document.getElementById("processedJson");
  const errorsElement = document.getElementById("errors");

  try {
    let data = JSON.parse(input);
    let errors = [];

    if (!Array.isArray(data) || data.length !== 20) errors.push(`Input must be an array of exactly 20 objects, not ${data.length}.`);
    data.forEach((obj, index) => {
      if (typeof obj !== "object" || obj === null) errors.push(`Item ${index + 1} is not an object.`);
      else {
        const allowedKeys = ["fn", "bday", "email", "tel", "adr", "org", "title", "photo", "url", "nickname"];
        Object.keys(obj).forEach((key) => {
          if (!allowedKeys.includes(key)) {
            errors.push(`Invalid key "${key}" in item ${index + 1}.`);
          }
        });

        // #TODO Delete this section for the batch after May 2024. We've fixed the dataset.
        // If fn = Michael Brown then delete the .adr and title keys.
        // This is to bypass a bug in the data, where the text description had a country (USA) and title (Manager) for Michael Brown but the data didn't.
        if (obj.fn.match(/Michael Brown/i)) {
          delete obj.adr;
          delete obj.title;
        }

        if (obj.bday && !/^\d{4}-\d{2}-\d{2}$/.test(obj.bday)) errors.push(`Invalid bday format in item ${index + 1}. Must be YYYY-MM-DD.`);
        if (obj.tel && !/^\d{3}-\d{3}-\d{4}$/.test(obj.tel)) errors.push(`Invalid tel format in item ${index + 1}. Must be nnn-nnn-nnnn.`);
        if (obj.adr) {
          if (typeof obj.adr !== "object" || obj.adr === null) errors.push(`adr must be an object in item ${index + 1}.`);
          else if (!obj.adr.hasOwnProperty("country-name")) errors.push(`adr must contain a "country-name" key in item ${index + 1}.`);
        }
        Object.entries(obj).forEach(([key, value]) => {
          if (key !== "adr" && typeof value !== "string") errors.push(`Value of "${key}" must be a string in item ${index + 1}.`);
        });
      }
    });

    if (errors.length > 0) {
      errorsElement.innerHTML = "Errors:<br>" + errors.join("<br>");
      resultElement.textContent = "";
      processedJsonElement.textContent = "";
    } else {
      errorsElement.textContent = "";
      const processedJSON = JSON.stringify(data.map(processCard), null, 2);
      processedJsonElement.textContent = processedJSON;

      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(processedJSON));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      const decimalValue = BigInt(`0x${hashHex}`);
      const lastFiveDigits = decimalValue % 100000n;
      resultElement.innerHTML = `Validation Code: <span style="color: #4CAF50;">${lastFiveDigits.toString().padStart(5, "0")}</span>`;
    }
  } catch (error) {
    errorsElement.textContent = `Error: ${error.message}`;
    resultElement.textContent = "";
    processedJsonElement.textContent = "";
  }
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
