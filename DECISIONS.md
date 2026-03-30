# Candidate Decisions & Notes

Please use this file to briefly outline your technical choices and the rationale behind them.

## 1. State Management & Architecture
*Why did you structure your state the way you did? Which patterns did you choose for handling the flaky API requests, loading states, and error handling?*

I opted to use **TanStack Query (React Query)** globally for interacting with the mock API. Given the requirement to handle a flaky and slow API, TanStack's built-in robust promise states (`isLoading`, `isError`, etc.) and retries made this trivial. I configured the `QueryClient` to perform a couple of silent retries before entirely failing. 

Local UI state for filters (`page`, `search`, `category`) is intentionally bound to **native URL query parameters** instead of internal React state. This creates a more authentic e-commerce experience because filter states can be preserved and shared across instances effortlessly. I've also added a custom debouncer for the search input to ensure we don't spam the API with successive queries during typing.

## 2. Trade-offs and Omissions
*What did you intentionally leave out given the constraints of a take-home assignment? If you had more time, what would you prioritize next?*

I wrote lightweight custom hooks for syncing with standard `window.history.pushState` rather than wiring up a fully featured router (e.g., `react-router-dom`), prioritizing less overhead setup while still solving the requirement of URL sync cleanly.

I've also removed the `placeholderData: (prev) => prev` configuration in React Query. Because the API simulate significant loading conditions inherently, letting the UI tear down and show the skeleton loader smoothly upon filter changes felt more responsive than showing stale elements while fetching in the background. If I had more time, I'd implement infinite scrolling paired with intersecting observers instead of basic pagination.

## 3. AI Usage
*How did you utilize AI tools (ChatGPT, Copilot, Cursor, etc.) during this assignment? Provide a brief summary of how they assisted you.*

I utilized the Antigravity assistant extensively. Through careful dialogue planning and planning mode reviews:
- We matched the specific UI of the Figma Product grid, specifically adapting raw tailwind utilities.
- Implemented and tuned TanStack Query behavior under network stress.
- Re-architected states away from `useState` toward scalable URL parameters syncing directly via a custom React hook approach.
- Implemented polished skeleton states to bridge the delayed fetch gaps natively.

## 4. Edge Cases Identified
*Did you notice any edge cases or bugs that you didn't have time to fix? Please list them here.*

- If the user types very fast, despite the 400ms debounce, there is a possibility that a concurrent API race starts overlapping due to React Query caching; this was mitigated generally but the flaky failure chance might occasionally show a Sonner toast while the next successful letter typed resolves to an instant success.
- Mobile UX on the category dropdown is slightly generic; a tailored Radix UI / Shadcn Select would replace the native `<option>` tags.
