# Challenge 2: Robust Data Validation & Error Handling (20 points - High)

**Estimated Time:** 2-3 hours
**Technical Difficulty:** Medium

## User Story
**As a** sales representative using the CRM,
**I want** consistent and clear feedback when I enter invalid data,
**So that** I can quickly correct my inputs and maintain accurate customer records.

## Business Value
Proper validation and error handling directly impacts:
- Data quality and integrity across the CRM
- User confidence in the system
- Reduction in support tickets related to confusing errors
- Prevention of data corruption that could affect business decisions

## Current Implementation Issues
The current API endpoints lack comprehensive input validation:
- Inconsistent validation across different controllers
- Generic error messages that don't help users fix their input
- No structured approach to validation and error handling
- Potential for invalid data to corrupt business records

## Core Requirements
*(Required for full points)*

1. Implement comprehensive validation
   - Add a validation layer using a library like Zod or class-validator
   - Create validation schemas for DTOs in auth, contacts, and deals endpoints
   - Ensure consistent validation across these endpoints

2. Enhance error handling
   - Create a centralized error handling middleware
   - Implement proper HTTP status codes for different error types
   - Return descriptive error messages that guide users to fix issues

3. Improve frontend error presentation
   - Display field-specific error messages next to form inputs
   - Implement toast notifications for system-level errors

### Relevant Files
- `backend/src/modules/auth/http/AuthController.ts`
- `backend/src/modules/contact/http/ContactController.ts`
- `backend/src/modules/deal/http/DealController.ts`
- `frontend/src/pages/ContactsPage.tsx`
- `frontend/src/pages/DealsPage.tsx`

## Acceptance Criteria
- [ ] All API endpoints validate input data before processing
- [ ] Validation errors return appropriate HTTP status codes (400 for invalid input)
- [ ] Error messages are specific and actionable (e.g., "Name must be between 2-50 characters" instead of "Invalid input")
- [ ] Frontend forms display field-specific validation errors
- [ ] System prevents creation or update of records with invalid data
- [ ] Validation rules are consistent between frontend and backend

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Real-time validation feedback as the user types
- Validation logging to track common validation issues for UI/UX improvement
- Extend validation to all remaining endpoints beyond auth, contacts, and deals
