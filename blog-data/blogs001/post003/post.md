---
title: "PostgreSQL Query Optimization: From Slow to Lightning Fast"
slug: "postgresql-query-optimization-guide"
excerpt: "A practical guide to identifying and fixing slow PostgreSQL queries using EXPLAIN ANALYZE, proper indexing, and query rewriting techniques."
author: "Ranjith Prabhu K"
date: 2026-02-05
updated: 2026-02-05
category: "Database"
tags: ["postgresql", "sql", "performance", "database"]
featuredImage: "./assets/hero.jpg"
readingTime: 10
draft: false
seo:
  ogImage: "./assets/hero.jpg"
  canonicalUrl: ""
---

# PostgreSQL Query Optimization: From Slow to Lightning Fast

Slow queries are one of the most common performance bottlenecks in web applications. PostgreSQL provides excellent tools for diagnosing and fixing query performance issues. In this guide, we'll walk through real-world optimization techniques that can turn seconds-long queries into millisecond responses.

## Step 1: Identify Slow Queries

Before optimizing, you need to find your slow queries. Enable the `pg_stat_statements` extension:

```sql
-- Enable the extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find the slowest queries by total time
SELECT
  query,
  calls,
  total_exec_time / 1000 AS total_seconds,
  mean_exec_time / 1000 AS avg_seconds,
  rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

## Step 2: Understand EXPLAIN ANALYZE

`EXPLAIN ANALYZE` is your best friend for query optimization. It shows the actual execution plan with real timing data:

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.created_at >= '2025-01-01'
GROUP BY u.id, u.name
ORDER BY total_spent DESC
LIMIT 10;
```

The output tells you exactly what PostgreSQL is doing:

```
Limit  (cost=15234.56..15234.59 rows=10 width=48) (actual time=1523.456..1523.460 rows=10 loops=1)
  ->  Sort  (cost=15234.56..15334.56 rows=40000 width=48) (actual time=1523.454..1523.457 rows=10 loops=1)
        Sort Key: (sum(o.total)) DESC
        Sort Method: top-N heapsort  Memory: 25kB
        ->  HashAggregate  (cost=14234.56..14634.56 rows=40000 width=48) (actual time=1412.345..1498.765 rows=40000 loops=1)
              ->  Hash Join  (cost=1234.56..12234.56 rows=400000 width=20) (actual time=45.678..987.654 rows=400000 loops=1)
                    ->  Seq Scan on orders o  (cost=0.00..9876.00 rows=400000 width=16) (actual time=0.012..456.789 rows=400000 loops=1)
                          Filter: (created_at >= '2025-01-01')
                          Rows Removed by Filter: 100000
                    ->  Hash  (cost=734.56..734.56 rows=40000 width=12) (actual time=45.123..45.123 rows=40000 loops=1)
                          ->  Seq Scan on users u  (cost=0.00..734.56 rows=40000 width=12) (actual time=0.008..23.456 rows=40000 loops=1)
Planning Time: 0.234 ms
Execution Time: 1523.567 ms
```

Key things to look for:
- **Seq Scan** on large tables — usually needs an index
- **Rows Removed by Filter** — large numbers mean the index isn't being used
- **actual time** vs **cost** — look at actual time for real performance data

## Step 3: Add the Right Indexes

The query above does a sequential scan on `orders` for the date filter. Let's fix that:

```sql
-- Index for the date filter + join column
CREATE INDEX idx_orders_created_user
ON orders (created_at, user_id)
WHERE created_at >= '2025-01-01';

-- Or a more general index
CREATE INDEX idx_orders_created_at ON orders (created_at);
CREATE INDEX idx_orders_user_id ON orders (user_id);
```

After adding the index, the query plan changes dramatically:

```diff
-  Seq Scan on orders o  (cost=0.00..9876.00 rows=400000)
-    Filter: (created_at >= '2025-01-01')
-    Rows Removed by Filter: 100000
+  Index Scan using idx_orders_created_at on orders o  (cost=0.43..5432.10 rows=400000)
+    Index Cond: (created_at >= '2025-01-01')
```

## Step 4: Common Optimization Patterns

### Avoid SELECT *

```sql
-- Bad: fetches all columns
SELECT * FROM users WHERE status = 'active';

-- Good: only fetch what you need
SELECT id, name, email FROM users WHERE status = 'active';
```

### Use EXISTS Instead of IN for Subqueries

```sql
-- Slower with large subquery results
SELECT * FROM products
WHERE category_id IN (
  SELECT id FROM categories WHERE active = true
);

-- Faster with EXISTS
SELECT * FROM products p
WHERE EXISTS (
  SELECT 1 FROM categories c
  WHERE c.id = p.category_id AND c.active = true
);
```

### Partial Indexes for Common Filters

If you frequently query active records:

```sql
-- Only indexes active users (smaller, faster index)
CREATE INDEX idx_users_active ON users (email)
WHERE status = 'active';
```

### Covering Indexes (Index-Only Scans)

Include all needed columns in the index to avoid table lookups:

```sql
-- Covers the entire query without touching the table
CREATE INDEX idx_orders_covering
ON orders (user_id, created_at)
INCLUDE (total);
```

## Step 5: Batch Operations

Large `UPDATE` or `DELETE` operations can lock tables and bloat WAL. Process them in batches:

```sql
-- Instead of one massive delete
DELETE FROM logs WHERE created_at < '2024-01-01';

-- Process in batches
DO $$
DECLARE
  batch_size INT := 10000;
  deleted INT;
BEGIN
  LOOP
    DELETE FROM logs
    WHERE id IN (
      SELECT id FROM logs
      WHERE created_at < '2024-01-01'
      LIMIT batch_size
    );
    GET DIAGNOSTICS deleted = ROW_COUNT;
    EXIT WHEN deleted = 0;
    PERFORM pg_sleep(0.1); -- Brief pause to reduce lock contention
  END LOOP;
END $$;
```

## Step 6: Connection Pooling

Even optimized queries suffer if your application creates a new connection for each request. Use connection pooling with PgBouncer:

```yaml
# pgbouncer.ini
[databases]
myapp = host=localhost port=5432 dbname=myapp

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```

## Performance Checklist

Before deploying to production, verify:

- [ ] All frequently-queried columns have appropriate indexes
- [ ] No sequential scans on tables with >10k rows
- [ ] Queries use `LIMIT` for paginated results
- [ ] `N+1` queries are eliminated (use JOINs or batch loading)
- [ ] Connection pooling is configured
- [ ] `pg_stat_statements` is enabled for monitoring
- [ ] Slow query logging is enabled (`log_min_duration_statement = 100`)
- [ ] Regular `VACUUM ANALYZE` is scheduled

Query optimization is an iterative process. Start with the slowest queries (they impact the most users), add targeted indexes, and always verify improvements with `EXPLAIN ANALYZE`. Small optimizations compound — a 10x improvement on your top 5 queries can transform your application's performance.
