## Converting PDFs to Markdown

PDF documents are ubiquitous in academic, business, and technical contexts, but extracting and repurposing their content can be challenging. This tutorial explores various command-line tools for converting PDFs to Markdown format, with a focus on preserving structure and formatting suitable for different use cases, including preparation for Large Language Models (LLMs).

Use Cases:

- **LLM training and fine-tuning**: Create clean text data from PDFs for AI model training
- **Knowledge base creation**: Transform PDFs into searchable, editable markdown documents
- **Content repurposing**: Convert academic papers and reports for web publication
- **Data extraction**: Pull structured content from PDF documents for analysis
- **Accessibility**: Convert PDFs to more accessible formats for screen readers
- **Citation and reference management**: Extract bibliographic information from academic papers
- **Documentation conversion**: Transform technical PDFs into maintainable documentation

### PyMuPDF4LLM

[PyMuPDF4LLM](https://pymupdf.readthedocs.io/en/latest/pymupdf4llm/) is a specialized component of the PyMuPDF library that generates Markdown specifically formatted for Large Language Models. It produces high-quality markdown with good preservation of document structure. It's specifically optimized for producing text that works well with LLMs, removing irrelevant formatting while preserving semantic structure. Requires PyTorch, which adds dependencies but enables more advanced processing capabilities.

PyMuPDF4LLM uses [MuPDF](https://mupdf.com/) as its PDF parsing engine. [PyMuPDF](https://pymupdf.readthedocs.io/) is emerging as a strong default for PDF text extraction due to its accuracy and performance in handling complex PDF structures.

```bash
PYTHONUTF8=1 uv run --with pymupdf4llm python -c 'import pymupdf4llm; h = open("pymupdf4llm.md", "w"); h.write(pymupdf4llm.to_markdown("$FILE.pdf"))'
```

- `PYTHONUTF8=1`: Forces Python to use UTF-8 encoding regardless of system locale
- `uv run --with pymupdf4llm`: Uses uv package manager to run Python with the pymupdf4llm package
- `python -c '...'`: Executes Python code directly from the command line
- `import pymupdf4llm`: Imports the PDF-to-Markdown module
- `h = open("pymupdf4llm.md", "w")`: Creates a file to write the markdown output
- `h.write(pymupdf4llm.to_markdown("$FILE.pdf"))`: Converts the PDF to markdown and writes to file

## Markitdown

[![Microsoft MarkItDown - Convert Files and Office Documents to Markdown - Install Locally (9 min)](https://i.ytimg.com/vi/v65Oyddfxeg/sddefault.jpg)](https://youtu.be/v65Oyddfxeg)

[Markitdown](https://github.com/microsoft/markitdown) is Microsoft's tool for converting various document formats to Markdown, including PDFs, DOCX, XLSX, PPTX, and ZIP files. It's a versatile multi-format converter that handles PDFs via PDFMiner, DOCX via Mammoth, XLSX via Pandas, and PPTX via Python-PPTX. Good for batch processing of mixed document types. The quality of PDF conversion is generally good but may struggle with complex layouts or heavily formatted documents.

```bash
PYTHONUTF8=1 uvx markitdown $FILE.pdf > markitdown.md
```

- `PYTHONUTF8=1`: Forces Python to use UTF-8 encoding
- `uvx markitdown`: Runs the markitdown tool via the uv package manager
- `$FILE.pdf`: The input PDF file
- `> markitdown.md`: Redirects output to a markdown file

### Unstructured

[Unstructured](https://unstructured.io/) is rapidly becoming the de facto library for parsing over 40 different file types. It is excellent for extracting text and tables from diverse document formats. Particularly useful for generating clean content to pass to LLMs. Strong community support and actively maintained.

## GROBID

If you specifically need to parse references from text-native PDFs or reliably OCR'ed ones, [GROBID](https://github.com/kermitt2/grobid) remains the de facto choice. It excels at extracting structured bibliographic information with high accuracy.

```bash
# Start GROBID service
docker run -t --rm -p 8070:8070 lfoppiano/grobid:0.7.2

# Process PDF with curl
curl -X POST -F "input=@paper.pdf" localhost:8070/api/processFulltextDocument > references.tei.xml
```

### Mistral OCR API

[Mistral OCR](https://mistral.ai/products/ocr/) offers an end-to-end cloud API that preserves both text and layout, making it easier to isolate specific sections like References. It shows the most promise currently, though it requires post-processing.

## Azure Document Intelligence API

For enterprise users already in the Microsoft ecosystem, [Azure Document Intelligence](https://azure.microsoft.com/en-us/products/ai-services/document-intelligence) provides excellent raw OCR with enterprise SLAs. May require custom model training or post-processing to match GROBID's reference extraction capabilities.

### Other libraries

[Docling](https://github.com/DS4SD/docling) is IBM's document understanding library that supports PDF conversion. It can be challenging to install, particularly on Windows and some Linux distributions. Offers advanced document understanding capabilities beyond simple text extraction.

[MegaParse](https://github.com/QuivrHQ/MegaParse) takes a comprehensive approach using LibreOffice, Pandoc, Tesseract OCR, and other tools. It has Robust handling of different document types but requires an OpenAI API key for some features. Good for complex documents but has significant dependencies.

## Comparison of PDF-to-Markdown Tools

| Tool         | Strengths                                | Weaknesses                   | Best For                             |
| ------------ | ---------------------------------------- | ---------------------------- | ------------------------------------ |
| PyMuPDF4LLM  | Structure preservation, LLM optimization | Requires PyTorch             | AI training data, semantic structure |
| Markitdown   | Multi-format support, simple usage       | Less precise layout handling | Batch processing, mixed documents    |
| Unstructured | Wide format support, active development  | Can be resource-intensive    | Production pipelines, integration    |
| GROBID       | Reference extraction excellence          | Narrower use case            | Academic papers, citations           |
| Docling      | Advanced document understanding          | Installation difficulties    | Research applications                |
| MegaParse    | Comprehensive approach                   | Requires OpenAI API          | Complex documents, OCR needs         |

How to pick:

- **Need LLM-ready content?** PyMuPDF4LLM is specifically designed for this
- **Working with multiple document formats?** Markitdown handles diverse inputs
- **Extracting academic references?** GROBID remains the standard
- **Building a production pipeline?** Unstructured offers the best integration options
- **Handling complex layouts?** Consider commercial OCR like Mistral or Azure Document Intelligence

The optimal approach depends on your specific requirements regarding accuracy, structure preservation, and the intended use of the extracted content.

## Tips for Optimal PDF Conversion

1. **Pre-process PDFs** when possible:

   ```bash
   # Optimize a PDF for text extraction first
   ocrmypdf --optimize 3 --skip-text input.pdf optimized.pdf
   ```

2. **Try multiple tools** on the same document to compare results:

3. **Handle scanned PDFs** appropriately:

   ```bash
   # For scanned documents, run OCR first
   ocrmypdf --force-ocr input.pdf ocr_ready.pdf
   PYTHONUTF8=1 uvx markitdown ocr_ready.pdf > markitdown.md
   ```

4. **Consider post-processing** for better results:

   ```bash
   # Simple post-processing example
   sed -i 's/\([A-Z]\)\./\1\.\n/g' output.md  # Add line breaks after sentences
   ```
