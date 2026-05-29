## 2024-05-29 - [Global Formatting Anti-Pattern]
**Learning:** Running `npm run format` globally in the `Backend` modifies thousands of lines, including auto-generated files (like Prisma clients), creating massive, unreviewable diffs alongside small performance optimizations.
**Action:** Always restrict formatting to only the specifically modified files rather than running it across the entire codebase.

## 2024-05-29 - [Prisma Transaction Optimization]
**Learning:** Found sequential `await` calls inside `for...of` loops within Prisma interactive transactions (`prisma.$transaction(async (tx) => { ... })`). This sequentially blocks the Node event loop and increases overall transaction latency, slowing down bulk operations like cart-to-order conversion.
**Action:** Always replace sequential `await` loops inside Prisma transactions with `await Promise.all(array.map(...))` when the database updates are independent to improve concurrent execution and reduce total response time.