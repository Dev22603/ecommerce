## 2025-05-25 - Useless Computations in Context
**Learning:** Found two `useEffect` hooks in `CartContext.jsx` that computed `totalPrice` and `totalQuantity` on every `cartItems` change, but immediately discarded the results since they were assigned to block-scoped variables. The codebase may contain unneeded computations that are never used.
**Action:** When inspecting contexts, look for block-scoped variables and unused state variables that waste CPU cycles.
