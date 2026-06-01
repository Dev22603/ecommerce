## 2024-06-01 - Avoid sequential await in Prisma transactions
**Learning:** Sequential `await` in loops (like `for...of`) within Prisma transactions can block the event loop and significantly slow down transaction execution, especially when processing multiple independent updates like cart items.
**Action:** Always use `await Promise.all(...)` to execute independent database updates concurrently within Prisma transactions to improve performance and prevent event loop blocking.
