# Setup Guide: Power Outage Management System

This guide provides step-by-step instructions to set up your development environment for the Power Outage Management System exercise.

## 1. Prerequisites
Before you begin, ensure you have the following installed on your system:

-   **Python 3.8+**: Download from [python.org](https://www.python.org/downloads/).
-   **Git**: Download from [git-scm.com](https://git-scm.com/downloads/).
-   **An IDE with GitHub Copilot**: 
    -   **Visual Studio Code (VS Code)**: Recommended. Install the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot).
    -   Other IDEs like PyCharm also support Copilot.

## 2. Clone the Repository
Open your terminal or command prompt and clone the exercise repository:

```bash
git clone <repository_url_here> # Replace with the actual repository URL
cd power-outage-management
```

## 3. Create and Activate a Virtual Environment
It's best practice to use a virtual environment to manage project dependencies.

### For Windows:

```bash
python -m venv venv
.\venv\Scripts\activate
```

### For macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

Your terminal prompt should now show `(venv)` indicating the virtual environment is active.

## 4. Install Dependencies
With your virtual environment activated, install the required Python packages:

```bash
pip install -r requirements.txt
```

This will install `pydantic`, `pandas`, `python-dateutil`, and `pytest`.

## 5. Open in Your IDE
Open the `power-outage-management` directory in your chosen IDE (e.g., VS Code).

If using VS Code, ensure your Python interpreter is set to the one inside your virtual environment (`venv/Scripts/python.exe` on Windows or `venv/bin/python` on macOS/Linux).

## 6. Verify Setup
To ensure everything is set up correctly, you can try running the `main.py` file (though it won't fully function until you complete the tasks):

```bash
python main.py
```

You should see some initial print statements, possibly followed by `TODO` related messages or errors, which is expected at this stage.

## Troubleshooting
If you encounter any issues, refer to the `TROUBLESHOOTING.md` file in the `docs` directory.