## 2024-07-01 - Missing Database Indexes for Prisma Foreign Keys
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can lead to slow relational queries and full table scans on frequently queried fields like `userId` or `categoryId`.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the relational field is frequently queried. Additionally, ensure corresponding SQL migrations are created manually if `prisma migrate dev` cannot reach the database.
