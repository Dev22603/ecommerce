## 2024-06-13 - Prisma Foreign Key Indexes
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can cause slow relational queries and full table scans.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried to prevent slow queries.
