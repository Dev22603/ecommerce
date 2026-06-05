## 2024-05-24 - Prisma Transaction Concurrency
**Learning:** Sequential `await` loops inside Prisma transactions (e.g., iterating through cart items to decrement product stock) create unnecessary database roundtrips and event loop blocking, which can heavily impact latency on large carts.
**Action:** Replace `for...of` loops with `await Promise.all()` mapping over the items to execute independent updates concurrently within the transaction.
