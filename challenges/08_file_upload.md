# Challenge 8: File Upload System (10 points - Low)

**Estimated Time:** 1.5-2 hours
**Technical Difficulty:** Medium

## User Story
**As a** sales representative,
**I want** to attach files to contacts and deals,
**So that** I can keep all relevant documents organized and accessible within the CRM.

## Business Value
Document management within the CRM provides significant benefits:
- Centralizes all customer-related documentation
- Eliminates the need for separate file storage systems
- Improves collaboration by sharing documents within the team
- Creates a complete record of customer interactions and agreements

## Current Implementation Issues
The current system lacks file management capabilities:
- No way to attach files to contacts or deals
- Missing secure storage for sensitive documents
- No preview capabilities for common file types
- Absence of file organization and categorization

## Core Requirements
*(Required for full points)*

1. Implement file upload functionality
   - Create file upload endpoints for contacts and deals (using multer or similar)
   - Support multiple file uploads
   - Add file type validation and size limits

2. Implement file listing and download
   - List uploaded files for a given contact or deal
   - Add download endpoints for retrieving files

### Relevant Files
- `backend/src/modules/contact/http/ContactController.ts`
- `backend/src/modules/deal/http/DealController.ts`

## Acceptance Criteria
- [ ] Users can upload files to contacts and deals with proper validation
- [ ] Files can be listed and downloaded
- [ ] System enforces file size limits and acceptable file types
- [ ] Interface provides clear feedback during upload process

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- In-app previews for common file types (PDF, images)
- File version history for updated documents
- Encryption for confidential files
- Bulk upload/download/delete operations
- Thumbnail generation for image files
