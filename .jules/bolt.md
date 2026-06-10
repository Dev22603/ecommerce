## 2024-06-10 - Added @@index to foreign keys in schema.prisma
**Learning:** Prisma does not automatically generate database indexes for foreign keys (relation fields) mapped to columns. This can lead to slow relational queries, especially when joining or filtering large tables like `Order` by `userId`, or `Product` by `categoryId`.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently used in queries (e.g., in `where` clauses of `findMany` queries).
