# GitHub Copilot Tips for Outage Management Exercise

This exercise is designed to help you master **AI collaboration skills** with GitHub Copilot. Here are some tips to get the most out of your experience:

## General Prompting Strategies

1.  **Be Specific and Detailed**: The more context and constraints you provide, the better Copilot's suggestions will be. Include business rules, data types, and expected outcomes.
    *   **Bad**: `// TODO: calculate distance`
    *   **Good**: `// TODO: Calculate geographic distance between two lat/lon points using the Haversine formula. Earth radius is 6371 km. Convert degrees to radians.`

2.  **Use Docstrings and Type Hints**: Python docstrings and type hints are excellent ways to provide context to Copilot. Fill out method signatures and docstrings first, then let Copilot suggest the implementation.

3.  **Break Down Complex Problems**: If a task is large, break it into smaller, manageable `TODO` comments. Copilot works best with focused, atomic tasks.

4.  **Iterate and Refine**: Don't expect the perfect solution on the first try. Accept a suggestion, then refine it by adding more comments, changing variable names, or providing examples.

5.  **Provide Examples**: If a function needs to handle specific cases, include them in your comments or docstrings. For example, `// TODO: Handle edge case where customer count is zero`.

6.  **Use Keywords**: Use keywords relevant to the task, such as `Haversine`, `priority score`, `dispatch algorithm`, `notification channels`, `regulatory compliance`.

## Domain-Specific Prompting (Outage Management)

When working on this exercise, leverage the specific terminology and business context:

-   **Incident Management**: Think about the lifecycle of an outage. Use terms like `incident creation`, `status update`, `severity assessment`, `customer impact`.
    *   *Example Prompt*: `// TODO: Auto-escalate incident severity to CRITICAL if critical infrastructure (e.g., hospitals) is affected or if estimated_customers_affected > 2000.`

-   **Crew Dispatch**: Focus on optimization factors. Use terms like `optimal crew`, `specialization match`, `distance penalty`, `experience bonus`, `estimated arrival time`.
    *   *Example Prompt*: `// TODO: Implement crew availability check: crew must be AVAILABLE or RETURNING, hours_worked_today < 16, shift_end > 4 hours away, and current_assignments < 2.`

-   **Customer Communication**: Consider different customer types and communication channels. Use terms like `personalized message`, `notification rules`, `delivery simulation`, `critical infrastructure notification`.
    *   *Example Prompt*: `// TODO: Group affected customers by customer_type (CRITICAL_INFRASTRUCTURE, COMMERCIAL, RESIDENTIAL) and apply notification delays: critical=0min, commercial=15min, residential=30min.`

-   **Data Handling**: Be explicit about data sources and structures. Refer to `JSON` files, `Pydantic models`, and `data_loader` methods.
    *   *Example Prompt*: `// TODO: Load customer data from customer_database.json using self.data_dir and json.load(). Cache the result.`

## Effective `TODO` Comments

Remember the `TODO` comment format:

```python
# TODO: [Specific implementation task]
# Business Rule: [Relevant constraint or calculation]
# [Technical guidance: formulas, algorithms, standards]
# Copilot Tip: "[Suggested prompt for this specific task]"
```

**Example**:

```python
# TODO: Calculate total score for this crew
# Business Rule: Total score = specialization_score + distance_penalty + experience_bonus + customer_bonus
# Copilot Tip: "Calculate crew score based on specialization, distance, experience, and customer impact"
```

By following these tips, you'll effectively leverage GitHub Copilot to build robust solutions and enhance your AI collaboration skills!