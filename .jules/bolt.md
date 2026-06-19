## 2024-06-19 - Missing database indexes on Prisma foreign keys
**Learning:** Prisma does not automatically generate database indexes for foreign keys mapped to columns, meaning `findMany` queries filtering on relations (e.g. `userId` or `categoryId`) would cause slow full table scans as the application scales.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (like `userId`, `categoryId`, `orderId`) to prevent slow relational queries.
