## 2026-05-21 - Cart Context Re-renders
**Learning:** The CartContext was calculating cart totals inline on every render and exposing unmemoized objects to consumers. Additionally, the Navbar component recalculated the total quantity inline despite it being available as an aggregate.
**Action:** Use useMemo to calculate and expose derived data in React contexts so consumers don't run expensive calculations. Ensure helper functions in contexts are wrapped in useCallback if included in a context's dependency array.
