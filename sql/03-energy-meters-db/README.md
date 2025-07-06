# Legacy SQL Database Enhancement Exercise

## Overview
This exercise focuses on using GitHub Copilot to analyze, debug, secure, and refactor a legacy SQL database for an energy meter data processing system. You will learn to effectively collaborate with AI to understand unfamiliar code, identify and fix complex issues, and modernize an existing system.

**Duration**: 90-105 minutes
**Difficulty**: Advanced
**Focus**: Legacy Code Refactoring, Bug Fixing, and Security Hardening with GitHub Copilot

## Learning Objectives
-   Use Copilot to understand unfamiliar legacy SQL schemas, stored procedures, and functions.
-   Generate comprehensive documentation for undocumented database objects.
-   Find and resolve functional bugs, logic errors, and calculation inaccuracies.
-   Find and resolve common SQL security vulnerabilities like SQL Injection.
-   Add SQL-based test queries to validate legacy code behavior and fixes.
-   Modernize SQL code patterns and database objects while preserving functionality.

## Business Context
You are tasked with improving a legacy database system for an energy utility company. This system, which processes smart meter data, has become unstable and insecure over time. Your goal is to use GitHub Copilot to identify and resolve its many issues, from functional bugs to critical security flaws.

## Setup Instructions

1.  **Database**: Ensure you have a MySQL-compatible database environment set up (e.g., MySQL Server, Docker container with MySQL).
2.  **Schema & Data Loading**:
    *   Execute the scripts in the `schema/` directory in order to create and populate the database. *Note: These files contain intentional bugs and bad practices for the purpose of the exercise.*

    ```bash
    # Example for MySQL CLI (adjust for your environment)
    mysql -u your_user -p your_database < schema/01_create_tables.sql
    mysql -u your_user -p your_database < schema/02_create_indexes.sql
    mysql -u your_user -p your_database < schema/03_initial_data.sql
    ```

## Task Structure
This exercise is divided into several phases, guiding you from understanding the code to fixing it. Refer to the `INSTRUCTOR_GUIDE.md` and `03_sql_blueprint.md` for details on the planted issues.

*   **Phase 1: Code Comprehension** (10-15 min)
*   **Phase 2: Bug Hunt & Analysis** (20-25 min)
*   **Phase 3: Security Audit & Documentation** (15-20 min)
*   **Phase 4: Bug Fixes & Testing** (20-25 min)
*   **Phase 5: Security Fixes & Hardening** (15-20 min)
*   **Phase 6: Refactoring & Enhancement** (10-15 min)

## Getting Started
Open the files within the various subdirectories (`schema/`, `stored_procedures/`, `views/`, etc.). Your task is to use GitHub Copilot to identify and fix the numerous issues planted throughout the database objects.

## Copilot Best Practices for This Exercise
-   **Ask for Explanations**: Use prompts like "Explain this stored procedure" or "Document this view" to build understanding.
-   **Targeted Analysis**: Use specific prompts like "Review this code for security vulnerabilities" or "Check this function for calculation errors."
-   **Iterative Refinement**: Don't accept the first suggestion. Refine your prompts to guide Copilot toward the optimal solution.
-   **Suggest Fixes**: After identifying an issue, ask Copilot directly: "Fix the SQL injection vulnerability in this code" or "Rewrite this to handle division-by-zero errors."

## Success Criteria
-   All major functional bugs (e.g., division-by-zero, transaction errors) are fixed.
-   All critical security vulnerabilities (e.g., SQL injection, data exposure) are remediated.
-   Database performance is improved by adding correct indexes.
-   Schema is hardened with appropriate constraints.
-   You can articulate how Copilot assisted you in identifying, understanding, and fixing the issues.

## Troubleshooting
-   **Incorrect Logic**: If Copilot generates incorrect logic, refine your prompts with more specific context about the business rules or the desired outcome. Break the problem into smaller steps.
-   **Syntax Errors**: Double-check your prompts and the generated code. Sometimes a small change in wording can make a big difference.
-   **Database Connection Issues**: Ensure your database server is running and your connection details are correct.

## Resources
-   [MySQL Documentation](https://dev.mysql.com/doc/)
-   [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
