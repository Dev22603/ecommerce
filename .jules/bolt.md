## 2024-07-02 - Prisma Foreign Key Indexing
**Learning:** Prisma does not automatically generate database indexes for foreign keys mapped to relations. This can lead to slow relational queries and full table scans on heavily accessed tables.
**Action:** Always explicitly add `@@index([foreignKey])` to Prisma models where a relation field is defined to ensure database queries perform efficiently.
