# Challenge 10: Email Notification System (10 points - Low)

**Estimated Time:** 1.5-2 hours
**Technical Difficulty:** Medium

## User Story
**As a** CRM user,
**I want** to receive timely email notifications about important events and updates,
**So that** I can stay informed about critical changes even when I'm not actively using the system.

## Business Value
Automated notifications drive engagement and ensure timely responses:
- Prevents important updates from being missed
- Reduces response time to critical events (e.g., new leads, deal status changes)
- Keeps team members aligned without constant manual communication
- Improves customer service by enabling prompt follow-ups

## Current Implementation Issues
The current system lacks notification capabilities:
- No way to alert users about important events
- Missing email integration for external communications
- No customization options for notification preferences
- Absence of templating system for consistent messaging

You will need an SMTP server. For testing, you can use services like Mailtrap (free tier) or Ethereal Email.

## Core Requirements
*(Required for full points)*

1. Implement email notification service
   - Create a notification service with email delivery capabilities (nodemailer or similar)
   - Send email notifications for at least 2 key events (e.g., deal stage change, new contact assigned)
   - Configure SMTP settings via environment variables

2. Add basic notification preferences
   - Allow users to opt in/out of specific notification types
   - Create a simple notification preferences UI

### Relevant Files
- `backend/src/modules/deal/application/DealUseCases.ts`
- `backend/src/app.ts`

## Acceptance Criteria
- [ ] System sends email notifications for at least 2 key events
- [ ] Users can customize their notification preferences
- [ ] Notification delivery is reliable with proper error handling
- [ ] Users can opt out of specific notification types

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Responsive HTML email templates with dynamic content
- Digest emails (daily/weekly summary instead of individual emails)
- In-app notifications in addition to email
