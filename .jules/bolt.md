## 2024-06-17 - Prisma Automatic Indexing Gap
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can lead to slow relational queries and full table scans on frequently joined tables.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId`, `categoryId`, etc.) to prevent slow queries.
