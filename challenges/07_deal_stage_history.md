# Challenge 7: Deal Stage History Tracking (15 points - Medium)

**Estimated Time:** 1.5-2 hours
**Technical Difficulty:** Medium

## User Story
**As a** sales director,
**I want** to track the complete history of deal stage transitions with timestamps and user information,
**So that** I can analyze our sales pipeline efficiency and identify bottlenecks in our sales process.

## Business Value
Understanding deal progression is critical for sales optimization:
- Provides insights into sales cycle duration at each stage
- Helps identify bottlenecks in the sales process
- Enables accurate sales forecasting based on historical patterns
- Improves accountability by tracking who moved deals between stages

## Current Implementation Issues
The current deal management system has limitations:
- Deals can be updated but there's no tracking of stage transitions
- No historical record of when deals moved between stages
- Cannot determine how long deals stay in each stage
- No audit trail of which team member made changes

## Core Requirements
*(Required for full points)*

1. Implement deal stage history tracking
   - Create a `DealStageHistory` entity to record stage changes
   - Intercept stage changes in `updateDeal` and persist a history record with timestamp and userId
   - Create a `GET /deals/:id/history` endpoint to retrieve stage history

2. Create timeline visualization
   - Implement a visual timeline component in the deal detail view (`DealDetailPage`)
   - Show stage transitions with dates and user information

### Relevant Files
- `backend/src/modules/deal/domain/Deal.ts`
- `backend/src/modules/deal/application/DealUseCases.ts`
- `backend/src/modules/deal/infrastructure/DealEntity.ts`
- `frontend/src/pages/DealDetailPage.tsx` (skeleton provided)

## Acceptance Criteria
- [ ] Every stage change is recorded with timestamp and user information
- [ ] Deal detail view shows complete stage history in chronological order
- [ ] Users can see how long each deal has been in its current stage
- [ ] Timeline visualization clearly shows the progression of deals
- [ ] System maintains full history even when deals move back to previous stages

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Stage duration analytics (average time spent in each stage across all deals)
- Comparative reporting across team members
- Filter timeline by date range
