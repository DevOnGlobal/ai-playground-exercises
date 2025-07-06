# Copilot Instructions for GitHub Copilot Workshop Repository

This file provides guidance to Copilot when working with code in this repository.

## Repository Overview

This repository contains GitHub Copilot workshop exercises across multiple programming languages:

- **Python exercises**: Data pipeline processing, API aggregation, legacy code modernization
- **SQL exercises**: Database schema design, analytics procedures, performance optimization  
- **TypeScript exercises**: REST API development, React components, JavaScript migration
- **Cross-language exercises**: Testing suites, security audits, documentation generation

The repository is structured as a collection of educational exercises designed to demonstrate GitHub Copilot capabilities across different SDLC phases and complexity levels.

## References
- Task prompt (`copilot_exercise_generator_prompt.md`)
- Excercies (`copilot_exercises.md`)

## Architecture

### Python Data Processing Pipeline (`python/01-data-pipeline/`)
- **Core class**: `DataProcessor` in `src/data_processor_starter.py`
- **Exercise structure**: Starter templates with TODO comments for Copilot-assisted implementation
- **Data flow**: CSV reading → validation → cleaning → metric calculation → customer categorization → reporting
- **Key dependencies**: pandas, numpy, pytest, cerberus for validation

### Exercise Structure Pattern
Each exercise follows a consistent pattern:
- `README.md` with setup instructions and learning objectives
- Starter code files with TODO comments and function signatures
- `tests/` directory with test modules for validation
- Sample data files for realistic scenarios
- Instructor-only reference implementations

## Development Commands

### Python Projects
```bash
# Setup virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Verify setup
python setup_checker.py

# Run tests
python -m pytest tests/ -v
python -m pytest tests/test_validation.py -v  # Specific test file

# Code formatting and linting
black .
flake8 .
```

### Project Structure
```
python/01-data-pipeline/
├── src/
│   └── data_processor_starter.py  # Main implementation file
├── tests/
│   ├── test_validation.py         # Validation tests
│   ├── test_transformation.py     # Data transformation tests
│   └── integration.py             # Integration tests
├── data/
│   ├── sample_sales_data.txt      # Sample data for testing
│   └── sample_corrupted_data.txt  # Error case data
└── docs/
    └── instructions.md            # Exercise instructions
```

## Key Implementation Notes

### Data Processing Pipeline
The main `DataProcessor` class orchestrates a 7-step pipeline:
1. CSV data reading with error handling
2. Required field validation (customer_id, product_id, quantity, price, order_date, customer_email)
3. Data type validation and conversion
4. Text data cleaning and standardization
5. Business metric calculations (total_revenue, profit_margin)
6. Customer segmentation (Premium >$500, Standard $100-$500, Basic <$100)
7. Summary statistics generation

### Exercise Methodology
- All exercises use TODO comments as prompts for Copilot code generation
- Emphasis on error handling, logging, and validation patterns
- Focus on business logic implementation with pandas
- Test-driven development approach with comprehensive test suites

## Testing Strategy

Tests are organized by functionality:
- `test_validation.py`: Field and data type validation
- `test_transformation.py`: Data cleaning and calculation logic
- `integration.py`: End-to-end pipeline testing
- `data_reader.py`: CSV reading and error handling

Run specific test categories to validate individual components during development.