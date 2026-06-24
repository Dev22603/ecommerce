## 2024-06-24 - Prisma Foreign Key Index Omission
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can cause slow relational queries and full table scans on heavily related tables.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId` or `categoryId`).
