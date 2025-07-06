# Setup Guide

This guide will walk you through the steps required to set up your environment for the Energy Meter Pipeline exercise.

## Prerequisites
- Python 3.8 or higher
- `pip` for package management
- An IDE of your choice (e.g., VS Code)
- Git for version control

## 1. Clone the Repository
If you haven't already, clone the exercise repository to your local machine.

```bash
git clone <repository-url>
cd <repository-directory>/python/energy-meter-pipeline
```

## 2. Create a Virtual Environment
It is highly recommended to use a virtual environment to manage project dependencies.

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

## 3. Install Dependencies
The required Python packages are listed in the `requirements.txt` file.

```bash
pip install -r requirements.txt
```

## 4. Verify the Setup
Run the main script to ensure everything is set up correctly. You should see a billing report printed to the console.

```bash
python src/main.py
```

If the script runs without errors, your environment is ready. You can now begin the exercise.
