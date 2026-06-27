## 2025-01-01 - Missing Prisma Database Indexes
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can cause slow relational queries and full table scans on frequently accessed fields.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId` or `categoryId`) to prevent slow relational queries.
