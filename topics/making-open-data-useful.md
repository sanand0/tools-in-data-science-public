# Making Open Data Useful: Lessons from Diagram Chasing

Many datasets are technically available but practically unusable. Your job is to make them useful for people who are not data scientists. Design for the lowest friction, and let people share one precise slice of truth with a link.

See how Diagram Chasing does this across projects like **CBFC Watch**, **Time Use Explorer**, **BLR Water Log**, **Votes in a name?**, and **Who is my neta?** ([CBFC Watch][1])

[![Making Open Data Useful: Lessons from Diagram Chasing](https://i.ytimg.com/vi_webp/7NCUE02l1DE/sddefault.webp)](https://youtu.be/7NCUE02l1DE)

[1]: https://cbfc.watch/ "CBFC Watch: Home"
[2]: https://github.com/diagram-chasing/cbfc-watch "diagram-chasing/cbfc-watch: Public, searchable database ..."
[3]: https://diagramchasing.fun/2025/time-use-explorer "India Time Use Survey Explorer | Diagram Chasing"
[4]: https://diagramchasing.fun/ "Diagram Chasing"
[5]: https://diagramchasing.fun/2024/votes-in-a-name "Votes in a name"
[6]: https://diagramchasing.fun/2024/blr-water-log "BLR Water Log"

---

## 1. Work in three clear stages: fetch → parse → aggregate

**FETCH**
Grab the raw pages or API responses exactly as served. Use your browser’s Network tab and export a HAR if the site uses complex forms or ASP.NET state. Keep every original file. Government pages move. Data disappears. ([CBFC Watch][1])

**PARSE**
Turn HTML, PDFs, or odd spreadsheets into tidy JSON. Do minimal transformation so you can revisit decisions.

**AGGREGATE**
Join and normalize into one analyzable table, like a CSV or a SQLite file. This is the file others will actually use.

See this pattern behind **CBFC Watch** and other releases. ([GitHub][2])

---

## 2. Use the Network tab and HAR when scraping gets tricky

Practical steps:

1. Open DevTools, then the Network tab.
2. Click through the site until you see the request that returns the real data.
3. Export all requests as a HAR.
4. Ask an LLM to generate a scraper that replays those steps.
5. Run it and save the raw responses.

This is how the CBFC data flow was cracked and reproduced. ([CBFC Watch][1])

---

## 3. Use LLMs for **classification and extraction**, not for “finding insights”

Good uses:

- Classify a text into action types and topics.
- Extract structured fields into a strict JSON schema.
- Normalize messy strings and variants.

That is how **CBFC Watch** turned 100k free-text “cut notes” into analyzable columns, cheaply and at scale. Define the schema yourself, validate every response, and keep an audit trail. ([CBFC Watch][1])

**Mini-recipe students can follow**

1. Write the categories and edge cases in plain language.
2. Provide a JSON schema and say “respond only with valid JSON.”
3. Batch over records.
4. Validate against the schema before saving.
5. Manually spot-check a random sample.

---

## 4. Make everything linkable with permalinks

“If you cannot link to it, it will not exist.” Treat the URL as part of the product. Encode every filter and view in the query string and restore state on page load. This is why **CBFC Watch** and **BLR Water Log** are naturally shareable. ([CBFC Watch][1])

**Student tip:** when a user changes filters, update `window.history.replaceState` with the new `?params`. On load, read them back to rebuild the view.

---

## 5. Prefer static, browser-first apps that “live forever”

Most projects in this family run fully in the browser. They are fast, cost nothing to host, and are easy to archive. The **India Time Use Explorer** lets you filter and summarize tens of millions of rows entirely client-side. ([diagramchasing.fun][3])

Good defaults:

- Host on GitHub Pages or Netlify.
- Use DuckDB-WASM or sql.js for querying in the browser.
- Keep any search index external only if you must. Otherwise ship a small index file.

---

## 6. Documentation is a first-class feature

A journalist said about CBFC Watch, “You brought it on a platter.” That did not happen by accident. They publish a clear data dictionary, example analyses, and an easy starting path. Emulate that. ([CBFC Watch][1])

What to include:

- **Data dictionary** with one-line explanations and allowed values.
- **One reproducible notebook** (R, Python, or SQL in DuckDB) that rebuilds a figure from your released CSV.
- **Example queries or links** that show interesting slices.

---

## 7. Design multiple entry points for different users

Your site is one view of the data, not the only view. Offer:

- A simple search and browse view for curious readers.
- A downloadable CSV and code for developers.
- A notebook for analysts and reporters.

See the menu of paths on the **Diagram Chasing** site and project pages. ([diagramchasing.fun][4])

---

## 8. Give power without fifty toggles: a simple search box with a tiny parser

People understand “Google-like” queries. Back your search with a fast index and parse a small syntax such as:

- `field:value` for exact match
- `field:~value` for contains
- `year>=2021` for numeric comparisons

CBFC Watch uses a fast index with a simple front door rather than a wall of checkboxes. Start there. ([CBFC Watch][1])

---

## 9. Join data sources to add context

Impact comes from linking datasets. **Who is my neta?** combines affidavits, legislative activity, and geography into one experience. Document the joins and publish the provenance. ([diagramchasing.fun][4])

---

## 10. Beauty and craft matter

A well-composed narrative page beats a generic dashboard. Study the storytelling in **Votes in a name?** and the cartography in **BLR Water Log**. Use clear typography, mobile-friendly layouts, and meaningful hover states. ([diagramchasing.fun][5])

---

## 11. Common government-data headaches, with fixes

- **Spelling and language variants** → Normalize and classify with your schema and validator. ([CBFC Watch][1])
- **Cryptic codes and codebooks** → Build lookup tables and ship them with your repo. Show values in plain words, not numbers. ([diagramchasing.fun][3])
- **Ten files for one dataset** → Write one parser per file type, then standardize and append into a single table. ([diagramchasing.fun][3])
- **Maze-like portals** → Recreate the smallest UI that answers realistic questions and make it linkable. Compare your flow to Diagram Chasing’s examples. ([diagramchasing.fun][4])

---

## 12. Minimal, modern stack that students can ship

- **Scraping**: DevTools Network + HAR; Playwright or `httpx`; keep raw responses. ([CBFC Watch][1])
- **Cleaning**: Python or R with Pandas/Dplyr; DuckDB for joins.
- **LLM-ops**: Small batches with a strict JSON schema and a validator. ([CBFC Watch][1])
- **Search**: Typesense or a small client-side index; add a tiny query parser. ([CBFC Watch][1])
- **Web**: Static site with MapLibre or a light charting library. See **BLR Water Log** and **Time Use Explorer** for inspiration. ([diagramchasing.fun][6])
- **Docs**: Markdown pages in the repo; one notebook that runs end-to-end.

---

## Case studies

- **CBFC Watch** — a first searchable archive of film modifications, with deep links, context charts, and open data. ([CBFC Watch][1])
- **India Time Use Explorer** — a static, browser-only explorer for a huge national survey, with a data dictionary and “how to use.” ([diagramchasing.fun][3])
- **BLR Water Log** — a static map that visualizes natural drainage and flood risk across Bengaluru. ([diagramchasing.fun][6])
- **Votes in a name?** — a narrative analysis with meaningful visuals that investigates namesake candidates. ([diagramchasing.fun][5])
- **Who is my neta?** — a unified view that joins multiple public sources into a civic tool. ([diagramchasing.fun][4])
