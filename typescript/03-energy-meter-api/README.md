# Exercise: Energy Meter Data Processing System - Legacy Codebase Refactoring

## Overview
**Duration**: 90 minutes  
**Difficulty**: Advanced  
**Domain**: Energy Data Management, Legacy System Modernization

## Learning Objectives
- Understand and navigate a legacy codebase with mixed JavaScript/TypeScript patterns.
- Identify and fix functional bugs (e.g., calculation errors, logic flaws).
- Discover and remediate security vulnerabilities (e.g., SQL injection, path traversal, hardcoded credentials).
- Refactor monolithic functions and improve code quality.
- Migrate existing JavaScript patterns to modern, type-safe TypeScript.
- Learn to provide clear context and effective prompts for AI-assisted development in legacy environments.

## Business Context
Utility companies often deal with legacy systems for processing critical data, such as energy meter readings. These systems, built over time, can accumulate technical debt, functional bugs, and security vulnerabilities. This exercise simulates working with such a system, challenging you to modernize and secure it.

## Setup Instructions
1.  **Clone the repository**: If you haven't already, clone the `copilot-exercises` repository.
2.  **Navigate to the exercise directory**: `cd C:/repos/copilot-exercises/typescript/energy-meter-api`
3.  **Install dependencies**: `npm install` (or `yarn install`)
4.  **Compile TypeScript**: `npx tsc` (or `yarn tsc`)

## Task Structure
This exercise is divided into several phases, each focusing on a different aspect of modernizing the legacy energy meter API.

### Phase 1: Code Comprehension (10 minutes)
**Objective**: Understand the existing codebase and identify initial areas of concern.
**Copilot Focus**: Generating explanations for complex functions, summarizing code sections, and identifying potential issues based on comments.

### Phase 2: Bug Hunt (15 minutes)
**Objective**: Systematically find and document functional bugs within the application.
**Copilot Focus**: Assisting in tracing data flow, identifying logical errors, and suggesting test cases to expose bugs.

### Phase 3: Security Audit (15 minutes)
**Objective**: Identify and document security vulnerabilities present in the legacy code.
**Copilot Focus**: Highlighting common security anti-patterns, suggesting potential attack vectors, and explaining vulnerability types.

### Phase 4: Bug Fixes (15 minutes)
**Objective**: Implement fixes for the identified functional bugs.
**Copilot Focus**: Suggesting idiomatic and correct code to resolve logical errors, calculation issues, and edge cases.

### Phase 5: Security Fixes (15 minutes)
**Objective**: Remediate the discovered security vulnerabilities.
**Copilot Focus**: Providing secure coding practices, suggesting input validation, parameterized queries, and secure configuration patterns.

### Phase 6: Refactoring & TypeScript Conversion (20 minutes)
**Objective**: Improve code quality, break down monolithic functions, and convert the codebase to proper TypeScript.
**Copilot Focus**: Suggesting appropriate type definitions, refactoring large functions into smaller, more manageable units, and converting `require` statements to `import`.

## Getting Started
- Open the `energy-meter-api` directory in your IDE.
- Follow the instructions within each phase, using GitHub Copilot to assist you.
- Provide clear and concise comments to guide Copilot.

## Copilot Best Practices for Legacy Code Modernization
- Use comments to describe the *intended* behavior of legacy code, then ask Copilot to help refactor towards it.
- When debugging, provide error messages and relevant code snippets to Copilot for analysis.
- Clearly state the desired outcome when fixing bugs or security issues (e.g., "Fix SQL injection vulnerability by using parameterized queries").
- For TypeScript conversion, explicitly ask Copilot to infer types or suggest interfaces/types based on data structures.
- Break down complex refactoring tasks into smaller, manageable steps for Copilot.

## Success Criteria
By the end of this exercise, you should have:
- ✅ A clear understanding of the legacy codebase's structure and issues.
- ✅ Identified and documented a range of functional bugs.
- ✅ Identified and documented various security vulnerabilities.
- ✅ Implemented effective fixes for both functional bugs and security flaws.
- ✅ Refactored key parts of the application, improving readability and maintainability.
- ✅ Converted significant portions of the codebase to type-safe TypeScript.
- ✅ Gained practical experience using Copilot for code comprehension, debugging, security analysis, and refactoring in a legacy context.

## Troubleshooting
- If Copilot is not suggesting code, ensure your comments are clear and specific.
- Check for syntax errors in your existing code, as this can sometimes prevent Copilot from providing suggestions.
- If you're stuck, refer to the `copilot_guidance` directory (if available in the main repository) for examples and tips.

## Resources
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)