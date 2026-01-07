# JavaScript Basics (Beginner Guide)

This note explains:

- What JavaScript is (and is not)
- How JavaScript connects to HTML and CSS
- How JavaScript changes the page (the DOM)
- How to use the browser console to run and test code
- How to open the diagram in draw.io / diagrams.net

---

## What JavaScript is

**JavaScript** adds **behavior** to web pages.
It can react to clicks, update content, and change styles.

JavaScript is **not** the same as:
- **HTML** (structure)
- **CSS** (style)

---

## How JavaScript connects to HTML

Most pages load JavaScript with a script tag:

```html
<script src="app.js" defer></script>
```

`defer` tells the browser to run the script after HTML is parsed, so elements exist before your code runs.

You can also place scripts at the end of the `<body>`:

```html
<body>
  ...
  <script src="app.js"></script>
</body>
```

---

## JavaScript can change HTML and CSS

JavaScript works with the **DOM** (Document Object Model), which is the browser's live tree of the page.

Example: add a class when a button is clicked.

```html
<button id="toggle">Toggle highlight</button>
<p id="message">Hello</p>
```

```css
.highlight {
  background: #2b4c7e;
  color: white;
  padding: 4px;
}
```

```js
const button = document.querySelector("#toggle");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.classList.toggle("highlight");
});
```

---

## Browser console: run and test JavaScript

The **console** lets you run JavaScript on the current page and see errors or logs.

### Open the console
- Windows/Linux: `F12` or `Ctrl+Shift+I`
- macOS: `Cmd+Option+I`
- Then click the **Console** tab

### Try simple commands
```js
document.title
```

```js
console.log("Hello from the console")
```

```js
document.querySelector("h1")
```

### Change the page live
```js
document.body.style.background = "#f6f3e8";
```

```js
document.querySelector("h1").textContent = "New title";
```

Notes:
- Console changes are **temporary**. Reloading the page resets them.
- Use `Shift+Enter` for multi-line code.

---

## Diagrams (draw.io / diagrams.net)

Open this `.drawio` file in draw.io / diagrams.net (File -> Open From -> Device):

- `bridging/javascript-html-css.drawio`
