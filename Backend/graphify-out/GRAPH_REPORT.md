# Graph Report - .  (2026-04-26)

## Corpus Check
- 36 files · ~7,127 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 75 nodes · 102 edges · 2 communities detected
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Order Management|Order Management]]
- [[_COMMUNITY_User Management|User Management]]

## God Nodes (most connected - your core abstractions)
1. `validatePagination()` - 5 edges
2. `getUserOrders()` - 2 edges
3. `getOrderDetails()` - 2 edges
4. `getAllOrders()` - 2 edges
5. `getProductsByCategory()` - 2 edges
6. `getAllProducts()` - 2 edges
7. `signup()` - 2 edges
8. `tryParseJsonError()` - 2 edges
9. `formatDate()` - 2 edges
10. `AppError` - 2 edges

## Surprising Connections (you probably didn't know these)
- `getUserOrders()` --calls--> `validatePagination()`  [INFERRED]
  controllers\order.controller.mjs → utils\common_functions.mjs
- `getAllOrders()` --calls--> `validatePagination()`  [INFERRED]
  controllers\order.controller.mjs → utils\common_functions.mjs
- `getProductsByCategory()` --calls--> `validatePagination()`  [INFERRED]
  controllers\product.controller.mjs → utils\common_functions.mjs
- `getAllProducts()` --calls--> `validatePagination()`  [INFERRED]
  controllers\product.controller.mjs → utils\common_functions.mjs
- `getOrderDetails()` --calls--> `formatDate()`  [INFERRED]
  controllers\order.controller.mjs → utils\common_functions.mjs

## Communities

### Community 0 - "Order Management"
Cohesion: 0.18
Nodes (7): formatDate(), validatePagination(), getAllOrders(), getOrderDetails(), getUserOrders(), getAllProducts(), getProductsByCategory()

### Community 3 - "User Management"
Cohesion: 0.25
Nodes (3): AppError, signup(), tryParseJsonError()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 4 inferred relationships involving `validatePagination()` (e.g. with `getUserOrders()` and `getAllOrders()`) actually correct?**
  _`validatePagination()` has 4 INFERRED edges - model-reasoned connections that need verification._