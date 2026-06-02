## 2024-05-18 - [Performance Optimization] Concurrent stock updates in Prisma transaction
**Learning:** Prisma transactions execute sequentially by default if queries are awaited within a `for...of` loop. This can cause event loop blocking and slow down batch operations (like order creation).
**Action:** Replaced sequential `await` in `for...of` loop with `await Promise.all()` mapped queries inside Prisma `$transaction`. This applies to independent queries.
