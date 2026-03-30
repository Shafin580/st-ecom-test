# Candidate Decisions & Notes

Please use this file to briefly outline your technical choices and the rationale behind them.

## 1. State Management & Architecture
*Why did you structure your state the way you did? Which patterns did you choose for handling the flaky API requests, loading states, and error handling?*

I used two complementary state management strategies:

- **Server State — TanStack Query (React Query):** All product fetching is handled through `useQuery`. Given the API's 20% probabilistic failure rate and 0.5–2.5s delay, TanStack Query's built-in `retry` (configured to 2 attempts with an 800ms delay) silently recovers from transient failures before surfacing errors. When all retries fail, a **Sonner** toast notification appears with a one-click "Retry" action, keeping the UI non-intrusive.

- **Client State — Zustand:** Shopping cart state (items, quantities, drawer visibility) lives in a lightweight Zustand store. This avoids prop-drilling across `ProductCard`, `CartDrawer`, and `App` while keeping the state logic colocated in a single file (`src/store/useCartStore.ts`).

- **URL State:** Filters (`page`, `category`, `search`) are synced to URL query parameters via `window.history.pushState` and a custom `useUrlState` hook. This means filter states survive page refreshes, can be bookmarked, and shared as links. The search input is **debounced** (400ms) to avoid hammering the flaky API on every keystroke.

- **Loading States:** I intentionally removed `placeholderData` from React Query so that every filter/page change triggers a full skeleton loading state rather than showing stale data. This gives the user clear visual feedback that fresh data is being fetched.

## 2. Trade-offs and Omissions
*What did you intentionally leave out given the constraints of a take-home assignment? If you had more time, what would you prioritize next?*

- I used lightweight custom hooks for URL sync via `pushState` rather than introducing a full router (`react-router-dom`). This keeps the bundle lean for a single-page view while still delivering URL-based state persistence.
- The "Proceed to Checkout" button in the cart drawer is purely visual — no checkout flow is implemented.
- Cart state is not persisted to `localStorage`. With more time, I would add Zustand's `persist` middleware so the cart survives browser refreshes.
- The category filter uses a native `<select>` element. A custom dropdown component (e.g., Radix UI Select) would provide a more polished mobile experience.
- With more time, I'd implement infinite scrolling with an Intersection Observer as an alternative to pagination.

## 3. AI Usage
*How did you utilize AI tools (ChatGPT, Copilot, Cursor, etc.) during this assignment? Provide a brief summary of how they assisted you.*

I utilized the Antigravity AI assistant throughout development:
- **Architecture planning:** We iterated on the implementation plan through multiple review rounds — choosing TanStack Query over raw `useEffect` fetching, opting for URL params over internal state, and selecting Zustand for cart management.
- **Figma translation:** The AI adapted the product card layout from a provided Figma screenshot, matching the specific gray image container, left-aligned typography, and Taka (৳) currency formatting.
- **Component scaffolding:** It generated the skeleton loader, pagination, cart store, cart drawer, and the interactive hover overlay with add-to-cart/quantity stepper logic.
- **Bug fixing:** Identified that `placeholderData` was suppressing loading states on filter changes and resolved it by removing the configuration.

## 4. Edge Cases Identified
*Did you notice any edge cases or bugs that you didn't have time to fix? Please list them here.*

- If rapid search input coincides with the API's 20% failure window, a Sonner error toast may briefly appear even though the next debounced keystroke resolves successfully — this is cosmetic but could be improved by cancelling stale toasts.
- The cart's quantity stepper on the product card is only accessible via hover, which is not ideal for touch/mobile devices. A persistent "Add to Cart" button below the card would improve mobile UX.
- The mock API generates random prices and stock on each page load (since data is generated at module load time), so the cart could reference stale price data if the module were ever re-evaluated — not an issue with the current static mock but worth noting for a real API.
