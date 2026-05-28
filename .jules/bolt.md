## 2024-06-25 - Parallelizing Database Updates in Transactions
**Learning:** Sequential database updates (using `await` in a `for...of` loop) within Prisma transactions introduce significant latency, especially as the number of items grows, leading to an O(N) performance bottleneck in transaction completion times. This delays event loop processing.
**Action:** Always use `await Promise.all(...)` with array maps to execute independent database updates concurrently within a transaction when order doesn't strictly matter.
