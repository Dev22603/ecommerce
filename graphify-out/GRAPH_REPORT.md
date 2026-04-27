# Graph Report - D:\College\Github_Projects\ecommerce  (2026-04-26)

## Corpus Check
- Corpus is ~24,908 words - fits in a single context window. You may not need a graph.

## Summary
- 139 nodes · 134 edges · 4 communities detected
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `Frontend Application` - 7 edges
2. `validatePagination()` - 5 edges
3. `Dev Traders` - 4 edges
4. `getUserOrders()` - 2 edges
5. `getOrderDetails()` - 2 edges
6. `getAllOrders()` - 2 edges
7. `getProductsByCategory()` - 2 edges
8. `getAllProducts()` - 2 edges
9. `signup()` - 2 edges
10. `tryParseJsonError()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `getUserOrders()` --calls--> `validatePagination()`  [INFERRED]
  D:\College\Github_Projects\ecommerce\Backend\controllers\order.controller.mjs → D:\College\Github_Projects\ecommerce\Backend\utils\common_functions.mjs
- `getAllOrders()` --calls--> `validatePagination()`  [INFERRED]
  D:\College\Github_Projects\ecommerce\Backend\controllers\order.controller.mjs → D:\College\Github_Projects\ecommerce\Backend\utils\common_functions.mjs
- `getProductsByCategory()` --calls--> `validatePagination()`  [INFERRED]
  D:\College\Github_Projects\ecommerce\Backend\controllers\product.controller.mjs → D:\College\Github_Projects\ecommerce\Backend\utils\common_functions.mjs
- `getAllProducts()` --calls--> `validatePagination()`  [INFERRED]
  D:\College\Github_Projects\ecommerce\Backend\controllers\product.controller.mjs → D:\College\Github_Projects\ecommerce\Backend\utils\common_functions.mjs
- `getOrderDetails()` --calls--> `formatDate()`  [INFERRED]
  D:\College\Github_Projects\ecommerce\Backend\controllers\order.controller.mjs → D:\College\Github_Projects\ecommerce\Backend\utils\common_functions.mjs

## Communities

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (7): formatDate(), validatePagination(), getAllOrders(), getOrderDetails(), getUserOrders(), getAllProducts(), getProductsByCategory()

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (13): Ahmedabad, Shopping Cart Icon, Dev Traders, DM Sans, Ecommerce Website, Frontend Application, graphify, Nilesh G. Bachani (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (3): AppError, signup(), tryParseJsonError()

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (1): ProtectedRoute()

## Knowledge Gaps
- **9 isolated node(s):** `Nilesh G. Bachani`, `Ahmedabad`, `graphify`, `React`, `Vite` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (3 nodes): `ProtectedRoute.jsx`, `ProtectedRoute.jsx`, `ProtectedRoute()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 4 inferred relationships involving `validatePagination()` (e.g. with `getUserOrders()` and `getAllOrders()`) actually correct?**
  _`validatePagination()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Nilesh G. Bachani`, `Ahmedabad`, `graphify` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._