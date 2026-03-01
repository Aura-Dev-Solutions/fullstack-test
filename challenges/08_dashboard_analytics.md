# Challenge 8: Dashboard Analytics (15 points - Medium)

**Estimated Time:** 1.5-2 hours
**Technical Difficulty:** Medium

## User Story
**As a** sales director,
**I want** a comprehensive analytics dashboard with key sales metrics and visualizations,
**So that** I can monitor team performance, track progress toward goals, and make data-driven decisions.

## Business Value
Analytics dashboards provide critical business intelligence:
- Enables real-time monitoring of sales performance
- Helps identify trends and opportunities early
- Supports data-driven decision making
- Motivates sales teams through transparent performance tracking

## Current Implementation Issues
The dashboard page exists but lacks actual analytics:
- No visualization of key sales metrics
- Missing pipeline value calculations
- No forecasting capabilities
- Limited filtering options for data analysis

## Core Requirements
*(Required for full points)*

1. Implement key sales metrics
   - Calculate total pipeline value by stage
   - Track deals by status (won, lost, open)
   - Measure win rate

2. Create visualization components
   - Install a chart library (recharts recommended, chart.js or similar also accepted)
   - Implement at least 3 chart/visualization components for the metrics above
   - Design intuitive data cards for key metrics

You can install chart libraries such as recharts, chart.js, or similar. Justify your choice in the PR.

### Relevant Files
- `frontend/src/pages/DashboardPage.tsx`
- `backend/src/modules/deal/http/DealController.ts`
- `backend/src/modules/deal/application/DealUseCases.ts`

## Acceptance Criteria
- [ ] Dashboard displays at least 3 key sales metrics with visualizations
- [ ] Pipeline value is accurately calculated and visualized by stage
- [ ] Visualizations are responsive across different screen sizes
- [ ] Dashboard loads efficiently without performance issues

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Auto-refresh dashboard data at configurable intervals
- Date range filters for all metrics
- Performance comparison across team members
- Export dashboard data (CSV, PDF)
