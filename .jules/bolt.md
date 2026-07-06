## 2026-07-06 - Prisma missing foreign key indexes
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can cause slow relational queries and full table scans.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId` or `categoryId`).
