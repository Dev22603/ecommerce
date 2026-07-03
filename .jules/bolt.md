## 2026-04-27 - Missing Foreign Key Indexes in Prisma Schema
**Learning:** Prisma does not automatically generate database indexes for foreign key relation fields. The schema had multiple `CASCADE` delete and relation fields (`categoryId`, `userId`, etc.) missing explicit indexes, potentially causing full table scans during relation lookups and cascading deletes in PostgreSQL.
**Action:** Always explicitly declare `@@index([foreignKey])` on models that represent the "many" side of a one-to-many relationship in Prisma schemas to ensure optimal read and delete performance.
