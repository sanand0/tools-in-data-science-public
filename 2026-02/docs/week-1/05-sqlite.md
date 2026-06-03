# 05 · SQLite

?> **TL;DR**
?> SQLite is the most-deployed database engine in existence — it runs in Firefox, iOS, Android, airplanes, and every Python install. It's a **single file** on disk. For the projects in this course (up to a few million rows), SQLite is often the right answer.

## Why SQLite?

- **Zero config** — no server, no user management, no port to open. Just a `.sqlite` file.
- **Ships with Python** — `import sqlite3` works out of the box.
- **ACID-compliant** — real transactions, real guarantees.
- **Extremely fast** — for local workloads, often faster than Postgres (no network round-trips).
- **Fantastic tooling** — `sqlite-utils` and `datasette` from Simon Willison turn any `.sqlite` file into a queryable web UI.

[![SQLite in 100 Seconds](https://img.youtube.com/vi/pFr80VSP8iw/0.jpg)](https://youtu.be/pFr80VSP8iw "SQLite in 100 Seconds")

## Install the CLI and Helpers

The SQLite library is already everywhere. Install the CLI tool and the wrapper we'll actually use:

```bash
# Mac
brew install sqlite
# Ubuntu/Debian
sudo apt install sqlite3

# Then (via uv):
uv tool install sqlite-utils
uv tool install datasette
```

Verify:

```bash
sqlite3 --version       # 3.45+ expected
sqlite-utils --version  # 3.x
datasette --version
```

## Your First Database — in 30 Seconds

```bash
# Create (implicitly) and insert from JSON:
echo '[{"name": "Cleo", "age": 4}, {"name": "Pancakes", "age": 2}]' \
  | sqlite-utils insert pets.db dogs -

# Query:
sqlite-utils pets.db "select * from dogs where age > 3"
# [{"name": "Cleo", "age": 4}]
```

That's it. You now have a relational database, queryable by SQL, in one file. No server started, no credentials configured.

## The Core SQL You Need

```sql
-- Create a table
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,          -- 0 or 1 (SQLite has no native BOOL)
    due_date TEXT,                    -- ISO 8601 string
    created_at TEXT DEFAULT (datetime('now'))
);

-- Insert
INSERT INTO tasks (title, due_date) VALUES ('Read TDS week 1', '2026-05-10');

-- Read
SELECT * FROM tasks WHERE done = 0 ORDER BY due_date;

-- Update
UPDATE tasks SET done = 1 WHERE id = 1;

-- Delete
DELETE FROM tasks WHERE id = 1;

-- Aggregations
SELECT COUNT(*) AS open_count FROM tasks WHERE done = 0;
SELECT date(due_date) AS day, COUNT(*) AS n FROM tasks GROUP BY day;
```

## WAL Mode — Always Enable This

By default, SQLite uses a rollback journal that locks the whole database during writes. **WAL (Write-Ahead Logging) mode** lets readers and writers work concurrently.

```sql
PRAGMA journal_mode = WAL;           -- one-time; persists in the file
PRAGMA synchronous = NORMAL;          -- WAL + NORMAL = sweet spot
PRAGMA foreign_keys = ON;
```

?> **When to enable WAL**
?> Almost always. The only cases where you'd avoid WAL are read-only databases or databases on a network filesystem (WAL requires real shared-memory).

## FTS5 — Full-Text Search

SQLite's FTS5 module turns any text column into a blazing-fast searchable index. This powers everything from Apple Spotlight to Firefox history to countless mobile apps.

### The easy way with `sqlite-utils`

```bash
# Assume 'tasks' table has a 'title' column
sqlite-utils enable-fts tasks.db tasks title --create-triggers

# Now search!
sqlite-utils search tasks.db tasks "groceries"
```

The `--create-triggers` flag keeps the FTS index automatically synced whenever you insert/update/delete from the main table.

### The manual way (for reference)

```sql
CREATE VIRTUAL TABLE tasks_fts USING fts5(
    title,
    content='tasks',           -- shadow the tasks table
    content_rowid='id'
);

-- Populate
INSERT INTO tasks_fts(rowid, title) SELECT id, title FROM tasks;

-- Search with ranking
SELECT t.*, rank
FROM tasks t
JOIN tasks_fts ON tasks_fts.rowid = t.id
WHERE tasks_fts MATCH 'grocery OR shopping'
ORDER BY rank;

-- Prefix search (great for autocomplete)
SELECT * FROM tasks_fts WHERE tasks_fts MATCH 'groc*';

-- Phrase search
SELECT * FROM tasks_fts WHERE tasks_fts MATCH '"to do"';
```

## `sqlite-utils` Cheat Sheet

`sqlite-utils` is the command-line + Python swiss-army knife for SQLite. It imports CSV/JSON, alters schema, creates indexes, and more — all without hand-writing SQL.

```bash
# Import a CSV file
sqlite-utils insert logs.db access access.csv --csv

# Add a column
sqlite-utils add-column logs.db access status_code INTEGER

# Create an index
sqlite-utils create-index logs.db access timestamp

# Run a query as JSON / CSV / markdown
sqlite-utils logs.db "select * from access limit 5"
sqlite-utils logs.db "select * from access limit 5" --csv
sqlite-utils logs.db "select * from access limit 5" --fmt github

# Schema inspection
sqlite-utils schema logs.db
sqlite-utils tables logs.db --counts

# Extract a column into its own lookup table (normalize)
sqlite-utils extract logs.db access user_agent --table user_agents
```

### Python library

```python title="load_csv.py"
import sqlite_utils

db = sqlite_utils.Database("logs.db")

# Auto-create table from records
db["events"].insert_all([
    {"user": "alice", "action": "login"},
    {"user": "bob",   "action": "view"},
], pk="id")

# Query
for row in db.query("SELECT action, COUNT(*) AS n FROM events GROUP BY action"):
    print(row)

# Enable FTS
db["events"].enable_fts(["user", "action"], create_triggers=True)
```

## Datasette — Instant Web UI for Your Data

Point `datasette` at a `.sqlite` file and get a **full web application** — browsable tables, filter UIs, SQL playground, JSON/CSV downloads, plugin ecosystem. This is how most "public data" sites (census, journalism) expose their SQLite files.

```bash
datasette serve tasks.db
# Open http://localhost:8001
```

Publish it to the web for free on HuggingFace Spaces / Vercel:

```bash
datasette publish vercel tasks.db --project my-tasks
```

Add plugins:

```bash
datasette install datasette-graphql   # GraphQL endpoint
datasette install datasette-dashboards # dashboards
```

?> **Use case: publish a course dataset**
?> If you scrape or build a dataset in another week, `sqlite-utils insert + datasette publish` is the fastest way to ship a browsable version to the internet.

## Connecting from Python

You almost never need raw `sqlite3`, but here it is:

```python
import sqlite3

con = sqlite3.connect("tasks.db")
con.row_factory = sqlite3.Row          # dict-like rows
con.execute("PRAGMA journal_mode = WAL")
con.execute("PRAGMA foreign_keys = ON")

cur = con.execute("SELECT * FROM tasks WHERE done = ?", (0,))
for row in cur:
    print(row["title"])

con.commit()
con.close()
```

**Always parameterize queries.** Never f-string values into SQL — that's how you get SQL-injected.

```python
# WRONG — vulnerable to injection
con.execute(f"SELECT * FROM users WHERE name = '{user_name}'")

# CORRECT — parameterized
con.execute("SELECT * FROM users WHERE name = ?", (user_name,))
```

## JSON1 — Storing JSON in Columns

SQLite's built-in JSON1 extension lets you mix relational + document storage:

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY,
    ts TEXT,
    payload TEXT CHECK (json_valid(payload))
);

INSERT INTO events VALUES (1, '2026-01-01', '{"user": "a", "score": 10}');

-- Extract fields
SELECT json_extract(payload, '$.user') AS user,
       json_extract(payload, '$.score') AS score
FROM events;

-- Shorthand (SQLite 3.38+)
SELECT payload ->> 'user' AS user, payload ->> 'score' AS score FROM events;
```

## Performance Tips

1. **Add indexes to columns used in `WHERE`, `JOIN`, `ORDER BY`.** Without them, SQLite scans the table.
   ```sql
   CREATE INDEX idx_tasks_due ON tasks(due_date);
   ```
2. **Wrap bulk inserts in a transaction.** 10× faster:
   ```python
   with con:
       con.executemany("INSERT INTO events VALUES (?, ?)", rows)
   ```
3. **Use `EXPLAIN QUERY PLAN`** to see what SQLite is actually doing:
   ```sql
   EXPLAIN QUERY PLAN SELECT * FROM tasks WHERE due_date > '2026-01-01';
   ```
4. **After bulk inserts into an FTS5 table, rebuild:**
   ```sql
   INSERT INTO tasks_fts(tasks_fts) VALUES('rebuild');
   ```

## Common Pitfalls

!> **SQLite is not a client-server DB**
!> If multiple processes on different machines need to write the same database, use Postgres. SQLite excels at single-process or single-machine workloads.

!> **No real `DATE` type**
!> SQLite stores dates as `TEXT` (ISO 8601), `REAL` (Julian day), or `INTEGER` (Unix epoch). Pick one and stick with it. The ecosystem has standardized on ISO 8601 strings: `2026-05-10T14:30:00Z`.

## 5-Minute Exercise

1. Download any CSV dataset (try [city of Chennai open data](https://data.gov.in)).
2. `sqlite-utils insert chennai.db data file.csv --csv`
3. `sqlite-utils enable-fts chennai.db data <some_text_column> --create-triggers`
4. `datasette serve chennai.db`
5. Open the UI, run an SQL query, toggle FTS search on a column.

## Further Reading

- [sqlite-utils docs](https://sqlite-utils.datasette.io/)
- [Datasette docs](https://docs.datasette.io/)
- [SQLite FTS5 reference](https://www.sqlite.org/fts5.html)
- [Simon Willison's SQLite blog](https://simonwillison.net/tags/sqlite/)
- [SQLite Tutorial](https://www.sqlitetutorial.net/) — beginner-friendly SQL reference

---

