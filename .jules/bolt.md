## 2024-05-24 - Missing Database Indexes on Prisma Relation Fields
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This leads to missing indexes on frequently queried fields like `categoryId`, `userId`, etc., which causes slow relational queries and full table scans.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried (e.g., `userId`, `categoryId`, `addressId`, `orderId`, `productId`) to prevent slow relational queries.
