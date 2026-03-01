# Aura Research Full Stack Technical Test

## Overview

This repository contains a full stack technical assessment for candidates applying to Aura Research. The core of this assessment is a series of **business-critical challenges** that you must solve within a CRM (Customer Relationship Management) application. Your primary goal is to complete these challenges to demonstrate your technical abilities and problem-solving approach.

## Purpose

The purpose of this technical test is to evaluate your skills in:

1. **Full Stack Development**: Working with both frontend and backend technologies
2. **Clean Architecture**: Implementing domain-driven design principles
3. **TypeScript**: Using strong typing across the entire stack
4. **Testing**: Writing and running tests for both frontend and backend
5. **Database Design**: Working with relational databases and ORM tools

## The Challenge-Based Assessment

**The challenges are the heart of this technical test.** Each challenge represents a real-world business need that must be addressed in the CRM application. Your primary task is to complete enough challenges to meet the minimum point requirement.

As a candidate, you are expected to:

1. **Complete Business-Critical Challenges**: Implement solutions for the challenges in the [`/challenges`](./challenges/) directory
2. **Understand the Existing Codebase**: Navigate and comprehend the architecture and patterns used
3. **Implement New Features**: Add functionality to both frontend and backend components
4. **Debug Real Issues**: Some challenges require finding and fixing existing bugs — read the code critically
5. **Make Design Decisions**: Some challenges are intentionally open-ended. Document your decisions and tradeoffs
6. **Write Tests**: Ensure proper test coverage for your implementations
7. **Document Your Work**: Provide clear documentation of your approach and decisions

## Challenge Point System

This technical test uses a fixed-scope structure:

- **Challenges [1](./challenges/01_code_audit.md)–[4](./challenges/04_data_validation.md) are mandatory.** Every candidate completes the same four challenges (70 points total).
- **Challenges [5](./challenges/05_pagination_and_filtering.md)–[10](./challenges/10_file_upload.md) are optional.** Complete any of them to demonstrate additional depth and differentiate yourself.
- Quality of implementation matters more than completing optional challenges.

### Why these four challenges

Each mandatory challenge tests a distinct, non-overlapping skill:

- **[Challenge 1](./challenges/01_code_audit.md) — Code Audit:** Can you read an unfamiliar codebase and identify root causes rather than symptoms?
- **[Challenge 2](./challenges/02_feature_design.md) — Feature Design:** How do you reason about design tradeoffs? We evaluate your PR description as much as your code.
- **[Challenge 3](./challenges/03_secure_authentication.md) — Secure Auth:** Can you build a critical, security-sensitive backend feature fullstack?
- **[Challenge 4](./challenges/04_data_validation.md) — Data Validation:** Do you enforce data integrity consistently across backend and frontend?

**The challenges are ordered intentionally.** Follow the sequence: read first ([Challenge 1](./challenges/01_code_audit.md)), design second ([Challenge 2](./challenges/02_feature_design.md)), then implement ([Challenges 3](./challenges/03_secure_authentication.md) and [4](./challenges/04_data_validation.md)). See [`POINT_SYSTEM.md`](./POINT_SYSTEM.md) for details.

Detailed information about the point system can be found in [`POINT_SYSTEM.md`](./POINT_SYSTEM.md), and each challenge file includes its point value in the title.

## Technical Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- TailwindCSS for styling
- Vite as the build tool
- Vitest for testing

### Backend
- Node.js with TypeScript
- Express for the web server
- TypeORM for database interactions
- PostgreSQL as the database
- JWT for authentication
- Clean Architecture principles

## Evaluation Criteria

Your submission will be evaluated primarily on **successful challenge completion** and the points earned. Additionally, we will assess:

1. **Challenge Implementation**: How effectively you solved the business problems presented in the challenges
2. **Code Quality**: Clean, maintainable, and well-structured code that follows best practices
3. **Architecture**: Proper separation of concerns and adherence to clean architecture principles
4. **Testing**: Comprehensive test coverage for your implementations
5. **Documentation**: Clear explanation of your approach, decisions, and trade-offs
6. **Dependencies**: You may install additional dependencies (e.g., validation libraries, chart libraries). Justify your choices in the PR description.

## Getting Started & Submission Process

1. Fork this repository to your GitHub account
2. Set up the project following instructions in [`README.md`](./README.md)
3. Review the challenges in [`/challenges`](./challenges/) and their point values in [`POINT_SYSTEM.md`](./POINT_SYSTEM.md)
4. Complete all 4 mandatory challenges:
   - [Challenge 1](./challenges/01_code_audit.md) — Code Audit & Bug Fixes (15 pts)
   - [Challenge 2](./challenges/02_feature_design.md) — Feature Design & Implementation (15 pts)
   - [Challenge 3](./challenges/03_secure_authentication.md) — Secure Authentication System (20 pts)
   - [Challenge 4](./challenges/04_data_validation.md) — Data Validation & Error Handling (20 pts)
   - Optionally, complete any of [Challenges 5–10](./challenges/) to differentiate yourself
5. Create a single Pull Request against the main branch with your implementations
6. In your PR description, include:
   - List of completed challenges with their point values
   - Total points earned
   - Brief explanation of your approach and key decisions
7. Provide access to your repository to the Aura Research team

## Time Allocation

You are expected to spend approximately 8-10 hours on this test. We value quality over quantity, so focus on delivering well-structured and tested code rather than implementing all features if time is limited.

## Support

If you have any questions or need clarification about the test, please reach out to the Aura Research team at mpat@aura.

Good luck, and we look forward to reviewing your submission!
