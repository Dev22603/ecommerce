# Graph Report - Backend  (2026-05-22)

## Corpus Check
- 64 files · ~60,988 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 135 nodes · 143 edges · 8 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `handleError()` - 10 edges
2. `trimStrings()` - 10 edges
3. `handleError()` - 7 edges
4. `handleError()` - 6 edges
5. `handleError()` - 6 edges
6. `validatePagination()` - 6 edges
7. `parseAddressId()` - 4 edges
8. `parseOrderId()` - 4 edges
9. `updateAddress()` - 3 edges
10. `deleteAddress()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `getUserOrders()` --calls--> `validatePagination()`  [INFERRED]
  src\controllers\order.controllers.ts → src\utils\common_functions.ts
- `getAllOrders()` --calls--> `validatePagination()`  [INFERRED]
  src\controllers\order.controllers.ts → src\utils\common_functions.ts
- `validateAddress()` --calls--> `trimStrings()`  [INFERRED]
  src\schemas\address.schemas.ts → src\utils\common_functions.ts
- `validateCartAddData()` --calls--> `trimStrings()`  [INFERRED]
  src\schemas\cart.schemas.ts → src\utils\common_functions.ts
- `validateCreateOrder()` --calls--> `trimStrings()`  [INFERRED]
  src\schemas\order.schemas.ts → src\utils\common_functions.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (11): validateAddress(), validateCartAddData(), validateCartUpdateData(), trimStrings(), validateCreateOrder(), validateOrderStatus(), validateProduct(), validateProductUpdate() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.32
Nodes (12): validatePagination(), createCategory(), createProduct(), deleteProduct(), getAllProducts(), getCategories(), getProductById(), getProductsByCategory() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.47
Nodes (8): cancelOrder(), createOrder(), getAllOrders(), getOrderDetails(), getUserOrders(), handleError(), parseOrderId(), updateOrderStatus()

### Community 4 - "Community 4"
Cohesion: 0.54
Nodes (7): createAddress(), deleteAddress(), getAddressesByUser(), handleError(), parseAddressId(), setDefaultAddress(), updateAddress()

### Community 5 - "Community 5"
Cohesion: 0.32
Nodes (3): mapOrder(), mapOrderItem(), toNumber()

### Community 6 - "Community 6"
Cohesion: 0.52
Nodes (6): addItemToCart(), clearCart(), getCart(), handleError(), removeItemFromCart(), updateCart()

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (1): ApiError

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (1): ApiResponse

## Knowledge Gaps
- **Thin community `Community 10`** (3 nodes): `ApiError`, `.constructor()`, `api_error.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (3 nodes): `ApiResponse`, `.constructor()`, `api_response.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validatePagination()` connect `Community 2` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `getUserOrders()` connect `Community 3` to `Community 2`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `trimStrings()` (e.g. with `validateAddress()` and `validateCartUpdateData()`) actually correct?**
  _`trimStrings()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._