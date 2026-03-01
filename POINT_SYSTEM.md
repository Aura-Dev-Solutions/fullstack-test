# Challenge Point System

## Overview

This document outlines the point system for the technical test challenges. Candidates must earn a minimum number of points to successfully complete the test. Points are allocated based on the business criticality and complexity of each challenge.

## Point Allocation

| Challenge | Priority | Points | Description |
|-----------|----------|--------|-------------|
| 1. Secure Authentication System | Critical | 20 | Implementing refresh tokens and persistent sessions |
| 2. Data Validation & Error Handling | High | 20 | Ensuring data integrity across the application |
| 3. Pagination and Advanced Filtering | Critical | 25 | Managing large datasets efficiently |
| 4. Deal Stage History Tracking | Medium | 15 | Tracking the complete lifecycle of deals |
| 5. User Role Management | High | 20 | Implementing role-based access control |
| 6. Dashboard Analytics | Medium | 15 | Creating visualization for key sales metrics |
| 7. Contact Search and Filtering | Low | 10 | Finding contacts quickly and efficiently |
| 8. File Upload System | Low | 10 | Attaching documents to contacts and deals |
| 9. Activity Logging System | Low | 10 | Tracking all user interactions |
| 10. Email Notification System | Low | 10 | Keeping users informed about important events |

**Total Available Points: 155**

## Minimum Requirements

To successfully complete the technical test, candidates must:

1. **Earn a minimum of 70 points** by implementing any combination of challenges
2. **Complete at least one Critical priority challenge** (Challenge 1 or Challenge 3)
3. **Complete at least one High priority challenge** (Challenge 2 or Challenge 5)

## Challenge Dependencies

Some challenges share infrastructure or modify the same files. Keep these relationships in mind when planning your implementation:

- **Challenge 1 & Challenge 5** both modify the auth middleware and JWT token structure. If implementing both, design Challenge 1 with role extensibility in mind (e.g., include a `role` field in the JWT payload from the start).
- **Challenge 3 & Challenge 7** have overlapping functionality. If you implement Challenge 3 (Pagination & Filtering), you already have approximately 70% of the backend infrastructure needed for Challenge 7 (Contact Search).
- **Challenge 4 & Challenge 6** share queries over deals data. Implementing one can simplify the other.

## Bonus Points

Candidates can earn bonus points for:

| Bonus Category | Points | Description |
|----------------|--------|-------------|
| Code Quality | 1-5 | Clean, maintainable code with proper comments |
| Test Coverage | 1-5 | Comprehensive test coverage for implementations |
| Documentation | 1-5 | Clear explanation of design decisions and approach |
| UI/UX | 1-5 | Intuitive and responsive user interfaces |

## Evaluation Strategy

We recommend candidates approach the challenges in this order:

1. Start with a Critical priority challenge (20-25 points)
2. Choose at least one High priority challenge (20 points each)
3. Select Medium or Low priority challenges based on your strengths and interests to reach the minimum 70 points
4. Focus on quality over quantity - a well-implemented challenge earns full points

## Submission Evaluation

Your submission will be evaluated based on:

1. Total points earned from implemented challenges
2. Quality of implementation for each challenge
3. Adherence to the existing architecture and code patterns
4. Bonus points earned for exceptional quality

Remember that the goal is to demonstrate your skills and approach to problem-solving, not necessarily to complete all challenges.
