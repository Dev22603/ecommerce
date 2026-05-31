## 2024-05-18 - Promise.all instead of sequential await in Prisma transactions
**Learning:** Sequential `await` calls within a loop inside a Prisma transaction can block the event loop and decrease throughput.
**Action:** When updating multiple rows independently inside a transaction loop, use `await Promise.all(items.map(...))` to execute the database update queries concurrently.