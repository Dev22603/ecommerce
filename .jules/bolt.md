## 2024-05-24 - Prisma Foreign Key Index Performance Bottleneck
**Learning:** By default, Prisma does not automatically generate database indexes for foreign keys mapped to columns in PostgreSQL (like `categoryId` on `Product`, or `userId` on `Order`). This leads to severe N+1-like performance degradation when performing relational queries using `include` because PostgreSQL must scan the entire table for matching foreign key values.
**Action:** Always explicitly add `@@index([foreignKey])` in `schema.prisma` for any frequently queried relation to avoid full table scans.
