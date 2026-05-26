# 10 · LaTeX

?> **TL;DR**
?> LaTeX is the typesetting system universities and scientific journals have used for 40 years. It separates content from layout, produces stunning PDFs, and makes equations + references feel automatic. You'll use it to generate the PDF documentation in **Lab 1.2** and any project report you write.

## Why LaTeX?

For most writing, Markdown is easier. But LaTeX is essential when you need:

- **Mathematical equations** — nothing else comes close.
- **Bibliographies and citations** — add papers to a `.bib` file, cite with `\cite{key}`, get a formatted reference list automatically.
- **Consistency across 50+ pages** — headers, page numbers, figure numbering, table of contents all "just work".
- **Journal / conference templates** — NeurIPS, IEEE, ACM all publish `.tex` templates.
- **Reproducible PDFs** — source control a `.tex` file; anyone running `pdflatex` gets the same output.

<YouTube id="ydOTMQC7np0" title="LaTeX Tutorial - A Complete Beginner's Guide" />

## The Two Ways to Use LaTeX

### Option A — Overleaf (the easy way)

[Overleaf](https://www.overleaf.com/) is a web-based LaTeX editor. No install, live preview, free for personal use, collaborative like Google Docs.

1. Go to [overleaf.com](https://www.overleaf.com/).
2. Sign up (free tier is fine).
3. **New Project → Blank Project**.
4. Edit the left pane, watch PDF render on the right.

This is how 90% of students use LaTeX. **Start here.**

### Option B — Local install with `pandoc` (for Lab 1.2)

For automated builds (CI, GitHub Actions), you want a local LaTeX + `pandoc` install.

<details>
<summary><b>macOS</b></summary>

```bash
# MacTeX is huge (~4 GB). For most people, BasicTeX is enough:
brew install --cask basictex
# Then add packages as needed:
sudo tlmgr update --self
sudo tlmgr install collection-fontsrecommended

# Pandoc for Markdown → LaTeX conversion
brew install pandoc
```
</details>

<details>
<summary><b>Linux (Ubuntu)</b></summary>

```bash
sudo apt install texlive-full pandoc      # ~5 GB
# Or lighter:
sudo apt install texlive-latex-recommended texlive-fonts-recommended texlive-latex-extra pandoc
```
</details>

<details>
<summary><b>Windows</b></summary>

Download [MiKTeX](https://miktex.org/download) and [pandoc](https://pandoc.org/installing.html). MiKTeX auto-installs missing packages on demand.
</details>

Verify:

```bash
pdflatex --version
pandoc --version
```

## Your First Document

```latex title="hello.tex"
\documentclass[11pt]{article}

\usepackage[a4paper,margin=1in]{geometry}
\usepackage{hyperref}              % clickable links
\usepackage{graphicx}               % include images
\usepackage{amsmath, amssymb}       % math

\title{Tools in Data Science}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
LaTeX turns plain text into \textbf{professional documents}.

\section{Math}
Einstein said $E = mc^2$. The fundamental theorem of calculus:
\begin{equation}
\int_a^b f'(x)\, dx = f(b) - f(a)
\end{equation}

\section{References}
Visit \url{https://iitm.ac.in}.

\end{document}
```

Compile:

```bash
pdflatex hello.tex         # creates hello.pdf
```

?> **Two compiles for correct cross-refs**
?> LaTeX needs **two passes** to resolve forward references (table of contents, `\ref{}`, page numbers). Always run `pdflatex` twice, or use `latexmk`:
?> ```bash
?> latexmk -pdf hello.tex
?> ```

## Essential Structure Commands

```latex
\documentclass[options]{class}     % article | report | book | beamer (slides)

\usepackage{pkg}                   % import package (hyperref, graphicx, etc.)

\title{...} \author{...} \date{...}
\maketitle                         % render title block

\tableofcontents                   % auto-generated TOC

\section{Intro}                    % H1
\subsection{Background}            % H2
\subsubsection{Details}            % H3

\label{sec:intro}                  % attach a label
Refer to Section~\ref{sec:intro}.  % reference it
```

## Text Formatting

| LaTeX | Result |
|-------|--------|
| `\textbf{bold}` | **bold** |
| `\textit{italic}` | *italic* |
| `\texttt{code}` | `code` (monospace) |
| `\emph{emphasis}` | *emphasis* (context-aware) |
| `\underline{under}` | underlined |
| `\footnote{note}` | footnote superscript + note at page bottom |

## Math Mode — LaTeX's Superpower

Inline math with `$...$`:

```latex
The speed of light is $c \approx 3 \times 10^8$ m/s.
```

Display math with `\[ ... \]` (or `\begin{equation}...\end{equation}` for numbering):

```latex
\[
\hat{y} = \arg\max_y P(y \mid x) = \arg\max_y \frac{P(x \mid y) P(y)}{P(x)}
\]
```

Common constructs:

| LaTeX | Math |
|-------|------|
| `\frac{a}{b}` | a/b as fraction |
| `\sqrt{x}` | √x |
| `x^2`, `x_{ij}` | superscript / subscript |
| `\sum_{i=1}^n`, `\prod`, `\int` | Σ, Π, ∫ |
| `\alpha, \beta, \gamma, ... \omega` | Greek letters |
| `\mathbb{R}, \mathbb{N}` | ℝ, ℕ |
| `\mathbf{v}` | bold vector |
| `\to, \leftarrow, \Rightarrow` | arrows |
| `\leq, \geq, \neq, \approx` | relations |
| `\in, \subset, \cup, \cap` | set operations |

Matrices:

```latex
\[
A = \begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6
\end{pmatrix}
\]
```

## Images and Figures

```latex
\usepackage{graphicx}

% Just the image
\includegraphics[width=0.6\linewidth]{plots/loss.png}

% Figure with caption + label
\begin{figure}[h]                  % h = here, t = top, b = bottom, p = page
  \centering
  \includegraphics[width=0.8\linewidth]{diagram.pdf}
  \caption{Architecture of our RAG system.}
  \label{fig:arch}
\end{figure}

Refer to Figure~\ref{fig:arch}.
```

## Tables

```latex
\begin{table}[h]
  \centering
  \begin{tabular}{lcr}              % l=left, c=center, r=right
    \hline
    Model  & Accuracy & F1    \\
    \hline
    BM25   & 0.72     & 0.69  \\
    Dense  & 0.81     & 0.78  \\
    Hybrid & \textbf{0.86} & \textbf{0.84} \\
    \hline
  \end{tabular}
  \caption{Retrieval results on the TDS benchmark.}
  \label{tab:retrieval}
\end{table}
```

For prettier tables, use the `booktabs` package (`\toprule`, `\midrule`, `\bottomrule`).

## Citations with BibTeX

Create a `references.bib` file:

```bibtex title="references.bib"
@article{vaswani2017attention,
  title   = {Attention Is All You Need},
  author  = {Vaswani, Ashish and others},
  journal = {NeurIPS},
  year    = {2017}
}

@misc{astral2024uv,
  title  = {uv: An extremely fast Python package manager},
  author = {{Astral Software}},
  year   = {2024},
  url    = {https://github.com/astral-sh/uv}
}
```

In your `.tex`:

```latex
\usepackage{natbib}   % or: \usepackage{biblatex} for modern bibliography

Transformers were introduced by \cite{vaswani2017attention}.

\bibliographystyle{plain}
\bibliography{references}
```

Compile order: `pdflatex → bibtex → pdflatex → pdflatex`. Or just `latexmk -pdf`.

## Pandoc — Markdown → PDF in One Command

For Lab 1.2 we'll convert Markdown docs to LaTeX-rendered PDFs. Pandoc is the tool.

```bash
# Basic
pandoc README.md -o README.pdf

# With nice engine (unicode fonts, better typography)
pandoc README.md -o README.pdf --pdf-engine=xelatex

# With title, TOC, sections, syntax highlighting
pandoc docs/intro.md -o intro.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V colorlinks=true \
  --highlight-style=tango
```

### A Custom Template

Create `template.tex` to control the look:

```latex title="template.tex"
\documentclass[11pt, a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{fancyhdr}
\pagestyle{fancy}
\lhead{$title$}
\rhead{\today}

\title{$title$}
\author{$author$}

\begin{document}
\maketitle
\tableofcontents
\newpage

$body$

\end{document}
```

Use it:

```bash
pandoc README.md -o README.pdf \
  --template=template.tex \
  --pdf-engine=xelatex
```

## LaTeX Project Structure for Labs

```
project/
├── main.tex              # document root
├── sections/
│   ├── intro.tex
│   ├── methods.tex
│   └── results.tex
├── figures/
│   ├── arch.pdf
│   └── loss.png
├── references.bib
└── Makefile
```

In `main.tex`:

```latex
\input{sections/intro}
\input{sections/methods}
\input{sections/results}
```

Makefile:

```makefile
main.pdf: main.tex sections/*.tex references.bib
	latexmk -pdf -interaction=nonstopmode main.tex

clean:
	latexmk -C
	rm -f *.bbl *.aux *.log
```

## Common Pitfalls

!> **Special characters need escaping**
!> These characters have special meaning in LaTeX: `& % $ # _ { } ~ ^ \`
!> To print them literally: `\& \% \$ \# \_ \{ \} \~{} \^{} \textbackslash`
!>
!> Pandoc handles this for you when converting from Markdown.

?> **Missing packages**
?> `! LaTeX Error: File `xxx.sty' not found.` On TeX Live, install with `sudo tlmgr install xxx`. On MiKTeX, it auto-installs on demand.

## 5-Minute Exercise

1. Open [overleaf.com](https://www.overleaf.com/) → New Project → Blank.
2. Paste the `hello.tex` above.
3. Click Recompile → see the PDF.
4. Add an equation:
   ```latex
   \[ \sum_{i=1}^{100} i = \frac{100 \cdot 101}{2} = 5050 \]
   ```
5. Download PDF — share on Discourse.

## Further Reading

- [Overleaf Learn](https://www.overleaf.com/learn) — the best LaTeX reference site
- [A Short Introduction to LaTeX2e (lshort)](https://tobi.oetiker.ch/lshort/lshort.pdf) — the classic 100-page PDF
- [pandoc manual](https://pandoc.org/MANUAL.html)
- [Detexify](https://detexify.kirelabs.org/) — draw a symbol, get the LaTeX command
- [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX)

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

