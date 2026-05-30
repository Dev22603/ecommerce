## 2024-05-30 - Prisma Transaction Concurrency
**Learning:** Sequential awaits inside loops within Prisma interactive transactions can cause significant I/O wait overhead. Prisma fully supports concurrent database requests via Promise.all within these transactions.
**Action:** Always use Promise.all to map over independent operations inside a transaction block instead of using sequential for...of or map loops when possible to maximize query throughput.
