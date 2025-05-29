# Frontend Challenge: Extend the Instant Noodle App

Hi! In this challenge, you’ll add features to the frontend of the Instant Noodle app. You’ll work with filtering, UI, local state, and GraphQL.

This tests your React Native (Expo + TypeScript), state management, and GraphQL skills.

---

## Task 1: Add Filtering to the Noodle List

- In `frontend/src/app/index.tsx`, add UI controls to filter the noodle list by:
  - `spicinessLevel` (number)
  - `originCountry` (enum) — check backend for options

### Acceptance Criteria

- Users can filter noodles by `spicinessLevel` and/or `originCountry`.
- Filters update the noodle list immediately.
- Filters use simple UI elements (dropdowns, inputs, etc).

---

## Task 2: Add a "Leave Review" Feature

> ⚠️ Backend must support the `reviewsCount` feature first.

- In `frontend/src/app/noodle-details/[id].tsx`, add:

  - A `Leave Review` button
  - A tag or text showing the current `reviewsCount`

- When clicked, the button should **immediately increase** the `reviewsCount` and update the UI.

### Acceptance Criteria

- The `Leave Review` button is visible on the noodle detail page.
- The current `reviewsCount` is shown visibly.
- Clicking the button increments `reviewsCount` in the backend.
- The UI updates the count immediately.

---

## Task 3: Add Local Favourites Feature

- Store favourites **locally and persistently** (not on the server).
- Add a top-right button (`headerRight`) on `index.tsx` to open the favourites page (`frontend/src/app/favourites/index.tsx`).
- The favourites page shows a 1-column list of favourite noodles.
- The favourites page shares the filter UI and filter state with the main list — filters stay synced.
- Add an `Add to Favourite` button on noodle detail page.
- Allow removing noodles from favourites on the favourites page.

### Acceptance Criteria

- Favourites persist between app restarts.
- Favourites page shows only favourite noodles.
- Filters stay synced between main and favourites pages.
- Users can add and remove favourites.
- Navigation to favourites page works from home screen.

---

## Notes

- Write clean, modular code.
- Reuse components where possible (e.g., noodle card, filter UI).
- Handle loading and error states well.
- Use efficient and correct GraphQL queries/mutations.

Have fun and show off your React Native skills!
