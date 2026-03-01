# Challenge Point System

## Overview

This document outlines the point system for the technical test challenges. Candidates must earn a minimum number of points to successfully complete the test. Points are allocated based on the business criticality and type of skill evaluated.

## Point Allocation

| # | Challenge | Priority | Points | What It Evaluates |
|---|-----------|----------|--------|-------------------|
| 1 | Code Audit & Bug Fixes | High | 15 | Code reading, debugging, root cause analysis |
| 2 | Feature Design & Implementation | High | 15 | Design thinking, tradeoffs, documentation |
| 3 | Secure Authentication System | Critical | 20 | Fullstack integration, security fundamentals |
| 4 | Data Validation & Error Handling | High | 20 | Data integrity, UX, cross-layer consistency |
| 5 | Pagination and Advanced Filtering | Critical | 25 | DB querying, API design, frontend state |
| 6 | User Role Management | High | 20 | Backend architecture, middleware, access control |
| 7 | Deal Stage History Tracking | Medium | 15 | Schema design, audit patterns, timeline UI |
| 8 | Dashboard Analytics | Medium | 15 | Frontend depth, data visualization |
| 9 | Activity Logging System | Low | 10 | Domain modeling, data association |
| 10 | File Upload System | Low | 10 | Infrastructure, file handling, validation |

**Total Available Points: 160**

## Minimum Requirements

To successfully complete the technical test, candidates must:

1. **Earn a minimum of 70 points** by implementing any combination of challenges
2. **Complete at least one Critical priority challenge** (Challenge 3 or Challenge 5)
3. **Complete at least one High priority challenge** (Challenge 1, 2, 4, or 6)

## Recommended Approach for Candidates

The challenges are ordered intentionally. This sequence is recommended:

### Step 1 — Read before you code (Challenge 1)
Start with the Code Audit. This forces you to read the entire codebase critically before touching anything. Strong candidates always understand the system before extending it. This challenge also reveals how you communicate technical findings.

### Step 2 — Design before you implement (Challenge 2)
The Feature Design challenge has an intentionally brief requirement. Read it, think through the tradeoffs, and document your decisions. We evaluate the reasoning in your PR as much as the code itself.

### Step 3 — Build the core (Challenges 3–6)
These are the fullstack fundamentals. Choose based on your strengths to reach 70 points:

- **Backend-leaning**: Challenge 3 (Auth) + Challenge 6 (Roles) = 40pts from backend depth
- **Frontend-leaning**: Challenge 4 (Validation) + Challenge 8 (Dashboard) = 35pts, UI-heavy
- **Balanced**: Challenge 3 (Auth) + Challenge 4 (Validation) = 40pts across both layers
- **Query depth**: Challenge 5 (Pagination) alone = 25pts and requires real TypeORM knowledge

### Step 4 — Reach 70 points your way
After the mandatory challenges, pick what best showcases your strengths. There is no wrong path — the choices you make tell us as much as the implementation.

## Challenge Dependencies

Keep these relationships in mind when planning your implementation:

- **Challenge 3 & Challenge 6** both modify the auth middleware and JWT token structure. If implementing both, design Challenge 3 with a `role` field in the JWT payload from the start.
- **Challenge 7** (Deal Stage History) has a frontend skeleton already provided in `DealDetailPage.tsx`.
- **Challenge 7 & Challenge 8** (Dashboard) share deal data queries. Implementing one simplifies the other.
- **Challenge 2** (Feature Design) integrates naturally with Challenge 6 (Roles) — consider how deal assignment interacts with user permissions.

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
