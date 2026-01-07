# CSS Basics (Beginner Guide)

This note explains:

- What CSS is (and is not)
- How CSS connects to HTML
- The basic shape of a CSS rule
- Common selectors and properties
- The box model
- How to open the diagram in draw.io / diagrams.net

---

## What CSS is

**CSS (Cascading Style Sheets)** controls the **look and layout** of web pages.
It changes colors, spacing, fonts, and how elements are arranged.

CSS is **not** the same as:
- **HTML** (structure)
- **JavaScript** (behavior)

---

## How CSS connects to HTML

There are three common ways to add CSS:

1. **External file** (most common)
```html
<link rel="stylesheet" href="styles.css">
```

2. **Internal style tag**
```html
<style>
  p { color: navy; }
</style>
```

3. **Inline style attribute** (quick but usually avoided)
```html
<p style="color: navy;">Hello</p>
```

---

## The basic shape of a CSS rule

```css
selector {
  property: value;
}
```

Example:
```css
h1 {
  color: #2b4c7e;
  font-size: 32px;
}
```

---

## Common selectors

- **Element selector**: `p` (all paragraphs)
- **Class selector**: `.button` (all elements with class="button")
- **ID selector**: `#hero` (the one element with id="hero")
- **Descendant selector**: `.card h2` (h2 inside .card)

---

## Common properties

- `color` and `background-color`
- `font-size` and `font-family`
- `margin` and `padding`
- `border`
- `width` and `height`
- `display` (block, inline, flex)

---

## The box model (simple idea)

Every element is a rectangle with layers:

1. **Content** (text or image)
2. **Padding** (space inside the border)
3. **Border** (the line around the element)
4. **Margin** (space outside the border)

---

## Cascading (which rule wins)

When two rules conflict:
- The **more specific** selector usually wins.
- If specificity is equal, the **later** rule wins.

---

## Diagrams (draw.io / diagrams.net)

Open this `.drawio` file in draw.io / diagrams.net (File -> Open From -> Device):

- `bridging/css-box-model.drawio`
