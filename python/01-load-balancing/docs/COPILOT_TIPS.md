# Smart Grid Load Balancing System - GitHub Copilot Tips

This document provides specific tips and techniques for effectively using GitHub Copilot while working on the Smart Grid Load Balancing System exercise. The goal is to help you maximize your AI collaboration skills.

## General Copilot Best Practices for this Exercise

1.  **Read the Docstrings and `TODO` Comments Carefully**: Each `TODO` comment and method docstring contains crucial business rules, technical guidance, and explicit Copilot prompting tips. These are designed to give Copilot the context it needs to generate accurate and relevant code.

2.  **Be Specific in Your Prompts**: Instead of vague comments like `# Implement this method`, try to be as descriptive as possible. For example:
    -   `# TODO: Calculate the utilization percentage as (current_load / max_capacity) * 100`
    -   `# Copilot Tip: "Generate a Pydantic validator to ensure current_output_mw does not exceed max_capacity_mw."`

3.  **Provide Context**: Copilot works best when it has surrounding code for context. If you're implementing a method, ensure the class definition, imports, and any relevant attributes are already in place.

4.  **Iterate and Refine**: Copilot might not get it right on the first try. If the suggestion isn't what you need, try:
    -   **Adding more specific comments**: Refine your `TODO` or add a new comment above the line where you want the suggestion.
    -   **Deleting and re-typing**: Sometimes, simply deleting the generated code and re-typing a few characters (or the `TODO` comment) can trigger a better suggestion.
    -   **Accepting partial suggestions**: Accept the part that's correct and then guide Copilot for the rest.

5.  **Use Type Hints**: Python type hints (`List[str]`, `Optional[datetime]`, `-> float`) are invaluable for Copilot. They provide strong signals about the expected data types, which helps Copilot generate more accurate code and reduce errors.

6.  **Leverage Existing Patterns**: Notice how existing code (e.g., Pydantic model definitions, data loading patterns) is structured. Copilot is excellent at recognizing and replicating these patterns.

7.  **Test Frequently**: After implementing a section with Copilot's help, run the relevant tests or `main.py` to verify its functionality. This immediate feedback loop helps you catch errors early.

## Specific Tips for Smart Grid Exercise Tasks

### Task 1: Grid Infrastructure Data Models (`src/models/grid_infrastructure.py`, `src/models/power_sources.py`, `src/models/load_measurements.py`)
-   **Pydantic Validation**: When adding validators (e.g., `@validator('field_name')`), explicitly state the validation rule in your comment. Copilot is good at generating the `@validator` decorator and the basic function structure.
    -   *Example Prompt*: `# TODO: Add a validator to ensure 'reliability_score' is between 0.0 and 1.0 inclusive.`
-   **Enum Usage**: When defining `Enum` classes, Copilot can often suggest common values if you provide a clear name and initial values.

### Task 2: Data Loading Infrastructure (`src/utils/data_loader.py`)
-   **File I/O**: When working with `open()`, `json.load()`, `csv.DictReader`, explicitly mention the file format and what you expect to extract.
    -   *Example Prompt*: `# TODO: Read 'power_sources.json' and parse each entry into a PowerSource Pydantic model.`
-   **Error Handling**: Prompt for `try...except` blocks to ensure robust file operations.
    -   *Example Prompt*: `# TODO: Add error handling for FileNotFoundError and JSONDecodeError.`
-   **Pydantic Integration**: When loading data, prompt Copilot to directly instantiate Pydantic models from the parsed data (e.g., `MyModel(**data)`).

### Task 3: Load Balancing Business Logic (`src/services/load_balancer.py`)
-   **Algorithm Steps**: Break down complex algorithms into smaller, sequential `TODO` comments. For example, for `calculate_optimal_transfers`:
    1.  `# TODO: Identify overloaded segments.`
    2.  `# TODO: Find healthy segments with available capacity.`
    3.  `# TODO: Iterate through overloaded segments and find suitable transfer paths.`
    4.  `# TODO: Calculate feasible transfer amount considering losses and path capacity.`
-   **Business Constraints**: Explicitly state numerical constraints and priorities (e.g., `Never exceed segment safety thresholds`, `Prioritize renewable energy`). Copilot can often incorporate these into conditional logic.

### Task 4: Monitoring and Alerting System (`src/services/monitoring_system.py`)
-   **Thresholds**: Clearly define alert thresholds (e.g., `80% warning`, `90% critical`) in comments or class attributes. Copilot will use these to generate `if/elif` conditions.
-   **Logging**: Prompt for `logging.info()`, `logging.warning()`, etc., to ensure proper audit trails.
    -   *Example Prompt*: `# TODO: Log a warning message when a critical alert is generated.`

### Task 5: Data Analysis and Reporting (`src/reports/grid_reports.py`)
-   **Aggregation**: When you need to aggregate data (e.g., `sum`, `average`, `count`), specify the grouping criteria.
    -   *Example Prompt*: `# TODO: Calculate the average load for each hour of the day from measurements.`
-   **Formatting**: If you need specific output formats (e.g., f-strings for reports), mention it.
    -   *Example Prompt*: `# TODO: Format the report as a multi-line string with clear headings.`

By applying these tips, you'll find GitHub Copilot to be an incredibly powerful partner in developing the Smart Grid Load Balancing System. Happy coding!
