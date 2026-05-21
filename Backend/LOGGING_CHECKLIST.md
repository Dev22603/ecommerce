# Logging expansion checklist

Track adding **info**, **warn**, and **debug** logging (and fixing inconsistent **error** usage) across the Backend. Today logging is almost entirely `logger.error` in catch blocks, plus a few `warn`/`info`/`critical` spots.

**Logger:** [crisplogs](src/lib/logger.ts) via `moduleLogger()` — 28 files already import it.

**Progress:** 0 / 158 items complete (update this line as you check boxes)

**Audit note:** Items marked **(existing)** are already in code — leave unchecked only if you are adding *new* levels (`info`/`warn`/`debug`). Section **I** lists gaps that were missing from the first draft.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not done |
| `[x]` | Done |
| **Has logger** | File already imports `moduleLogger` |
| **info** | Successful mutation or security-relevant success |
| **warn** | Expected client/domain failure (`ApiError`, validation) |
| **error** | Unexpected exception only |
| **debug** | Optional dev detail (pagination, query boundaries) |

### Level conventions

| Level | When to use |
|-------|-------------|
| `debug` | Dev-only: pagination normalized, read/query entry (avoid per-row noise) |
| `info` | Successful **mutations** and security success (login, signup, order created, CRUD) |
| `warn` | Expected failures: `ApiError`, schema validation, empty cart, insufficient stock, 404 business cases — include `code` and safe context |
| `error` | Unexpected exceptions only; use `if (!(error instanceof ApiError))` before logging |
| `critical` | Process cannot start (Prisma init failure) |

### Do not log

- Passwords or password hashes
- JWTs or session tokens
- Full request bodies in production
- Credit card or other sensitive PII

### Where to log (avoid duplicates)

**Recommended:** log mutations and `ApiError` at the **service** layer. Controllers only add logs if services do not, or for controller-only concerns (e.g. invalid `NaN` id before service call).

Pick one strategy and stick to it:

1. **Service-primary** (recommended) — `info`/`warn` in services; controllers rely on `requestLogger` + service logs.
2. **Controller-primary** — log in `handleError` / catch; skip duplicate `info` in services.

---

## Implementation order

1. Cross-cutting: shared helper for expected errors (e.g. `logExpectedError(logger, error, context)` in a util), or consistent `warn` in catch blocks.
2. Services: mutation `info` + `ApiError` `warn` + fix error-guard inconsistencies (Section H).
3. Controllers: only if not duplicating service logs; unify `handleError` for `ApiError`.
4. Middleware + app shell + seed.
5. Optional: `debug`, Prisma log bridge, env `LOG_LEVEL`.

---

## Current state (audit)

| Level | Where used today |
|-------|------------------|
| `info` | `src/index.ts` (server start); `src/middlewares/logging.ts` (2xx/3xx HTTP) |
| `warn` | `src/middlewares/auth.ts`, `uploads.ts`; HTTP 4xx in request logger |
| `error` | Dominant — services, repositories, controllers, validate_cart, `app.ts` global handler |
| `critical` | `src/lib/prisma.ts` (client creation failure) |
| `debug` | **Not used** in `src/` |

**Known gaps:** no business-success logs; most `ApiError` paths silent; several services log every catch as `error` (no `ApiError` guard); business failures returned as `{ status, body }` or plain objects (not `ApiError`) are never logged; controller param `NaN` checks return 400 without `warn`; multer size/limit errors not logged; Prisma logs to stdout not crisplogs; `prisma/seed.ts` uses `console.error`; no `LOG_LEVEL` in `config.ts` / `.env.example`.

---

## Section A — Infrastructure and app shell

| Item | Level | Status |
|------|-------|--------|
| [ ] `src/lib/logger.ts` — drive `level` from `config` / `LOG_LEVEL` env (today hardcoded `DEBUG`) | config | |
| [ ] `src/constants/config.ts` — add `LOG_LEVEL` (and wire in logger) | config | |
| [ ] `.env.example` — document `LOG_LEVEL`, `NODE_ENV` (file may need to be created) | docs | |
| [ ] Process-level — `uncaughtException` / `unhandledRejection` → `critical` or `error` (optional, `index.ts`) | critical/error | |
| [ ] `express.json()` parse errors — global handler or middleware `warn` (malformed body) | warn | |
| [ ] `src/index.ts` — `info` on listen (**done**) | info | |
| [ ] `src/index.ts` — `warn`/`info` for graceful shutdown if implemented | info/warn | |
| [ ] `src/app.ts` — optional `debug` on `GET /health` | debug | |
| [ ] `src/app.ts` — `warn` for unmatched routes (404 middleware) | warn | |
| [ ] `src/app.ts` — global `error` handler (**done**) | error | |
| [ ] `src/app.ts` — `express.static` for `/uploads` and `/api/uploads` (optional `debug` on miss) | debug | |
| [ ] `src/middlewares/auth.ts` — invalid token response includes `err` in JSON; log `warn` only, avoid leaking stack to client | warn | |
| [ ] `src/lib/prisma.ts` — route Prisma query logs through crisplogs or disable in prod | debug/info | |
| [ ] `prisma/seed.ts` — replace `console.error` with `moduleLogger` | error | |
| [ ] `prisma/seed.ts` — `info` on seed start and complete | info | |

---

## Section B — Middleware

**Has logger:** all four files.

### `src/middlewares/logging.ts`

| Item | Level | Status |
|------|-------|--------|
| [ ] HTTP access log by status (**done** — info/warn/error on `finish`) | info/warn/error | |
| [ ] Optional `debug` on request start (method, url, userId) | debug | |

### `src/middlewares/auth.ts`

| Item | Level | Status |
|------|-------|--------|
| [ ] No token — `warn` (**done**) | warn | |
| [ ] Invalid token — `warn` (**done**) | warn | |
| [ ] Insufficient role — `warn` (**done**) | warn | |
| [ ] Optional `info` on successful auth (userId, role) — can be noisy | info | |

### `src/middlewares/uploads.ts`

| Item | Level | Status |
|------|-------|--------|
| [ ] Invalid file rejected — `warn` (**done**) | warn | |
| [ ] Successful upload — `info` (file count, userId) | info | |
| [ ] Multer / storage errors (file too large, `LIMIT_FILE_SIZE`, disk errors) — `error` or `warn` via multer error middleware on product routes | error/warn | |
| [ ] `fileFilter` rejection already logs `warn` — ensure multer passes `Error` to error handler (today may surface as 500) | warn | |

### `src/middlewares/validate_cart.ts`

| Item | Level | Status |
|------|-------|--------|
| [ ] Unexpected validation error — `error` (**done**) | error | |
| [ ] `ApiError` from schema — `warn` (message, path) | warn | |

---

## Section C — Controllers

**Strategy:** Prefer service-layer logs; use this section if logging at controller instead.

**Has logger:** all seven controller files.

### Shared `handleError` (product, order, cart, address)

| Item | Level | Status |
|------|-------|--------|
| [ ] `product.controllers.ts` — `warn` for `ApiError` in `handleError` | warn | |
| [ ] `order.controllers.ts` — `warn` for `ApiError` in `handleError` | warn | |
| [ ] `cart.controllers.ts` — `warn` for `ApiError` in `handleError` | warn | |
| [ ] `address.controllers.ts` — `warn` for `ApiError` in `handleError` | warn | |

### `src/controllers/auth.controllers.ts`

| Handler | warn (ApiError) | info (success) | Status |
|---------|-----------------|----------------|--------|
| [ ] `signup` | | | |
| [ ] `login` | | | |

### `src/controllers/user.controllers.ts`

| Handler | warn | info | debug | Status |
|---------|------|------|-------|--------|
| [ ] `getAllUsers` | | | optional | |

### `src/controllers/product.controllers.ts`

| Handler | warn | info (mutation) | Status |
|---------|------|-----------------|--------|
| [ ] `createProduct` | | | |
| [ ] `createCategory` | | | |
| [ ] `updateProduct` | | | |
| [ ] `deleteProduct` | | | |
| [ ] `searchProductsByName` | | | |
| [ ] `getProductsByCategory` | | | |
| [ ] `getAllProducts` | | | |
| [ ] `getProductById` | | | |
| [ ] `getCategories` | | | |

### `src/controllers/cart.controllers.ts`

| Handler | warn | info (mutation) | Status |
|---------|------|-----------------|--------|
| [ ] `addItemToCart` | | | |
| [ ] `getCart` | | | |
| [ ] `updateCart` | | log non-throw `status` from service (400/404) if not logged in service | |
| [ ] `removeItemFromCart` | | | |
| [ ] `clearCart` | | | |

### `src/controllers/order.controllers.ts`

| Handler | warn | info (mutation) | Status |
|---------|------|-----------------|--------|
| [ ] `createOrder` | | | |
| [ ] `getUserOrders` | | | |
| [ ] `getOrderDetails` | | | |
| [ ] `cancelOrder` | | | |
| [ ] `updateOrderStatus` | | | |
| [ ] `getAllOrders` | | | |

### `src/controllers/address.controllers.ts`

| Handler | warn | info (mutation) | Status |
|---------|------|-----------------|--------|
| [ ] `createAddress` | | | |
| [ ] `getAddressesByUser` | | | |
| [ ] `updateAddress` | | | |
| [ ] `deleteAddress` | | | |
| [ ] `setDefaultAddress` | | | |

### Controller-only param validation (no service call — easy to miss)

Log `warn` when returning 400 for invalid path/query params (before calling service).

| File | Location | Status |
|------|----------|--------|
| [ ] `product.controllers.ts` | `getProductById`, `deleteProduct`, `updateProduct` — `Number.isNaN(id)` | |
| [ ] `cart.controllers.ts` | `removeItemFromCart` — `Number.isNaN(productId)` | |
| [ ] `order.controllers.ts` | `getOrderDetails`, `cancelOrder`, `updateOrderStatus` — `Number(req.params.order_id)` (no NaN check today) | |
| [ ] `address.controllers.ts` | `updateAddress`, `deleteAddress`, `setDefaultAddress` — `Number(req.params.id)` (no NaN check today) | |

### `src/controllers/user.controllers.ts` (extra)

| Item | Level | Status |
|------|-------|--------|
| [ ] `getAllUsers` — unexpected `error` only today; add `warn` if admin-only errors added | error/warn | |

---

## Section D — Services

**Has logger:** all six service files.

### `src/services/auth.services.ts`

| Method | info (success) | warn (ApiError) | error (unexpected) | Status |
|--------|----------------|-----------------|-------------------|--------|
| [ ] `signup` | | user exists | **done** pattern | |
| [ ] `login` | | not found / bad password | **done** pattern | |

### `src/services/user.services.ts`

| Method | info | warn | error guard | Status |
|--------|------|------|-------------|--------|
| [ ] `getAllUsers` | | | fix: only log non-ApiError (Section H) | |

### `src/services/product.services.ts`

| Method | info (mutation) | warn (ApiError) | error (unexpected) | Status |
|--------|-----------------|-----------------|---------------------|--------|
| [ ] `createProduct` | | | **done** | |
| [ ] `createCategory` | created | category already exists (returns 200 + message, not `ApiError`) — **warn** (Section I) | **done** | |
| [ ] `getCategories` | | | **fix:** ApiError guard (Section H) | |
| [ ] `getAllProducts` | | | **fix:** ApiError guard (Section H) | |
| [ ] `searchProductsByName` | | | **fix:** ApiError guard (Section H) | |
| [ ] `getProductsByCategory` | | | **fix:** ApiError guard (Section H) | |
| [ ] `getProductById` | | not found | **done** | |
| [ ] `deleteProduct` | deleted | not found (returns message object, not `ApiError`) — **warn** (Section I) | **fix:** guard on unexpected only | |
| [ ] `updateProduct` | | | **done** | |

### `src/services/cart.services.ts`

| Method | info (mutation) | warn (ApiError) | error (unexpected) | Status |
|--------|-----------------|-----------------|---------------------|--------|
| [ ] `addItemToCart` | | | **done** | |
| [ ] `getCart` | | | **fix:** ApiError guard (Section H) | |
| [ ] `updateCart` | success paths | stock 400 / cart 404 returned as `{ status, body }` — **`warn` without throw** (Section I) | **done** for thrown errors | |
| [ ] `removeItemFromCart` | | | **done** | |
| [ ] `clearCart` | cleared | | **fix:** ApiError guard (Section H) | |

### `src/services/order.services.ts`

| Method | info (mutation) | warn (ApiError) | error guard | Status |
|--------|-----------------|-----------------|-------------|--------|
| [ ] `createOrder` | order created | cart empty, stock, address | **done** | |
| [ ] `getUserOrders` | | | **fix:** add ApiError guard (Section H) | |
| [ ] `getOrderDetails` | | not found | **done** | |
| [ ] `cancelOrder` | cancelled | not found / not pending | **done** | |
| [ ] `updateOrderStatus` | status updated | not found | **done** | |
| [ ] `getAllOrders` | | no orders (admin) | **done** | |

### `src/services/address.services.ts`

| Method | info (mutation) | warn (ApiError) | error (unexpected) | Status |
|--------|-----------------|-----------------|---------------------|--------|
| [ ] `createAddress` | | | **done** | |
| [ ] `getAddressesByUser` | | | **fix:** ApiError guard (Section H) | |
| [ ] `updateAddress` | | | **done** | |
| [ ] `deleteAddress` | soft/hard delete success | not found | **done** | |
| [ ] `setDefaultAddress` | | | **done** | |

---

## Section E — Repositories

**Has logger:** all six repository files. **Today:** only `logger.error` in catch blocks (**done** for DB failures).

**Guidance:** Keep `error` on DB failures. Optional `debug` at method entry with ids only. Avoid duplicating service `info` unless team standardizes “log mutations at repository.”

### `src/repositories/user.repositories.ts`

| Method | error (DB) | optional debug | Status |
|--------|------------|----------------|--------|
| [ ] `existsByEmail` | **done** | | |
| [ ] `findByEmail` | **done** | | |
| [ ] `create` | **done** | | |
| [ ] `findAll` | **done** | | |

### `src/repositories/category.repositories.ts`

| Method | error (DB) | optional debug | Status |
|--------|------------|----------------|--------|
| [ ] `existsById` | **done** | | |
| [ ] `existsByName` | **done** | | |
| [ ] `create` | **done** | | |
| [ ] `findAll` | **done** | | |

### `src/repositories/product.repositories.ts`

| Method | error (DB) | optional debug | Status |
|--------|------------|----------------|--------|
| [ ] `create` | **done** | | |
| [ ] `findById` | **done** | | |
| [ ] `findRawById` | **done** | | |
| [ ] `findPaginated` | **done** | | |
| [ ] `searchByName` | **done** | | |
| [ ] `findByCategory` | **done** | | |
| [ ] `delete` | **done** | | |
| [ ] `update` | **done** | | |

### `src/repositories/cart.repositories.ts`

| Method | error (DB) | optional debug | Status |
|--------|------------|----------------|--------|
| [ ] `addItem` | **done** | | |
| [ ] `findByUser` | **done** | | |
| [ ] `updateItem` | **done** | | |
| [ ] `deleteItem` | **done** | | |
| [ ] `clearByUser` | **done** | | |

### `src/repositories/order.repositories.ts`

| Method | error (DB) | optional debug | Status |
|--------|------------|----------------|--------|
| [ ] `createFromCart` | **done** | | |
| [ ] `findUserOrders` | **done** | | |
| [ ] `findDetails` | **done** | | |
| [ ] `getStatus` | **done** | | |
| [ ] `updateStatus` | **done** | | |
| [ ] `findAllGroupedByUser` | **done** | | |

### `src/repositories/address.repositories.ts`

| Method | error (DB) | optional debug | Status |
|--------|------------|----------------|--------|
| [ ] `create` | **done** | | |
| [ ] `findByUser` | **done** | | |
| [ ] `findRawById` | **done** | | |
| [ ] `update` | **done** | | |
| [ ] `isUsedInOrders` | **done** | | |
| [ ] `softDelete` | **done** | | |
| [ ] `hardDelete` | **done** | | |
| [ ] `setDefault` | **done** | | |

---

## Section F — Schema validation

Log **`warn` at service or middleware** when catching `ApiError` — not inside schema files.

| File | Status |
|------|--------|
| [ ] `src/schemas/user.schemas.ts` — consumed by auth service | |
| [ ] `src/schemas/product.schemas.ts` — consumed by product service | |
| [ ] `src/schemas/order.schemas.ts` — consumed by order service | |
| [ ] `src/schemas/cart.schemas.ts` — consumed by cart service + validate_cart middleware | |
| [ ] `src/schemas/address.schemas.ts` — consumed by address service | |

---

## Section G — No logger required (N/A)

These files do not need `moduleLogger` under normal operation:

- `src/routes/*.routes.ts` — wiring only; use `requestLogger`
- `src/utils/api_response.ts`, `src/utils/mappers.ts`, `src/utils/common_functions.ts`
- `src/utils/api_error.ts` — error type only (unless you add `logExpectedError` helper here or in new `log.util.ts`)
- `src/constants/*`, `src/types/*`
- `src/generated/prisma/**` — generated code

---

## Section H — Consistency fixes

Fix these before or while adding new levels so logs stay accurate.

### Missing `ApiError` guard (logs unexpected DB failures correctly, but treats all catch as `error`)

| Item | File / method | Fix |
|------|---------------|-----|
| [ ] | `order.services.ts` → `getUserOrders` | `if (!(error instanceof ApiError))` before `logger.error` |
| [ ] | `user.services.ts` → `getAllUsers` | Same guard |
| [ ] | `cart.services.ts` → `getCart`, `clearCart` | Same guard |
| [ ] | `product.services.ts` → `getCategories`, `getAllProducts`, `searchProductsByName`, `getProductsByCategory` | Same guard |
| [ ] | `product.services.ts` → `deleteProduct` | Same guard; add `warn` for not-found return path (Section I) |
| [ ] | `address.services.ts` → `getAddressesByUser` | Same guard |

### Controllers and conventions

| Item | File | Issue | Fix |
|------|------|-------|-----|
| [ ] | Controllers | `handleError` in product/order/cart/address swallows `ApiError` silently | Add `logger.warn` with `code`, `message`, `userId` |
| [ ] | `auth.controllers.ts` | `ApiError` returned without `warn` | Add `warn` in catch before return |
| [ ] | `user.controllers.ts` | Only logs unexpected `error` | Add `warn` when domain errors are introduced |
| [ ] | Team convention | Risk of duplicate `info` in controller + service | Document chosen strategy in PR / README |

---

## Section I — Non-`ApiError` business outcomes (first draft missed these)

Some flows return **200/400/404 with a body** instead of throwing `ApiError`. They will **not** hit catch blocks or `handleError` — need explicit `warn` (or `info`) where the branch happens.

| Item | File | Branch | Suggested log |
|------|------|--------|----------------|
| [ ] | `cart.services.ts` → `updateCart` | `status: 400` insufficient stock | `warn` with userId, productId, stock_available |
| [ ] | `cart.services.ts` → `updateCart` | `status: 404` item not in cart (update/delete quantity 0) | `warn` |
| [ ] | `product.services.ts` → `createCategory` | `{ message: "Category already exists" }` | `warn` |
| [ ] | `product.services.ts` → `deleteProduct` | `{ message: NO_PRODUCT_FOUND... }` (no throw) | `warn` |
| [ ] | `order.repositories.ts` → `createFromCart` | `kind: "cart_empty"` / `insufficient_stock` (handled in service today) | Ensure service `warn` covers all `kind` values |

---

## Section J — Routes reference (read-only GETs — optional audit logs)

Not mutations; include only if you want admin/audit `debug` or slow-query `warn`.

| Route | Handler |
|-------|---------|
| `GET /api/products/` | `getAllProducts` |
| `GET /api/products/id/:id` | `getProductById` |
| `GET /api/products/categories` | `getCategories` |
| `GET /api/products/product_name/:product_name` | `searchProductsByName` |
| `GET /api/products/category_id/:category_id` | `getProductsByCategory` |
| `GET /api/cart/` | `getCart` |
| `GET /api/orders/` | `getUserOrders` |
| `GET /api/orders/:order_id` | `getOrderDetails` |
| `GET /api/orders/admin/all` | `getAllOrders` |
| `GET /api/address/` | `getAddressesByUser` |
| `GET /health` | inline in `app.ts` |

---

## Cross-cutting tasks

| Item | Status |
|------|--------|
| [ ] Add shared helper e.g. `logExpectedError(logger, error, context)` in `src/utils/` for `ApiError` → `warn` and non-throw outcomes | |
| [ ] Document `LOG_LEVEL` in `.env.example` when logger reads env | |
| [ ] Align all service catch blocks: `ApiError` → `warn`, else → `error` (see Section H full list) | |
| [ ] Log non-throw business branches (Section I) at point of return | |
| [ ] Review production log volume after adding `info` on hot paths | |
| [ ] Avoid logging stack traces on expected `warn` paths | |

---

## Optional follow-ups

- [ ] Env-based `LOG_LEVEL` in `src/constants/config.ts`
- [ ] Prisma `$on` / custom log emitter → crisplogs
- [ ] 404 middleware with `warn` (method, path, ip)
- [ ] Request `debug` only when `LOG_LEVEL=DEBUG`

---

## API route reference (for mutation `info` mapping)

| Route | Method | Handler | Mutation? |
|-------|--------|---------|-----------|
| `/api/auth/signup` | POST | signup | yes |
| `/api/auth/login` | POST | login | yes |
| `/api/users/` | GET | getAllUsers | no |
| `/api/products/` | POST | createProduct | yes |
| `/api/products/:id` | DELETE | deleteProduct | yes |
| `/api/products/:id` | PUT | updateProduct | yes |
| `/api/products/new_category` | POST | createCategory | yes |
| `/api/cart/add` | POST | addItemToCart | yes |
| `/api/cart/update` | PUT | updateCart | yes |
| `/api/cart/remove/:product_id` | DELETE | removeItemFromCart | yes |
| `/api/cart/clear` | DELETE | clearCart | yes |
| `/api/orders/create` | POST | createOrder | yes |
| `/api/orders/:order_id` | PUT | cancelOrder | yes |
| `/api/orders/:order_id/status` | PATCH | updateOrderStatus | yes |
| `/api/address/` | POST | createAddress | yes |
| `/api/address/:id` | PUT | updateAddress | yes |
| `/api/address/:id` | DELETE | deleteAddress | yes |
| `/api/address/:id/default` | PUT | setDefaultAddress | yes |
| `GET /api/orders/` | GET | getUserOrders | no |
| `GET /api/orders/:order_id` | GET | getOrderDetails | no |
| `GET /api/orders/admin/all` | GET | getAllOrders | no |
| `GET /api/cart/` | GET | getCart | no |
| `GET /api/address/` | GET | getAddressesByUser | no |
| `GET /health` | GET | (inline) | no |
| `GET /api/products/` | GET | getAllProducts | no |
| `GET /api/products/id/:id` | GET | getProductById | no |
| `GET /api/products/categories` | GET | getCategories | no |
| `GET /api/products/product_name/:name` | GET | searchProductsByName | no |
| `GET /api/products/category_id/:id` | GET | getProductsByCategory | no |

---

## Files with logger today (28)

`src/app.ts`, `src/index.ts`, `src/lib/logger.ts`, `src/lib/prisma.ts`, `src/middlewares/auth.ts`, `src/middlewares/logging.ts`, `src/middlewares/uploads.ts`, `src/middlewares/validate_cart.ts`, all controllers, all services, all repositories listed above.
