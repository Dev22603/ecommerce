## 2024-06-18 - Missing Foreign Key Indexes in Prisma
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId` or `categoryId`) to prevent slow relational queries and full table scans.
