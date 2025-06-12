## Data Preparation in DuckDB

[![DuckDB](https://i.ytimg.com/vi_webp/fZj6kTwXN1U/sddefault.webp)](https://www.youtube.com/playlist?list=PLw2SS5iImhEThtiGNPiNenOr2tVvLj6H7)

DuckDB's SQL engine can handle large files quickly. Below are common cleaning tasks using the DuckDB CLI.

### Create a Sample Dataset

Let's create a sample dataset that mimics real business data patterns - incomplete customer records, time-series orders, and regional variations. Before working with messy production data, you need a controlled environment to test data cleaning techniques. This sample represents common e-commerce scenarios: missing customer info (20% of orders), seasonal patterns (15-day cycles), and geographic segmentation that drive business decisions like inventory placement and marketing campaigns.

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

Let's also simulate real-world data export issues - unescaped quotes, missing delimiters, and malformed records that break standard CSV parsers. Data rarely arrives clean. Export systems fail, manual data entry introduces errors, and third-party integrations send malformed files. Learning to handle corrupted CSV files prevents hours of debugging and ensures your data pipeline doesn't break when inevitably receiving bad data from vendors, APIs, or legacy systems.

```bash
cat <<'EOF' > messy_orders.csv
order_id,customer,order_date,product,amount,region
1,Customer 1,2025-01-01,Widget 1,100,US
"2,Customer 2,2025-01-02,Gadget 2,200,US
3,Customer 3,2025-01-03,Gadget 3,300,EU
EOF
```

### Create a Big CSV

Next, we'll create a large dataset to practice memory-efficient processing techniques that handle files too big to fit in RAM. When working with millions of customer records, transaction logs, or sensor data, traditional tools crash or run out of memory. DuckDB's streaming capabilities let you process 100GB+ files on laptops by reading data in chunks, making big data analysis accessible without expensive infrastructure.

```bash
duckdb sample.duckdb <<'SQL'
COPY (SELECT seq AS id, random() AS val FROM range(100000)) TO 'big.csv';
SQL
```

### Exploratory Data Analysis

We need to examine our data structure and quality before making business decisions. Every data analysis starts with understanding what you have - missing values can skew customer segmentation, outliers affect revenue forecasting, and data types determine which analytical techniques work. Quick EDA prevents costly mistakes like launching marketing campaigns based on incomplete customer data or setting prices using corrupted transaction amounts.

```sql
-- Preview and get stats
SELECT * FROM orders LIMIT 5;
DESCRIBE orders;
SELECT COUNT(*) AS n, AVG(amount) AS avg_amount FROM orders;
```

### Converting Data to Other Formats

Let's export cleaned data to formats optimized for different business needs. Analytics teams need Parquet for fast querying, APIs require JSON for web integration, and executives want CSV for Excel compatibility. Format conversion ensures your cleaned data reaches every stakeholder in their preferred format, enabling faster decision-making across departments without forcing everyone to learn SQL.

```sql
COPY (SELECT * FROM orders) TO 'orders.json' (FORMAT JSON);
COPY (SELECT * FROM orders) TO 'orders.parquet' (FORMAT PARQUET);
```

### Reading Messy CSV

We need to handle corrupted files that would normally crash your data pipeline. Real-world CSV files from vendors, legacy systems, or manual exports often contain malformed rows that break standard parsers. Instead of spending hours manually fixing files or losing critical business data, DuckDB's error handling lets you salvage usable records while identifying problem areas for follow-up with data providers.

```sql
-- Skip bad lines while loading
SELECT *
FROM read_csv_auto('messy_orders.csv', ignore_errors=true);
```

### Handling Missing Values

It's important to address incomplete data that could lead to wrong business conclusions. Missing customer names prevent personalized marketing, absent transaction amounts skew revenue calculations, and incomplete addresses block shipping. Rather than excluding entire records and losing valuable information, strategic imputation preserves data for analysis while clearly marking assumptions made during the cleaning process.

```sql
-- Replace null customer names
SELECT COALESCE(customer, 'Unknown') AS customer FROM orders;
```

### String Operations

It's common to standardize text data that comes from multiple sources with inconsistent formatting. Product names from different suppliers use varying cases, customer entries have extra spaces, and imported data contains mixed formatting. Clean, consistent strings enable accurate grouping for inventory management, prevent duplicate customer records, and ensure search functionality works properly across your application.

```sql
SELECT DISTINCT TRIM(LOWER(product)) AS clean_product FROM orders;
```

### Date Parsing and Conversion

Typically, we transform dates into different formats that enable time-based business analysis. Raw date strings from different systems use various formats that prevent proper sorting and filtering. Converting to standard formats enables monthly sales reporting, seasonal trend analysis, and time-based customer segmentation - critical for inventory planning, marketing campaigns, and financial forecasting.

```sql
SELECT order_id, STRFTIME(order_date, '%Y-%m') AS order_month FROM orders;
```

### Conditional Logic and Binning

A common task is to categorize continuous data into meaningful business segments that drive decision-making. Converting exact dollar amounts into price tiers enables targeted marketing (premium vs budget customers), inventory classification (high/medium/low value items), and commission structures. This segmentation forms the foundation for personalized pricing, customer targeting, and performance analysis.

```sql
SELECT
  order_id,
  CASE WHEN amount > 700 THEN 'high' WHEN amount > 300 THEN 'medium' ELSE 'low' END AS price_band
FROM orders;
```

### Regex Search and Replace

We often need to clean complex text patterns that simple string operations can't handle. Product descriptions contain multiple spaces, phone numbers have inconsistent formatting, and addresses mix abbreviations with full words. Regular expressions fix these patterns systematically, ensuring consistent data quality for customer communications, shipping integrations, and search functionality.

```sql
SELECT REGEXP_REPLACE(product, '\\s+', ' ', 'g') AS tidy_product FROM orders;
```

### Working with Multiple Formats

Let's combine data from different sources that use various file formats. Modern businesses receive data as CSV exports, JSON from APIs, and Parquet from data warehouses. Rather than maintaining separate processing pipelines, DuckDB's format flexibility lets you join orders from your CSV exports with customer data from JSON APIs and inventory levels from Parquet files in a single query.

```sql
CREATE TABLE json_orders AS SELECT * FROM read_json_auto('orders.json');
CREATE TABLE parquet_orders AS SELECT * FROM read_parquet('orders.parquet');
SELECT * FROM orders UNION ALL SELECT * FROM parquet_orders;
```

### Processing in Chunks

We handle massive datasets that exceed available memory by processing them in manageable segments. When analyzing years of transaction logs, customer behavior data, or sensor readings, loading everything at once crashes systems. Chunk processing enables analysis of terabyte-scale datasets on standard hardware, making enterprise-level data analysis accessible for fraud detection, customer lifetime value calculations, and operational analytics.

```sql
SELECT * FROM read_csv_auto('big.csv') LIMIT 1000 OFFSET 0;
SELECT * FROM read_csv_auto('big.csv') LIMIT 1000 OFFSET 1000;
```

### Filtering Rows and Dropping Columns

We'll focus analysis on relevant data subsets while removing sensitive or unnecessary information. Business analysis rarely needs all data - marketing teams want current customers, finance needs profitable regions, and product managers focus on active items. Efficient filtering reduces processing time, protects sensitive data (removing PII columns), and ensures analysis focuses on business-relevant subsets rather than getting lost in comprehensive but unfocused datasets.

```sql
SELECT order_id, amount FROM orders WHERE region = 'US';
SELECT * EXCLUDE region FROM orders;
```

### Derived Columns

Now, let's create new business metrics from existing data that drive key performance indicators. Raw transaction amounts become profit margins with tax calculations, customer regions enable territory-based analysis, and dates support seasonal comparisons. These derived metrics power executive dashboards, sales team performance tracking, and automated business rules without requiring manual calculations or separate reporting tools.

```sql
SELECT *, amount * 0.1 AS tax, UPPER(region) AS region_code FROM orders;
```

### Summaries and Pivots

A big part of data preparation is to transform detailed transaction data into executive-level insights that inform strategic decisions. Converting thousands of individual orders into regional sales summaries, customer segment performance, and product category trends enables quick identification of growth opportunities, underperforming markets, and inventory optimization needs. These aggregations become the foundation for board presentations, budget planning, and strategic initiatives.

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
