# SQL Exercise: Smart Grid Load Balancing Database System

## Overview
**Duration**: 45 minutes  
**Difficulty**: Intermediate  
**Focus**: Learning GitHub Copilot collaboration techniques for SQL development

## Learning Objectives
**Primary Goal**: Master GitHub Copilot collaboration patterns for SQL development
- Practice writing descriptive SQL comments that guide Copilot effectively
- Learn to provide business context that generates accurate SQL suggestions
- Understand how to iteratively refine Copilot suggestions for complex queries
- Experience data-driven development with clear sample data connections

## Business Context
You're working with a pre-existing smart grid database that already contains operational data. Your job is to write SQL queries and views that help operators make load balancing decisions. **Focus on learning how to guide GitHub Copilot** to generate the SQL you need rather than inventing business rules.

## Setup Instructions
1.  **Database**: Ensure you have a MySQL-compatible database environment set up.
2.  **Schema**: Load the database schema from `smart_grid_db_schema/schema.sql`.
    ```bash
    mysql -u your_user -p your_database < smart_grid_db_schema/schema.sql
    ```
3.  **Sample Data**: Load the sample data from `sample_data/load_data.sql`.
    ```bash
    mysql -u your_user -p your_database < sample_data/load_data.sql
    ```
4.  **Helper Views**: Load the helper views from `sample_data/validation.sql`.
    ```bash
    mysql -u your_user -p your_database < sample_data/validation.sql
    ```

## Task Structure
This exercise is divided into 5 tasks, each focusing on different aspects of SQL development with GitHub Copilot.

-   **Task 1: Data Exploration & Copilot Orientation** (8 minutes)
    -   **Objective**: Learn to write SQL comments that effectively guide GitHub Copilot.
    -   **Copilot Focus**: Practice descriptive comments that generate accurate SQL suggestions.
    -   **Instructions**: Open `tasks/01_data_exploration.sql` and follow the instructions within.

-   **Task 2: Real-Time Monitoring Views** (10 minutes)
    -   **Objective**: Create monitoring views using Copilot with specific business requirements.
    -   **Copilot Focus**: Learn to provide business context that generates accurate view definitions.
    -   **Instructions**: Open `tasks/02_monitoring_views.sql` and follow the instructions within.

-   **Task 3: Automated Alert Generation** (8 minutes)
    -   **Objective**: Build alert queries with specific threshold logic.
    -   **Copilot Focus**: Practice providing precise business rules and calculations.
    -   **Instructions**: Open `tasks/03_alert_queries.sql` and follow the instructions within.

-   **Task 4: Load Optimization Analytics** (12 minutes)
    -   **Objective**: Complex analytical queries for load balancing decisions.
    -   **Copilot Focus**: Multi-step query development with business scenario guidance.
    -   **Instructions**: Open `tasks/04_optimization_analytics.sql` and follow the instructions within.

-   **Task 5: Emergency Response Procedures** (7 minutes)
    -   **Objective**: Create emergency response queries with specific operational procedures.
    -   **Copilot Focus**: Translate emergency procedures into actionable SQL queries.
    -   **Instructions**: Open `tasks/05_emergency_procedures.sql` and follow the instructions within.

## Getting Started
1.  Ensure your database is set up and data is loaded as per the Setup Instructions.
2.  Navigate to the `tasks/` directory.
3.  Open `01_data_exploration.sql` in your IDE and begin working through the tasks, using GitHub Copilot to assist you.
4.  Validate your setup by running the queries in `sample_data/validation.sql`.

## Copilot Best Practices
Refer to the `copilot_guidance/` directory for detailed examples and tips on effective prompting, common patterns, and troubleshooting with GitHub Copilot.

## Success Criteria
By the end of this exercise, you should have mastered:

### ✅ **GitHub Copilot SQL Collaboration Skills**
-   [ ] Writing descriptive comments that generate accurate SQL suggestions
-   [ ] Providing business context that guides Copilot toward correct implementations  
-   [ ] Iteratively refining Copilot suggestions for complex queries
-   [ ] Breaking down complex business scenarios into step-by-step SQL development

### ✅ **SQL Implementation Results**
-   [ ] Real-time monitoring views for operational dashboards
-   [ ] Alert queries with specific threshold logic and calculations
-   [ ] Optimization analytics for load balancing decisions  
-   [ ] Emergency response procedures with actionable SQL queries
-   [ ] All queries connect to provided sample data and return realistic results

### ✅ **Practical AI Development Experience**
-   [ ] Experience with data-driven development using pre-built sample data
-   [ ] Understanding of how to provide domain context without requiring domain expertise
-   [ ] Ability to verify AI-generated SQL against business requirements
-   [ ] Confidence in using AI assistance for complex analytical query development

## Troubleshooting
Refer to `copilot_guidance/troubleshooting_tips.md` for common issues and solutions related to GitHub Copilot.

## Resources
-   `smart_grid_db_schema/schema.sql`: Database schema definition.
-   `sample_data/load_data.sql`: SQL script to load sample data.
-   `sample_data/validation.sql`: SQL script for validating data setup and helper views.
-   `copilot_guidance/effective_prompting_examples.md`: Examples of effective prompts.
-   `copilot_guidance/common_patterns.sql`: Reusable SQL patterns.
-   `copilot_guidance/troubleshooting_tips.md`: Tips for troubleshooting Copilot issues.