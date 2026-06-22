## 2025-01-20 - Adding Indexes to Foreign Keys in Prisma
**Learning:** Prisma does not automatically generate database indexes for foreign key relationships mapped to columns, leading to hidden N+1 query bottlenecks and full table scans on relational lookups for high-traffic tables.
**Action:** Always explicitly add `@@index([foreignKeyField])` to Prisma models where the field is frequently queried or used in relationships (e.g., `userId` or `categoryId`).
