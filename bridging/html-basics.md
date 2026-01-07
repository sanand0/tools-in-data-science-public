# HTML Basics (Beginner Guide)

This note explains:

- What HTML is (and is not)
- The basic structure of a page
- Common tags and attributes
- How HTML, CSS, and JavaScript fit together
- How to open the diagram in draw.io / diagrams.net

---

## What HTML is

**HTML (HyperText Markup Language)** is the language that gives web pages their **structure**.
It tells the browser what each part of the page is: a heading, a paragraph, a list, a link, an image, and so on.

HTML is **not** the same as:
- **CSS** (style: colors, spacing, layout)
- **JavaScript** (behavior: interactivity and logic)

---

## A minimal HTML page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, world</h1>
    <p>This is a paragraph.</p>
    <a href="https://example.com">A link</a>
  </body>
</html>
```

Key parts:
- `<!doctype html>` tells the browser this is modern HTML.
- `<head>` holds page metadata (title, CSS links, scripts).
- `<body>` holds everything the user sees.

---

## Common tags you will see

- **Headings**: `<h1>` to `<h6>`
- **Text**: `<p>` for paragraphs, `<strong>` for bold
- **Links**: `<a href="...">`
- **Images**: `<img src="..." alt="...">`
- **Lists**: `<ul>` / `<ol>` with `<li>` items
- **Containers**: `<div>` (block) and `<span>` (inline)
- **Page structure**: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`

---

## Attributes (extra information on tags)

Attributes are **name=value** pairs inside a tag.

Example:
```html
<img src="cat.jpg" alt="A gray cat" class="photo">
```

Common attributes:
- `href` for links
- `src` and `alt` for images
- `id` (unique) and `class` (group) for styling and scripting

---

## HTML is a tree (nesting matters)

HTML elements live **inside** each other. The browser builds a **DOM tree** from your HTML.

Simple tree:
```
html
  head
    title
  body
    h1
    p
    a
```

Rules to remember:
- Most tags come in **pairs**: `<p> ... </p>`
- Elements should be **nested properly** (no crossing tags)

---

## How HTML works with CSS and JavaScript

Think of a web page as a team:
- **HTML**: the structure
- **CSS**: the look and layout
- **JavaScript**: the behavior

The browser loads HTML first, then applies CSS and runs JavaScript.

---

## Diagrams (draw.io / diagrams.net)

Open this `.drawio` file in draw.io / diagrams.net (File -> Open From -> Device):

- `bridging/html-structure.drawio`
