## 2024-11-20 - Missing Database Indexes on Prisma Foreign Keys
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can lead to slow relational queries and full table scans on frequently queried fields like `userId` or `categoryId`.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId` or `categoryId`) to prevent slow relational queries.
