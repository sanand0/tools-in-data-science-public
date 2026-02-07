## Marp: Markdown Presentation Ecosystem

[![Never use PowerPoint again (20 min)](https://i.ytimg.com/vi/EzQ-p41wNEE/sddefault.jpg)](https://youtu.be/EzQ-p41wNEE)

[Marp](https://marp.app/) (Markdown Presentation) is a powerful tool for creating presentations using Markdown. It converts Markdown files into slideshows, making it ideal for:

- **Technical Presentations**: Code snippets, diagrams, and technical content
- **Documentation**: Creating slide decks from existing documentation
- **Academic Slides**: Research presentations with math equations and citations
- **Conference Talks**: Professional presentations with custom themes
- **Teaching Materials**: Educational content with rich formatting
- **GitHub Pages**: Hosting presentations on the web

This tutorial covers using Marp in VS Code to create professional presentations.

### Installation

Install the Marp extension and CLI for different ways to preview and export:

```bash
# Install Marp CLI globally
npm install -g @marp-team/marp-cli

# For one-time use without installing
npx @marp-team/marp-cli@latest

# For use in a project
npm install --save-dev @marp-team/marp-cli
```

### Basic Structure

Every Marp presentation starts with YAML front matter and uses `---` to separate slides:

```markdown
---
marp: true
title: My Presentation
author: Your Name
theme: default
paginate: true
---

# First Slide

Content goes here

---

## Second Slide

More content
```

### Themes

Marp comes with built-in themes and supports custom themes:

```markdown
---
theme: default # Clean, minimal (default)
theme: gaia # Modern, beautiful
theme: uncover # Gradually revealing
---
```

Create custom themes with CSS:

```markdown
---
marp: true
---

<style>
section {
  background: #fdf6e3;
  color: #657b83;
}
h1 {
  color: #d33682;
}
</style>
```

### Images and Backgrounds

Marp has powerful image handling:

```markdown
![](image.jpg) # Regular image
![width:500px](image.jpg) # Set width
![height:300px](image.jpg) # Set height
![w:500 h:300](image.jpg) # Both width & height

<!-- Background image -->

![bg](background.jpg)
![bg fit](background.jpg) # Fit to slide
![bg cover](background.jpg) # Cover slide

<!-- Multiple backgrounds -->

![bg left](left.jpg)
![bg right](right.jpg)
```

### Directives

Control presentation flow with directives:

```markdown
<!-- _class: lead -->

# Title Slide

<!-- _backgroundColor: #123456 -->

Slide with custom background

<!-- _color: red -->

Red text

<!-- _footer: *Page footer* -->

Content with footer

<!-- _header: **Header** -->

Content with header
```

### Code Blocks

Code highlighting with language specification:

````markdown
```python
def hello():
    print("Hello, World!")
```

```javascript
console.log("Hello, World!");
```

```css
body {
  background: #fff;
}
```
````

### Math Equations

Marp supports math with KaTeX:

```markdown
Inline math: $E = mc^2$

Block math:

$$
\frac{d}{dx}e^x = e^x
$$
```

### Tables and Lists

Standard Markdown tables and lists work:

```markdown
| Item | Cost |
| ---- | ---- |
| A    | $1   |
| B    | $2   |

- Bullet point
  - Sub-point
    - Sub-sub-point

1. Numbered list
2. Second item
   - Mixed list
```

### Building & Exporting

Export to various formats:

```bash
# HTML (for web)
marp slides.md -o slides.html

# PDF (for sharing)
marp slides.md --pdf

# PowerPoint
marp slides.md --pptx

# Images (PNG/JPEG)
marp slides.md --images png
```

With VS Code integration:

```markdown
---
marp: true
---

<!-- In VS Code, use Command Palette:
     - "Marp: Export Slide Deck..."
     - "Marp: Start Watch"
     - "Marp: Toggle Preview"
-->
```

### Real Example: Data Design by Dialogue

Here's a [real presentation example](https://github.com/sanand0/talks/tree/main/2025-06-27-data-design-by-dialogue) and [slide output](https://sanand0.github.io/talks/2025-06-27-data-design-by-dialogue/) that shows these features in action:

```markdown
---
marp: true
title: Data Design by Dialogue
author: Anand S
theme: gaia
paginate: true
---

<style>
  blockquote {
    font-style: italic;
  }
  section {
    background-image: url('qr-code.png');
    background-repeat: no-repeat;
    background-position: top 20px right 20px;
    background-size: 80px auto;
  }
</style>

# Data Design by Dialogue

Content with styled quotes and background image...
```

### Best Practices

1. **File Organization**:

   ```
   presentation/
   ├── slides.md        # Main presentation
   ├── images/          # Images folder
   ├── themes/          # Custom themes
   └── package.json     # Build configuration
   ```

2. **Version Control**:

   ```
   .gitignore:
   node_modules/
   dist/
   *.pdf
   *.pptx
   ```

3. **Build Automation**:

   ```json
   {
     "scripts": {
       "start": "marp -s .",
       "build": "marp slides.md -o dist/slides.html",
       "pdf": "marp slides.md --pdf --allow-local-files",
       "pptx": "marp slides.md --pptx"
     }
   }
   ```

4. **Responsive Design**:
   ```css
   /* themes/custom.css */
   section {
     font-size: calc(1.2vw + 1.2vh);
   }
   ```

Remember to:

- Keep slides focused and minimal
- Use consistent styling
- Test the presentation in the target format
- Include speaker notes when needed
- Optimize images before including

### Common Issues

1. **Images Not Loading**

   - Use relative paths from the Markdown file
   - Add `--allow-local-files` for local images in PDF export

2. **Font Problems**

   - Include web fonts in your custom theme
   - Test PDF export with custom fonts

3. **Build Errors**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Use `--verbose` flag for debugging

### Keyboard Shortcuts

In VS Code Marp Preview:

- `F1` then "Marp: Toggle Preview"
- `Ctrl+Shift+V` (Preview)
- `Ctrl+K V` (Side Preview)

In Presentation Mode:

- `F` (Fullscreen)
- `P` (Presenter View)
- `B` (Blackout)
