# Troubleshooting Tips for GitHub Copilot in TypeScript

If you're encountering issues with GitHub Copilot during the Power Outage Management exercise, here are some common problems and their solutions.

---

## 1. Copilot is Not Suggesting Anything

**Possible Causes & Solutions:**

*   **Vague or Insufficient Context**:
    *   **Problem**: Your comments are too general (e.g., "write code here") or there isn't enough surrounding code for Copilot to understand your intent.
    *   **Solution**: Be extremely specific. Describe *what* you want to achieve, *how* it should be done (e.g., "use Haversine formula"), *what data* it should use, and *what it should return*. Provide relevant type definitions (interfaces, enums) nearby.
    *   **Example of good context**:
        ```typescript
        // TODO: Implement a function to calculate the estimated restoration time.
        // Business Rules:
        // - Equipment failure: 2-4 hours
        // - Tree on line: 1-2 hours
        // - Substation outage: 4-8 hours
        // - Weather (rain): 1.5x multiplier
        // - Crew skill (Junior): 1.5x multiplier
        estimateRestorationTime(incident: OutageIncident, assignedCrew: FieldCrew): Date {
          // ...
        }
        ```

*   **Syntax Errors in Surrounding Code**:
    *   **Problem**: If your existing code has syntax errors, Copilot might get confused and stop providing suggestions.
    *   **Solution**: Fix any red squiggly lines or errors reported by your IDE's TypeScript linter. Save your file.

*   **Copilot Extension Issues**:
    *   **Problem**: The Copilot extension might be disabled, not authenticated, or experiencing a temporary glitch.
    *   **Solution**:
        1.  Check your IDE's extensions panel to ensure GitHub Copilot is enabled.
        2.  Verify you are logged in to GitHub and your Copilot subscription is active.
        3.  Try reloading your IDE window (e.g., `Developer: Reload Window` in VS Code).
        4.  Restart your IDE.

*   **File Type Not Supported**:
    *   **Problem**: Copilot might not be active for certain file types.
    *   **Solution**: Ensure you are working in a `.ts` or `.tsx` file.

---

## 2. Copilot Suggestions are Irrelevant or Incorrect

**Possible Causes & Solutions:**

*   **Ambiguous Prompting**:
    *   **Problem**: Your prompt could be interpreted in multiple ways.
    *   **Solution**: Refine your prompt. Add more constraints, examples, or specify the exact algorithm/approach you want.
    *   **Example**: Instead of "calculate distance", try "calculate distance using the Haversine formula".

*   **Conflicting Context**:
    *   **Problem**: There might be conflicting information in your comments or surrounding code.
    *   **Solution**: Review the code above and below your cursor. Remove any outdated or contradictory comments. Ensure variable names and types are consistent.

*   **Lack of Domain-Specific Terminology**:
    *   **Problem**: Copilot works best when you use the language of the domain.
    *   **Solution**: Use terms like `OutageIncident`, `FieldCrew`, `Substation`, `LoadShedding`, `CriticalInfrastructure` as defined in the exercise. This helps Copilot tap into its knowledge base for that domain.

*   **Too Much Code at Once**:
    *   **Problem**: Trying to generate a very large block of code with a single prompt can lead to less accurate suggestions.
    *   **Solution**: Break down the task into smaller, logical steps. Generate one part, review, then move to the next. For example, first generate the `if` condition, then the `else if`, etc.

*   **Outdated Model Knowledge**:
    *   **Problem**: While rare, Copilot's underlying model might not have the absolute latest information on a niche library or very new syntax.
    *   **Solution**: For very specific or new requirements, you might need to provide more explicit code examples or fall back to traditional coding for that small part.

---

## 3. Copilot is Too Slow

**Possible Causes & Solutions:**

*   **Network Latency**:
    *   **Problem**: Copilot relies on cloud services, so a slow internet connection can affect response times.
    *   **Solution**: Ensure you have a stable and fast internet connection.

*   **Large File Size / Complex Project**:
    *   **Problem**: In very large files or projects with many dependencies, Copilot might take longer to analyze the context.
    *   **Solution**: This is often unavoidable. Ensure your IDE is not overloaded with other processes.

*   **IDE Performance**:
    *   **Problem**: Your IDE itself might be running slowly.
    *   **Solution**: Close unnecessary applications. Ensure your IDE is up-to-date.

---

## 4. Copilot Generates Inefficient or Suboptimal Code

**Possible Causes & Solutions:**

*   **Copilot is a Suggestion Engine, Not a Perfect Engineer**:
    *   **Problem**: Copilot aims for functional code, not always the most optimized or idiomatic.
    *   **Solution**: Treat Copilot's suggestions as a starting point. Always review, refactor, and optimize the generated code as you would with any other code. This is a key part of AI-assisted development.

*   **Missing Constraints**:
    *   **Problem**: If you don't specify performance or efficiency requirements, Copilot won't prioritize them.
    *   **Solution**: Add comments like "optimize for performance", "use a more efficient algorithm", or "avoid unnecessary loops" if those are your goals.

---

## General Best Practices

*   **Read the `// TODO` Comments Carefully**: They contain crucial business rules and hints.
*   **Use Clear Variable Names**: Descriptive names help Copilot understand the data.
*   **Commit Frequently**: Small, frequent commits help you revert if a Copilot-assisted change goes wrong.
*   **Don't Be Afraid to Delete and Restart**: If a section of code or a prompt isn't working, sometimes it's faster to delete it and try a fresh approach.
*   **Consult the `effective_prompting_examples.md`**: This file provides specific examples tailored to this exercise.

By understanding these common issues and applying the solutions, you can make your experience with GitHub Copilot much smoother and more productive.
