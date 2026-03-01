# Challenge 1: Code Audit & Bug Fixes (15 points - High)

**Estimated Time:** 1.5-2 hours
**Technical Difficulty:** Hard

## User Story
**As a** tech lead reviewing the CRM codebase,
**I want** critical bugs identified and fixed before they reach production,
**So that** the system is reliable, secure, and data-consistent for our users.

## Business Value
Shipping bugs to production in a CRM has direct business consequences:
- Corrupted customer data destroys trust and creates compliance risks
- Silent authentication failures cause deals to be lost without trace
- Security vulnerabilities expose sensitive deal and contact information
- Inconsistent UI state leads to user errors and bad business decisions

## The Challenge

The codebase has **four known bugs** with real production consequences. Your task is to:

1. **Find each bug** by reading the relevant code
2. **Understand the root cause** — not just the symptom
3. **Fix it** correctly
4. **Write a test** that would have caught it

In your PR description, for each bug include:
- The file(s) involved
- Root cause explanation (1-2 sentences)
- Your fix approach and any tradeoffs

## Known Symptoms

The bugs manifest as the following symptoms. You need to trace each to its root cause:

### Symptom A — Orphaned data after failed registration
When a user registers and something fails mid-process (e.g., a database constraint violation on the user), the system leaves behind partially created records that are never cleaned up. Future registrations or queries may behave unexpectedly as a result.

**Hint:** Look at what happens when multiple entities are created sequentially during registration.

### Symptom B — Authenticated-looking session with an expired token
After a user's access token expires, refreshing the browser restores the session and the UI shows the user as logged in — but every API call fails silently or with an unhelpful error. The user has no indication their session is invalid until something breaks.

**Hint:** Look at how the frontend determines whether a user is authenticated on page load.

### Symptom C — Stage change not reflected after network error
In the deals Kanban board, when a user drags a deal to a new stage and the API call fails (returns an error), the card visually reverts. However, if the error is `undefined` or not thrown (e.g., a timeout where the promise resolves with no response), the UI stays in the moved state permanently — showing stale data that doesn't match the database.

**Hint:** Look at the optimistic update and revert logic in the deals page.

### Symptom D — Unauthenticated access to user management
A security-conscious developer reviewing the API noticed that certain routes that should require authentication are publicly accessible. Any unauthenticated request can read, create, or delete resources it should not have access to.

**Hint:** Compare how different resource routes are registered in the application entry point.

## Core Requirements

1. Fix all four bugs
2. For each fix, explain the root cause and your approach in the PR description
3. Write at least one test that validates the fix (can be unit or integration)

## Stretch Goals

- Add regression tests for all four bugs, not just one
- For Symptom A: implement the fix using a proper database transaction pattern
- For Symptom B: implement token expiration checking with a fallback to logout rather than just detecting the issue
- Propose additional hardening measures beyond the specific bugs (e.g., global error boundary, request timeout handling)

## Relevant Files

- `backend/src/modules/auth/application/AuthUseCases.ts`
- `backend/src/shared/infrastructure/database/data-source.ts`
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/pages/DealsPage.tsx`
- `backend/src/app.ts`

## Acceptance Criteria

- [ ] Symptom A is fixed: failed registration does not leave orphaned records in the database
- [ ] Symptom B is fixed: expired token causes graceful logout or refresh, not a broken authenticated state
- [ ] Symptom C is fixed: network failures always leave the UI consistent with the actual server state
- [ ] Symptom D is fixed: the affected routes require valid authentication
- [ ] At least one test covers a bug that previously had no test coverage
- [ ] PR description explains the root cause of each bug, not just the fix
