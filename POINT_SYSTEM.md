# Challenge Point System

## Overview

This document outlines the point system for the technical test challenges. Candidates must earn a minimum number of points to successfully complete the test. Points are allocated based on the business criticality and type of skill evaluated.

## Point Allocation

| # | Challenge | Priority | Points | What It Evaluates |
|---|-----------|----------|--------|-------------------|
| 1 | [Code Audit & Bug Fixes](./challenges/01_code_audit.md) | High | 15 | Code reading, debugging, root cause analysis |
| 2 | [Feature Design & Implementation](./challenges/02_feature_design.md) | High | 15 | Design thinking, tradeoffs, documentation |
| 3 | [Secure Authentication System](./challenges/03_secure_authentication.md) | Critical | 20 | Fullstack integration, security fundamentals |
| 4 | [Data Validation & Error Handling](./challenges/04_data_validation.md) | High | 20 | Data integrity, UX, cross-layer consistency |
| 5 | [Pagination and Advanced Filtering](./challenges/05_pagination_and_filtering.md) | Critical | 25 | DB querying, API design, frontend state |
| 6 | [User Role Management](./challenges/06_user_role_management.md) | High | 20 | Backend architecture, middleware, access control |
| 7 | [Deal Stage History Tracking](./challenges/07_deal_stage_history.md) | Medium | 15 | Schema design, audit patterns, timeline UI |
| 8 | [Dashboard Analytics](./challenges/08_dashboard_analytics.md) | Medium | 15 | Frontend depth, data visualization |
| 9 | [Activity Logging System](./challenges/09_activity_logging.md) | Low | 10 | Domain modeling, data association |
| 10 | [File Upload System](./challenges/10_file_upload.md) | Low | 10 | Infrastructure, file handling, validation |

**Total Available Points: 160**

## Minimum Requirements

To successfully complete the technical test, candidates must:

1. **Earn a minimum of 70 points** by implementing any combination of challenges
2. **Complete at least one Critical priority challenge** ([Challenge 3](./challenges/03_secure_authentication.md) or [Challenge 5](./challenges/05_pagination_and_filtering.md))
3. **Complete at least one High priority challenge** ([1](./challenges/01_code_audit.md), [2](./challenges/02_feature_design.md), [4](./challenges/04_data_validation.md), or [6](./challenges/06_user_role_management.md))

## Recommended Approach for Candidates

The challenges are ordered intentionally. This sequence is recommended:

### Step 1 — Read before you code ([Challenge 1](./challenges/01_code_audit.md))
Start with the Code Audit. This forces you to read the entire codebase critically before touching anything. Strong candidates always understand the system before extending it. This challenge also reveals how you communicate technical findings.

### Step 2 — Design before you implement ([Challenge 2](./challenges/02_feature_design.md))
The Feature Design challenge has an intentionally brief requirement. Read it, think through the tradeoffs, and document your decisions. We evaluate the reasoning in your PR as much as the code itself.

### Step 3 — Build the core (Challenges [3](./challenges/03_secure_authentication.md)–[6](./challenges/06_user_role_management.md))
These are the fullstack fundamentals. Choose based on your strengths to reach 70 points:

- **Backend-leaning**: [Challenge 3](./challenges/03_secure_authentication.md) (Auth) + [Challenge 6](./challenges/06_user_role_management.md) (Roles) = 40pts from backend depth
- **Frontend-leaning**: [Challenge 4](./challenges/04_data_validation.md) (Validation) + [Challenge 8](./challenges/08_dashboard_analytics.md) (Dashboard) = 35pts, UI-heavy
- **Balanced**: [Challenge 3](./challenges/03_secure_authentication.md) (Auth) + [Challenge 4](./challenges/04_data_validation.md) (Validation) = 40pts across both layers
- **Query depth**: [Challenge 5](./challenges/05_pagination_and_filtering.md) (Pagination) alone = 25pts and requires real TypeORM knowledge

### Step 4 — Reach 70 points your way
After the mandatory challenges, pick what best showcases your strengths. There is no wrong path — the choices you make tell us as much as the implementation.

## Challenge Dependencies

Keep these relationships in mind when planning your implementation:

- **[Challenge 3](./challenges/03_secure_authentication.md) & [Challenge 6](./challenges/06_user_role_management.md)** both modify the auth middleware and JWT token structure. If implementing both, design Challenge 3 with a `role` field in the JWT payload from the start.
- **[Challenge 7](./challenges/07_deal_stage_history.md)** (Deal Stage History) has a frontend skeleton already provided in `DealDetailPage.tsx`.
- **[Challenge 7](./challenges/07_deal_stage_history.md) & [Challenge 8](./challenges/08_dashboard_analytics.md)** (Dashboard) share deal data queries. Implementing one simplifies the other.
- **[Challenge 2](./challenges/02_feature_design.md)** (Feature Design) integrates naturally with [Challenge 6](./challenges/06_user_role_management.md) (Roles) — consider how deal assignment interacts with user permissions.

## Bonus Points

Candidates can earn bonus points for:

| Bonus Category | Points | Description |
|----------------|--------|-------------|
| Code Quality | 1-5 | Clean, maintainable code that follows existing patterns |
| Test Coverage | 1-5 | Meaningful tests, not just coverage for its own sake |
| Documentation | 1-5 | Clear explanation of design decisions and tradeoffs in the PR |
| UI/UX | 1-5 | Intuitive, consistent interfaces that match the existing design system |

## Evaluation Criteria (for reviewers)

Beyond points, submissions are evaluated on:

1. **Code reading**: Does Challenge 1 show they understood the root causes, not just the symptoms?
2. **Design thinking**: Does Challenge 2's PR description reveal real tradeoffs considered?
3. **Architecture adherence**: Do their implementations follow the existing clean architecture layers?
4. **Cross-layer consistency**: Do their backend and frontend implementations match in behavior and types?
5. **Test quality**: Are tests meaningful or just written to check a box?
