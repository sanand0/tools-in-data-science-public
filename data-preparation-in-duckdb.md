## Data Preparation in DuckDB

[![Data preparation in DuckDB](https://i.ytimg.com/vi_webp/4U0GqYrET5s/sddefault.webp)](https://youtu.be/4U0GqYrET5s)

DuckDB's SQL engine can handle large files quickly. Below are common cleaning tasks using the DuckDB CLI.

### Create a Sample Dataset

```bash
duckdb sample.duckdb <<'SQL'
CREATE OR REPLACE TABLE orders AS
SELECT
  seq AS order_id,
  CASE WHEN seq % 5 = 0 THEN NULL ELSE 'Customer ' || seq END AS customer,
  date '2025-01-01' + CAST(seq % 15 AS INTEGER) AS order_date,
  CASE WHEN seq % 3 = 0 THEN 'Widget ' || seq ELSE 'Gadget ' || seq END AS product,
  round(random()*1000, 2) AS amount,
  CASE WHEN seq % 4 = 0 THEN 'EU' ELSE 'US' END AS region
FROM range(1, 50) tbl(seq);
SQL
```

### Create a Messy CSV

```bash
cat <<'EOF' > messy_orders.csv
order_id,customer,order_date,product,amount,region
1,Customer 1,2025-01-01,Widget 1,100,US
"2,Customer 2,2025-01-02,Gadget 2,200,US
3,Customer 3,2025-01-03,Gadget 3,300,EU
EOF
```

### Create a Big CSV

```bash
duckdb sample.duckdb <<'SQL'
COPY (SELECT seq AS id, random() AS val FROM range(100000)) TO 'big.csv';
SQL
```

### Exploratory Data Analysis

```sql
-- Preview and get stats
SELECT * FROM orders LIMIT 5;
DESCRIBE orders;
SELECT COUNT(*) AS n, AVG(amount) AS avg_amount FROM orders;
```

### Converting Data to Other Formats

```sql
COPY (SELECT * FROM orders) TO 'orders.json' (FORMAT JSON);
COPY (SELECT * FROM orders) TO 'orders.parquet' (FORMAT PARQUET);
```

### Reading Messy CSV

```sql
-- Skip bad lines while loading
SELECT *
FROM read_csv_auto('messy_orders.csv', ignore_errors=true);
```

### Handling Missing Values

```sql
-- Replace null customer names
SELECT COALESCE(customer, 'Unknown') AS customer FROM orders;
```

### String Operations

```sql
SELECT DISTINCT TRIM(LOWER(product)) AS clean_product FROM orders;
```

### Date Parsing and Conversion

```sql
SELECT order_id, STRFTIME(order_date, '%Y-%m') AS order_month FROM orders;
```

### Conditional Logic and Binning

```sql
SELECT
  order_id,
  CASE WHEN amount > 700 THEN 'high' WHEN amount > 300 THEN 'medium' ELSE 'low' END AS price_band
FROM orders;
```

### Regex Search and Replace

```sql
SELECT REGEXP_REPLACE(product, '\\s+', ' ', 'g') AS tidy_product FROM orders;
```

### Working with Multiple Formats

```sql
CREATE TABLE json_orders AS SELECT * FROM read_json_auto('orders.json');
CREATE TABLE parquet_orders AS SELECT * FROM read_parquet('orders.parquet');
SELECT * FROM orders UNION ALL SELECT * FROM parquet_orders;
```

### Processing in Chunks

```sql
SELECT * FROM read_csv_auto('big.csv') LIMIT 1000 OFFSET 0;
SELECT * FROM read_csv_auto('big.csv') LIMIT 1000 OFFSET 1000;
```

### Filtering Rows and Dropping Columns

```sql
SELECT order_id, amount FROM orders WHERE region = 'US';
SELECT * EXCLUDE region FROM orders;
```

### Derived Columns

```sql
SELECT *, amount * 0.1 AS tax, UPPER(region) AS region_code FROM orders;
```

### Summaries and Pivots

```sql
-- Aggregation
SELECT region, COUNT(*) AS n_orders, SUM(amount) AS total FROM orders GROUP BY region;

-- Pivot by region
SELECT *
FROM orders
PIVOT(COUNT(*) FOR region IN ('US', 'EU'));
```

Useful links:

- [DuckDB Documentation](https://duckdb.org/docs/)
- [SQL Functions](https://duckdb.org/docs/sql/functions/overview)
- [DuckDB Extensions](https://duckdb.org/docs/extensions/overview)
