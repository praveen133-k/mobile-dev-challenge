# Backend Challenge: Add New Features to Instant Noodle API

Hi! In this challenge, you will make three small but important changes to our Keystone backend for the `InstantNoodle` list.

---

## Task 1: Add a `reviewsCount` Field

- Add a new number field called `reviewsCount` to the `InstantNoodle` list.
- This number should start at `0` for every instant noodle.

### Acceptance Criteria

- `reviewsCount` exists as an integer field on `InstantNoodle`.
- New noodles created have `reviewsCount` set to `0` by default.

---

## Task 2: Add a `spicinessDescription` Virtual Field

- Add a virtual field called `spicinessDescription` to the `InstantNoodle` list.
- This field will show a word based on the noodle’s `spicinessLevel` number:
  - If it is `1` or `2`, show "Mild"
  - If it is `3` or `4`, show "Medium"
  - If it is `5`, show "Hot"

### Acceptance Criteria

- `spicinessDescription` returns the correct string based on the `spicinessLevel`.
- This field is virtual (not stored in the database).
- Querying the field via GraphQL returns the correct description.

---

## Task 3: Hooks for `reviewsCount` Field

In this task, you will use Keystone hooks to add extra logic related to the `reviewsCount` field on the `InstantNoodle` list.

1. **Update `lastReviewedAt` Timestamp**

- Add a new timestamp field `lastReviewedAt` (can be `null`) to `InstantNoodle`.
- Use a Keystone hook so that whenever the `reviewsCount` changes (increases), the `lastReviewedAt` is set to the current date and time.

2. **Prevent Decreasing `reviewsCount`**

- Use a Keystone hook to block any update that tries to set `reviewsCount` to a number lower than its current value.
- If a decrease is attempted, the update should fail with a clear error message.

### Acceptance Criteria

- `lastReviewedAt` field updates automatically to current date/time only when `reviewsCount` increases.
- Updates that try to lower `reviewsCount` are rejected with a clear error.
- The hooks only affect `reviewsCount`, other fields can be updated normally.
- Verified by testing with GraphQL mutations.

---

## Notes

- Use Keystone hooks like `beforeChange` or `validateInput`.
- The hooks should only affect `reviewsCount` changes, not other fields.
- You can check your work by running the Keystone server and using the GraphQL playground.
- Write clear and clean code.
- We want to see how well you understand Keystone, hooks, and GraphQL.

Good luck and have fun!
