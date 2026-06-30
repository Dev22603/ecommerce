## 2026-06-30 - Missing Foreign Key Indexes
**Learning:** Prisma does not automatically create database indexes for relational foreign key fields by default. This leads to potential full table scans for lookup queries on these fields (e.g., getting all addresses for a user).
**Action:** Always manually verify and add `@@index([foreignKey])` for foreign key relationships mapped to frequently queried columns.
