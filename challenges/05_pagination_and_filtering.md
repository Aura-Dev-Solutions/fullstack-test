# Challenge 5: Pagination and Advanced Filtering (25 points - Critical)

**Estimated Time:** 2-3 hours
**Technical Difficulty:** Hard

## User Story
**As a** sales manager with hundreds of contacts and deals,
**I want** efficient ways to navigate, sort, and filter large datasets,
**So that** I can quickly find relevant information and make timely business decisions.

## Business Value
As the CRM database grows, efficient data access becomes critical:
- Improved system performance by limiting data transfer
- Enhanced user productivity when working with large datasets
- Better decision-making through targeted data filtering
- Reduced frustration when searching for specific records

## Current Implementation Issues
The current repository implementations have limitations:
- All records are fetched without pagination, causing performance issues
- Limited filtering capabilities make finding specific records difficult
- No sorting options for organizing data in meaningful ways
- Frontend components aren't optimized for large datasets

## Core Requirements
*(Required for full points)*

1. Implement backend pagination
   - Add pagination parameters (page, limit) to contacts and deals list endpoints
   - Create a consistent `PaginatedResult` response format with metadata (total count, total pages, current page)
   - Optimize database queries for paginated results

2. Add filtering capabilities
   - Implement filtering by multiple fields
   - Support different filter operators (equals, contains, greater than, etc.)

3. Add sorting functionality
   - Enable sorting by any field
   - Support ascending and descending order

4. Update frontend components
   - Create paginated table components with page controls
   - Implement filter UI with intuitive controls
   - Add sort indicators and controls
   - Show loading states during data fetching

### Relevant Files
- `backend/src/modules/contact/domain/ContactRepository.ts`
- `backend/src/modules/contact/infrastructure/PostgresContactRepository.ts`
- `backend/src/modules/contact/http/ContactController.ts`
- `backend/src/shared/domain/Pagination.ts`
- `frontend/src/services/contact.service.ts`
- `frontend/src/pages/ContactsPage.tsx`

## Acceptance Criteria
- [ ] All list endpoints support pagination parameters (page, limit)
- [ ] Response includes pagination metadata (total count, pages, etc.)
- [ ] Users can filter data by any relevant field
- [ ] Data tables show appropriate loading states during pagination
- [ ] System performance remains responsive even with large datasets
- [ ] Frontend UI clearly indicates active filters and sort order

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Saved filter configurations for reuse
- Multi-field sorting (sort by multiple columns simultaneously)
- Complex AND/OR filter logic for advanced queries
