
## 2026-06-04 - [Prisma Transaction Optimization]
**Learning:** Sequential `await`s inside a `for...of` loop within a Prisma `` block the Node.js event loop and significantly increase transaction time. This is a common performance bottleneck for batched operations like stock decrements during checkout.
**Action:** Use `await Promise.all(items.map(item => tx.model.update(...)))` instead of `for...of` loops within Prisma transactions to execute independent database operations concurrently and unblock the event loop.
