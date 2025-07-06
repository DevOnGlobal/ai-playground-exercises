# Power Outage Management Database System Exercise

## Overview
This exercise focuses on leveraging GitHub Copilot for complex SQL development within a power outage management database system. You will learn to effectively collaborate with AI to implement business logic, optimize queries, and automate reporting.

**Duration**: 45 minutes
**Difficulty**: Advanced
**Focus**: GitHub Copilot Collaboration for Complex SQL Development

## Learning Objectives
- Write descriptive comments that guide Copilot to generate accurate SQL.
- Use domain-specific terminology to improve AI suggestions.
- Iterate with Copilot on complex multi-table queries.
- Leverage AI for stored procedure and view creation.
- Test and refine Copilot-generated database logic.

## Business Context
You are working with a pre-built database system for utility companies managing power outages. Your primary focus is on learning how to effectively use GitHub Copilot to implement defined business requirements through SQL, rather than understanding the intricate business domain itself.

## Setup Instructions

1.  **Database**: Ensure you have a MySQL-compatible database environment set up (e.g., MySQL Server, Docker container with MySQL).
2.  **Schema & Data Loading**:
    *   Navigate to the `smart_grid_db_schema` directory and execute `schema.sql` to create the necessary tables.
    *   Navigate to the `sample_data` directory and execute `load_data.sql` to populate the database with realistic test data.
    *   Run `validation.sql` in the `sample_data` directory to confirm successful data loading.

    ```bash
    # Example for MySQL CLI (adjust for your environment)
    mysql -u your_user -p your_database < smart_grid_db_schema/schema.sql
    mysql -u your_user -p your_database < sample_data/load_data.sql
    mysql -u your_user -p your_database < sample_data/validation.sql
    ```

## Task Structure
This exercise is divided into several tasks, each designed to build your Copilot collaboration skills.

*   **Task 1: Data Access Foundation** (8 minutes)
*   **Task 2: Customer Impact Analysis** (12 minutes)
*   **Task 3: Crew Dispatch Optimization** (15 minutes)
*   **Task 4: Regulatory Reporting Automation** (10 minutes)

## Getting Started
Open the SQL files in the `tasks/` directory. Each file contains `TODO` comments and Copilot prompts to guide your implementation.

## Copilot Best Practices for This Exercise
-   **Descriptive Comments**: Provide clear, concise comments outlining business rules, formulas, and expected output.
-   **Domain Terminology**: Use terms like "SAIDI/SAIFI", "crew dispatch", "critical infrastructure" to guide Copilot.
-   **Iterative Refinement**: Start with simple prompts and gradually add complexity.
-   **Structured Queries**: Break down complex problems into smaller, manageable CTEs (Common Table Expressions).

## Success Criteria
-   All tasks in the `tasks/` directory are completed using GitHub Copilot.
-   Your SQL queries and procedures execute without errors on the provided sample data.
-   The output of your queries matches the expected results based on the business rules.
-   You can articulate how Copilot assisted you in solving each task.

## Troubleshooting
-   **Syntax Errors**: Double-check your prompts and the generated code. Sometimes a small change in wording can make a big difference.
-   **Incorrect Logic**: If Copilot generates incorrect logic, refine your comments with more specific business rules or break the problem into smaller steps.
-   **Database Connection Issues**: Ensure your database server is running and your connection details are correct.

## Resources
-   [MySQL Documentation](https://dev.mysql.com/doc/)
-   [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
