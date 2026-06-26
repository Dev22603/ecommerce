## 2026-06-26 - [Prisma Foreign Key Missing Indexes]
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns in the database. This lack of indexes can lead to slow relational queries and full table scans on tables with large amounts of data.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId`, `categoryId`, etc.) to optimize query performance.
