## 2025-05-27 - Frontend Performance Optimizations

**Learning:** Computations like `Array.reduce` inside React context files without utilizing `useMemo` can lead to massive bottlenecks when called often (or exposed as functions). Using `useMemo` stops these computations from firing unnecessarily on every render frame for children consuming them. Additionally, lists of complex components without `React.memo` lead to cascading re-renders.
**Action:** Always memoize derived state computations in Context files via `useMemo` instead of placing calculations directly in effect scopes and discarding, or returning functions that re-compute when evaluated. Also wrap granular components like Cards in `React.memo` to skip unwanted list re-rendering.
