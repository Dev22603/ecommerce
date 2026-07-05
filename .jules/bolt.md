## 2024-07-05 - Prisma missing automatic indexes on relations
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can lead to slow relational queries and full table scans on larger datasets.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried or used as a relation (e.g., `userId`, `categoryId`, `orderId`) to prevent full table scans and improve query performance.
