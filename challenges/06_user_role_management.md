# Challenge 6: User Role Management (20 points - High)

**Estimated Time:** 2-3 hours
**Technical Difficulty:** Hard

## User Story
**As an** organization administrator,
**I want** to assign different roles and permissions to team members,
**So that** I can control access to sensitive customer and deal information based on job responsibilities.

## Business Value
Role-based access control is essential for growing sales teams:
- Protects sensitive customer and financial information
- Ensures compliance with data protection regulations
- Allows delegation of administrative tasks without full system access
- Enables proper workflow based on organizational hierarchy

## Current Implementation Issues
The current system doesn't differentiate between user roles:
- All users have the same level of access within an organization
- No way to restrict sensitive deal information to specific team members
- Cannot delegate administrative tasks without granting full access
- No audit trail of permission-based activities

## Core Requirements
*(Required for full points)*

1. Implement role-based access control
   - Add a `role` field to the User domain model and UserEntity (values: `admin`, `member`)
   - Include the `role` field in the JWT token payload and `AuthenticatedRequest`
   - Create an authorization middleware that checks role requirements per route

2. Update authentication middleware
   - Enhance middleware to check for required role
   - Implement proper error responses for unauthorized actions (403 Forbidden)
   - Add role information to the authentication token

3. Implement UI role awareness
   - Conditionally render UI elements based on user role (e.g., hide admin actions from members)
   - Provide clear feedback when access is denied

**Note:** If implementing both Challenge 1 and Challenge 5, design Challenge 1 with role extensibility in mind (add a `role` field to the JWT payload from the start).

### Relevant Files
- `backend/src/modules/users/domain/User.ts`
- `backend/src/modules/users/infrastructure/UserEntity.ts`
- `backend/src/shared/http/authMiddleware.ts`
- `backend/src/shared/http/AuthenticatedRequest.ts`
- `backend/src/modules/auth/domain/TokenGenerator.ts`

## Acceptance Criteria
- [ ] System supports `admin` and `member` roles with different permission levels
- [ ] Administrators can assign roles to team members
- [ ] API endpoints enforce role requirements
- [ ] UI elements are conditionally displayed based on user role
- [ ] Users receive clear feedback when attempting unauthorized actions
- [ ] Permission changes take effect immediately without requiring re-login

## Stretch Goals
*(Optional - demonstrates exceptional skill)*

- Custom roles beyond admin/member with configurable permissions
- Granular permissions per resource (e.g., read-only access to deals but full access to contacts)
- Audit logs of permission changes
