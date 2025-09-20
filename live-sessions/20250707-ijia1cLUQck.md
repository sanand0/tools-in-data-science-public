Here's an FAQ based on the provided transcription of the TDS live tutorial:

**Q1: What did we cover in yesterday's session?**

**A1:** Most topics were covered except for SQL and DuckDB, which are the focus of this session.

**Q2: What is the goal of this session?**

**A2:** We'll be focusing on how to connect to databases using SQL and DuckDB, especially when the database is hosted remotely and not on your local machine.

**Q3: How do I connect to a remote database?**

**A3:** You'll use a connection string that specifies the server (host), port number, username, and password. This allows you to access a database that's on a different server.

**Q4: Can you give an example of a remote database setup?**

**A4:** Think of it like hosting a web application. Just as you hosted your project 1 on Render or Vercel, which are remote hosts, databases can also be hosted remotely. We're connecting to a database that lives on a remote host (like Supabase, which we'll use) at a specific port, for example, 3306 for MySQL.

**Q5: Why do I need a username and password for a remote database?**

**A5:** Since the database is publicly accessible on a server, security is crucial. Anyone could access and potentially delete your data if it were unprotected. The username and password ensure controlled access and allow for specific permissions (e.g., read-only access) for different users.

**Q6: What library are we using to connect to the database?**

**A6:** We are using `PyMySQL` to connect to the database. You'll need to install it if you don't have it.

**Q7: Can I connect to Google databases?**

**A7:** If the Google database is publicly available and you have the necessary username and password details, then yes, you can connect. Otherwise, it might not be possible.

**Q8: What is a "connection string"?**

**A8:** A connection string provides all the necessary details to connect to a database: the host (server name or IP address), the port number, the username, and the password.

**Q9: What is the difference between connecting to a local database and a remote one?**

**A9:** For a local database, your host name would typically be `localhost` (or `127.0.0.1`). For a remote database, you'd specify the actual host URL or IP address of the remote server. The port number would also be specific to where the database is hosted.

**Q10: Can I create multiple databases on Supabase?**

**A10:** In Supabase, you can typically create two databases per project on their free plan. If you need more, you might need to upgrade your plan or create multiple projects.

**Q11: What is a "stateful" vs. "stateless" database connection?**

**A11:** A stateful (or "persistent") connection is used when you want to connect to the database once and keep that connection open for multiple operations (like running many queries or updates). This is common for long-lived applications. A stateless connection, on the other hand, means you establish a new connection for each operation and then close it immediately. This is simpler to manage but can be slower if you have many operations. We're using a stateless approach for this demonstration.

**Q12: What are some other platforms like Supabase that offer good free tiers?**

**A12:** Convext offers 20 databases on its free tier, allowing for multiple projects and teams. It's another good option for proof-of-concept development.

**Q13: Why did my query initially fail with "table does not exist"?**

**A13:** The error "table does not exist" occurred because I made a typo in the table name: `relational` instead of `relations`. Also, table names can be case-sensitive depending on the database configuration, so ensuring correct capitalization (e.g., `TEST` vs. `test`) is important.

**Q14: How can I view all tables in a connected database?**

**A14:** You can use SQL queries like `SELECT * FROM information_schema.tables WHERE table_schema = 'your_database_name';` (syntax might vary slightly by database type) to list all tables. Alternatively, the database management tool's UI (like Supabase's interface) usually provides a direct way to browse tables.

**Q15: What is DuckDB?**

**A15:** DuckDB is an in-process SQL OLAP (Online Analytical Processing) database management system. It's designed for analytical queries and is often used for fast data processing directly within your application.

**Q16: How does DuckDB compare to other data processing tools like Pandas?**

**A16:** DuckDB is generally much faster than Pandas for analytical queries, especially when dealing with large datasets, because it leverages parallel processing and operates directly in memory. Some benchmarks show DuckDB performing 20 times faster than Pandas for certain operations.

**Q17: What kind of file formats does DuckDB support?**

**A17:** DuckDB supports various file formats, including CSV, JSON, and Parquet. This makes it versatile for integrating with different data sources.

**Q18: What are SQL aggregate functions?**

**A18:** Aggregate functions perform calculations on a set of rows and return a single summary row. Common aggregate functions include:

- `MIN()`: Returns the minimum value.
- `MAX()`: Returns the maximum value.
- `COUNT()`: Returns the number of rows.
- `SUM()`: Returns the sum of values.
- `AVG()`: Returns the average value.

**Q19: How do I calculate the average price per product category using aggregate functions?**

**A19:** You would use `AVG(price)` in conjunction with a `GROUP BY category_id` clause. This groups the products by category and then calculates the average price for each group. For example, to get the average price for product category 1: `SELECT AVG(price) FROM products GROUP BY category_id HAVING category_id = 1;`

**Q20: What is the `GROUP BY` clause used for?**

**A20:** The `GROUP BY` clause groups rows that have the same values in specified columns into summary rows. This is essential when you want to apply aggregate functions (like `AVG`, `COUNT`, `SUM`) to distinct groups within your data.

**Q21: What is the `ORDER BY` clause used for?**

**A21:** The `ORDER BY` clause sorts the result set of a query based on one or more specified columns. You can specify ascending (`ASC`) or descending (`DESC`) order.

**Q22: What are wildcards in SQL?**

**A22:** Wildcards are special characters used with the `LIKE` operator to search for patterns in string columns.

- `%`: Represents zero or more characters (e.g., `'A%'` matches anything starting with 'A').
- `_`: Represents a single character (e.g., `'A_'` matches 'AA' or 'AB' but not 'A' or 'ABC').
- `[]`: Represents any single character within the specified set (e.g., `[A-C]` matches 'A', 'B', or 'C').
- `[^]`: Represents any single character NOT within the specified set (e.g., `[^A-C]` matches anything not 'A', 'B', or 'C').

**Q23: What are aliases in SQL?**

**A23:** Aliases are temporary names given to tables or columns in a query. They make queries more readable and can simplify complex joins. You define an alias using the `AS` keyword. For example, `SELECT customer_id AS ID FROM Customers;`

**Q24: What is the `UNION` operator in SQL?**

**A24:** The `UNION` operator combines the result sets of two or more `SELECT` statements into a single result set. It automatically removes duplicate rows. `UNION ALL` is similar but includes duplicate rows. For the `UNION` operation to work, the `SELECT` statements must have the same number of columns, and the corresponding columns must have compatible data types.

**Q25: What are SQL joins?**

**A25:** SQL joins are used to combine rows from two or more tables based on a related column between them.

- **`INNER JOIN`**: Returns rows when there is a match in _both_ tables (like an intersection in a Venn diagram).
- **`LEFT JOIN`** (or `LEFT OUTER JOIN`): Returns all rows from the left table, and the matching rows from the right table. If there's no match, NULLs are returned for the right table's columns.
- **`RIGHT JOIN`** (or `RIGHT OUTER JOIN`): Returns all rows from the right table, and the matching rows from the left table. If there's no match, NULLs are returned for the left table's columns.
- **`FULL JOIN`** (or `FULL OUTER JOIN`): Returns rows when there is a match in _one of the tables_ (like a union in a Venn diagram).
- **`SELF JOIN`**: A table is joined with itself. This is useful for finding relationships within the same table (e.g., finding all customers from the same city).

**Q26: What are `ANY` and `ALL` operators in SQL?**

**A26:** `ANY` and `ALL` are used with subqueries and comparison operators (like `=`, `>`, `<`, etc.).

- **`ANY`**: The condition is true if the comparison is true for _any_ of the values in the subquery's result set.
- **`ALL`**: The condition is true if the comparison is true for _all_ of the values in the subquery's result set.

**Q27: What is the `NOT EQUAL` operator in SQL?**

**A27:** The `NOT EQUAL` operator checks if two values are not equal. It can be represented by `!=` or `<>`. Both symbols achieve the same result.

**Q28: What is the deadline for Project 2 sessions?**

**A28:** The deadline for Project 2 is August 8th. We still have good time to cover relevant topics.
