# Challenge 9: Activity Logging System (10 points - Low)

**Estimated Time:** 1.5-2 hours
**Technical Difficulty:** Medium

**Note:** Challenge 10 (File Upload System) complements this challenge — files attached to contacts or deals can be recorded as activity events.

## User Story
**As a** sales manager,
**I want** a comprehensive activity logging system that tracks all user interactions with contacts and deals,
**So that** I can monitor team activity, ensure follow-ups are completed, and maintain a complete history of customer interactions.

## Business Value
Activity tracking provides critical insights for sales management:
- Creates accountability for sales team activities
- Ensures no customer interactions fall through the cracks
- Provides historical context for customer relationships
- Helps identify the most effective sales activities

## Current Implementation Issues
The current system lacks activity tracking capabilities:
- No centralized record of user activities related to contacts and deals
- Missing timeline visualization of customer interactions
- No way to track follow-up tasks and their completion
- Limited reporting on sales team activities

## Core Requirements
*(Required for full points)*

1. Implement activity logging system
   - Allow users to create manual activities (note, call, meeting) associated with contacts and/or deals
   - Record timestamps and user information for each activity
   - Support custom activity types beyond the defaults

   **Suggested Activity entity fields:** `id`, `type` (e.g. `note` | `call` | `meeting` | `custom`), `description`, `contactId` (optional), `dealId` (optional), `userId`, `createdAt`. An activity must be associated with at least one of `contactId` or `dealId`.

2. Create activity timeline visualization
   - Implement chronological display of activities on the deal detail view (`DealDetailPage.tsx`)
   - Allow filtering by activity type and date range

   **Note:** A contact detail page does not currently exist. You may add the activity timeline to the existing contacts list (e.g., expandable rows or a modal) or create a new contact detail view — document your choice.

### Relevant Files
- `backend/src/modules/contact/domain/Contact.ts`
- `backend/src/modules/deal/domain/Deal.ts`
- `frontend/src/pages/ContactsPage.tsx`
- `frontend/src/pages/DealsPage.tsx`

## Acceptance Criteria
- [ ] Users can manually add activities with custom details
- [ ] Activity timeline shows a chronological history for contacts and deals
- [ ] Activities can be filtered and searched by various criteria

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Follow-up tasks with due dates and notification reminders
- Activity reports per user (number of calls, meetings, etc. over a period)
