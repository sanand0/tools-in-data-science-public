document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(document.querySelector("form"));
  const input = data.get("json");
  const resultElement = document.getElementById("result");
  const processedJsonElement = document.getElementById("processedJson");
  const errorsElement = document.getElementById("errors");

  try {
    let data = JSON.parse(input);
    // Ensure data is an object
    if (typeof data !== "object" || Array.isArray(data)) return (errorsElement.text = "JSON schema must be an object");
    // Remove top-level $schema key
    if (data.$schema) delete data.$schema;
    // Sort keys and convert to JSON
    const processedJSON = JSON.stringify(processObject(data), null, 2);
    processedJsonElement.textContent = processedJSON;

    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(processedJSON));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const decimalValue = BigInt(`0x${hashHex}`);
    const lastFiveDigits = decimalValue % 100000n;
    resultElement.innerHTML = `Validation Code: <span style="color: #4CAF50;">${lastFiveDigits.toString().padStart(5, "0")}</span>`;
    errorsElement.textContent = "";
  } catch (error) {
    errorsElement.textContent = `Error: ${error.message}`;
    resultElement.textContent = "";
    processedJsonElement.textContent = "";
  }
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
