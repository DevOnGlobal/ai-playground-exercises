# Smart Grid Load Balancing System - GitHub Copilot Exercise

## Overview
Welcome to the Smart Grid Load Balancing System exercise! In this workshop, you will learn how to effectively collaborate with GitHub Copilot to build a Python-based system for an electrical distribution company. The system will process load data, balance power distribution across grid segments, and provide monitoring capabilities.

This exercise focuses on teaching **AI collaboration skills** with GitHub Copilot, not deep domain expertise in energy systems. You will learn how to effectively prompt and work with AI to implement well-defined business requirements.

**Duration**: Approximately 50 minutes  
**Difficulty**: Intermediate  
**Domain**: Energy Distribution Network Software (Python Focus)

## Learning Objectives
By completing this exercise, you will:
- Practice writing descriptive docstrings and comments to guide GitHub Copilot.
- Build data processing logic using standard Python libraries.
- Implement business logic for power system operations.
- Create monitoring and alerting systems using built-in Python capabilities.
- Use type hints and Pydantic for robust data validation.
- Learn to provide clear data context for AI-assisted development.
- Gain practical experience with complex data processing and business logic implementation.

## Setup Instructions

1.  **Clone the Repository**: If you haven't already, clone the main repository containing this exercise.
    ```bash
    git clone <repository_url>
    cd copilot-exercises/python/01-load-balancing
    ```

2.  **Create a Virtual Environment** (Recommended):
    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment**:
    -   **Windows**:
        ```bash
        .\venv\Scripts\activate
        ```
    -   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```

4.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Open in Your IDE**: Open the `01-load-balancing` directory in your preferred IDE (e.g., VS Code) with the GitHub Copilot extension installed and enabled.

## Exercise Overview

This exercise is divided into several tasks, each designed to progressively build out the Smart Grid Load Balancing System. You will be guided by `TODO` comments and docstrings within the code, which are specifically crafted to help you practice effective prompting with GitHub Copilot.

**Key Components you will work with:**
-   `src/models/`: Pydantic models for grid infrastructure, power sources, and load measurements.
-   `src/utils/data_loader.py`: Utilities for loading data from JSON and CSV files.
-   `src/services/load_balancer.py`: Core logic for analyzing grid capacity and recommending load transfers.
-   `src/services/monitoring_system.py`: System for real-time grid monitoring and alert generation.
-   `src/reports/grid_reports.py`: Functions for generating operational summaries and performance analysis.

Your goal is to complete the `TODO` sections in the provided starter code, leveraging GitHub Copilot to assist you. Remember to read the docstrings and comments carefully, as they contain crucial business rules and Copilot prompting tips.

Good luck, and have fun collaborating with AI!
