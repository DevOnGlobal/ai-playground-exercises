# GitHub Copilot Tips for the Energy Meter Pipeline Exercise

This document provides tips and best practices for using GitHub Copilot to successfully complete this exercise.

## 1. Getting Started: The First Prompt
- **Goal:** Understand the existing codebase.
- **Good Prompt:** "@workspace /explain the `process_billing_data` function in `src/processing/billing_processor.py`."
- **Why:** This asks Copilot to analyze the monolithic function, which is the core of the exercise. It will help you identify its multiple responsibilities and potential issues.

## 2. Creating a Test Safety Net
- **Goal:** Write tests before refactoring.
- **Good Prompt:** "Write a pytest test file for the `process_billing_data` function. Create mock data files for `sample_readings.csv`, `meter_config.json`, and `billing_rules.json` to test the function's behavior."
- **Why:** This is a crucial step. You need a safety net of tests to ensure you don't break functionality while refactoring.

## 3. Refactoring the Monolith
- **Goal:** Break down the `process_billing_data` function.
- **Good Prompt:** "Refactor the data loading logic from `process_billing_data` into a new function called `load_data` in a new file `src/utils/data_loader.py`."
- **Why:** This is a specific, actionable prompt that tells Copilot exactly what to do. Repeat this process for other responsibilities like data cleaning, calculation, and reporting.

## 4. Identifying and Fixing Bugs
- **Goal:** Find and fix the intentional bugs in the code.
- **Good Prompt:** "@workspace /findbugs. How can I fix the timezone conversion logic in `process_billing_data` to handle different timezones correctly?"
- **Why:** This asks Copilot to not only identify a specific problem but also to suggest a solution.

## 5. Improving Code Quality
- **Goal:** Add error handling, logging, and configuration management.
- **Good Prompt:** "Replace the hardcoded file paths in `src/main.py` with a configuration management system using a `config.ini` file."
- **Why:** This helps you improve the overall quality of the codebase, making it more robust and maintainable.

Remember to be specific in your prompts and to review Copilot's suggestions carefully. Happy coding!
