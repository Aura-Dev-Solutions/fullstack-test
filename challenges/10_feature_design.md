# Challenge 10: Feature Design & Implementation (15 points - High)

**Estimated Time:** 2-3 hours
**Technical Difficulty:** Hard

## User Story
**As a** sales manager,
**I want** to assign deals to specific sales representatives and filter the pipeline by assignee,
**So that** I know who is responsible for each opportunity and can track individual performance.

## Business Value
In any growing sales team, deal ownership is critical:
- Without assignment, deals fall through the cracks with no clear accountability
- Managers cannot track individual rep performance or workload
- Filtering by assignee is one of the most requested CRM features in sales teams
- Deal assignment data feeds into commission calculation and performance reviews

## The Challenge

This is a **design-first challenge**. The requirement above is intentionally brief — just like a real product ticket. Before writing code, you need to make design decisions and document them.

**There is no single correct implementation.** We are evaluating your reasoning, not your adherence to a spec.

## Design Decisions You Must Make

Before implementing, think through and document in your PR:

1. **Data model**: How do you represent assignment? What happens to deals when a user is deleted? What does "unassigned" look like — `null`, a sentinel value, something else?

2. **Business rules**: Can a deal have multiple assignees? Can someone assign a deal to a person in a different organization? What role (if any) should be allowed to reassign deals?

3. **API design**: What endpoints change? Do you add a field to the existing deal endpoints or create a dedicated assignment endpoint? What are the tradeoffs?

4. **Frontend UX**: Where does the assignee selector appear? How do you display the assignee in the Kanban view without cluttering the card? What does the filter UI look like?

5. **Edge cases**: What happens if you filter by an assignee who has no deals? What if the logged-in user tries to self-assign a deal owned by another organization?

## Core Requirements

1. **Backend**:
   - Add assignee support to the Deal entity (migration or schema change)
   - Update deal create/update endpoints to accept an optional `assigneeId`
   - Add the ability to filter deals by `assigneeId` in the list endpoint
   - Return assignee information in deal responses

2. **Frontend**:
   - Add assignee selector to the deal creation and edit forms (show users from the same organization)
   - Display the assignee on deal cards in the Kanban view
   - Add an assignee filter to the deals page

3. **PR Description** (required, not optional):
   - Document the design decisions you made and why
   - Call out any tradeoffs or alternative approaches you considered
   - Note anything you would do differently with more time

## Stretch Goals

- Send an in-app notification (or console log as a placeholder) when a deal is assigned to you
- Show an "Assigned to me" quick filter button
- Include assignee data in the dashboard metrics (e.g., pipeline value by rep)
- Add validation that the `assigneeId` belongs to the same organization as the deal

## Relevant Files

- `backend/src/modules/deal/domain/Deal.ts`
- `backend/src/modules/deal/infrastructure/DealEntity.ts`
- `backend/src/modules/deal/application/DealUseCases.ts`
- `backend/src/modules/deal/http/DealController.ts`
- `backend/src/modules/users/application/UserUseCases.ts`
- `frontend/src/pages/DealsPage.tsx`
- `frontend/src/services/deal.service.ts`

## Acceptance Criteria

- [ ] Deals can be created and updated with an optional assignee from the same organization
- [ ] The deals list endpoint supports filtering by `assigneeId`
- [ ] Deal cards in the Kanban view show the assignee's name or initials
- [ ] The deals page has an assignee filter (dropdown or similar)
- [ ] The PR description documents at least 3 design decisions with reasoning
- [ ] Unassigned deals are handled gracefully in both backend and frontend
- [ ] The implementation does not break any existing deal functionality
