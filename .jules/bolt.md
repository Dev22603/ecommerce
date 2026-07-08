## 2026-07-08 - Prisma Missing Foreign Key Indexes
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can cause slow relational queries and full table scans on heavily queried fields like `userId` or `categoryId`.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g. in relation mappings) to prevent slow queries.
