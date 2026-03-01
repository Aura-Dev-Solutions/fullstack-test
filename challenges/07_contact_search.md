# Challenge 7: Advanced Contact Search and Filtering (10 points - Low)

**Estimated Time:** 1-1.5 hours
**Technical Difficulty:** Easy

**Note:** If you completed Challenge 3 (Pagination & Filtering), you already have most of the backend infrastructure for this challenge.

## User Story
**As a** sales representative managing hundreds of contacts,
**I want** powerful search and filtering capabilities for my contact database,
**So that** I can quickly find the right contacts for targeted outreach and relationship management.

## Business Value
Efficient contact management directly impacts sales effectiveness:
- Reduces time spent searching for contact information
- Enables targeted marketing and sales campaigns
- Improves customer relationship management
- Increases sales team productivity and response times

## Current Implementation Issues
The current contact management system has limitations:
- Basic filtering without advanced search capabilities
- No way to search across multiple fields simultaneously
- Missing autocomplete functionality for quick lookups
- Limited options for organizing and categorizing contacts

## Core Requirements
*(Required for full points)*

1. Implement search functionality
   - Create a search endpoint that supports text search across contact fields (name, email, company)
   - Enable searching across multiple fields simultaneously

2. Create a search interface
   - Implement a search input on the contacts page with results display
   - Provide clear visual indicators for active search terms

### Relevant Files
- `backend/src/modules/contact/domain/ContactRepository.ts`
- `backend/src/modules/contact/infrastructure/PostgresContactRepository.ts`
- `frontend/src/pages/ContactsPage.tsx`

## Acceptance Criteria
- [ ] Users can search contacts using partial text matches across multiple fields
- [ ] Search and filter operations complete in under 1 second
- [ ] Interface clearly shows active search terms and filters

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Autocomplete suggestions while typing
- Search history for quick access to previous queries
- Saved searches for reuse
- Highlighting of matched terms in search results
