# Smart Grid Load Balancing System - Setup Guide

This guide provides detailed instructions for setting up your development environment to work on the Smart Grid Load Balancing System exercise. Please follow these steps carefully.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Python 3.9+**: You can download it from [python.org](https://www.python.org/downloads/).
-   **Git**: For cloning the repository. Download from [git-scm.com](https://git-scm.com/downloads).
-   **An IDE with GitHub Copilot**: 
    -   **VS Code (Recommended)**: Download from [code.visualstudio.com](https://code.visualstudio.com/).
        -   Ensure you have the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) installed and enabled.
    -   Other IDEs with Copilot support (e.g., JetBrains PyCharm).

## 2. Clone the Exercise Repository

Open your terminal or command prompt and run the following command to clone the exercise files:

```bash
git clone <repository_url> # Replace <repository_url> with the actual URL
cd copilot-exercises/python/01_load_balancing
```

## 3. Set Up a Python Virtual Environment

It is highly recommended to use a virtual environment to manage project dependencies. This prevents conflicts with other Python projects on your system.

1.  **Create the virtual environment**:
    ```bash
    python -m venv venv
    ```

2.  **Activate the virtual environment**:
    -   **On Windows (Command Prompt/PowerShell)**:
        ```bash
        .\venv\Scripts\activate
        ```
    -   **On macOS/Linux (Bash/Zsh)**:
        ```bash
        source venv/bin/activate
        ```
    You should see `(venv)` prepended to your terminal prompt, indicating the virtual environment is active.

## 4. Install Project Dependencies

With your virtual environment activated, install the required Python packages:

```bash
pip install -r requirements.txt
```

This command will install `pydantic`, `pandas`, `numpy`, `python-dateutil`, and `pytest`.

## 5. Open the Project in Your IDE

Open the `01_load_balancing` directory in your chosen IDE. For VS Code, you can do this by navigating to the directory in your terminal and typing:

```bash
code .
```

**Important for VS Code users**: Once VS Code opens, it should detect the virtual environment. If it asks, select the `venv` interpreter. You can verify this by checking the Python interpreter selected in the bottom-left corner of the VS Code status bar.

## 6. Verify Setup

To ensure everything is set up correctly, you can try running the main application file (though it will have `TODO`s):

```bash
python main.py
```

You should see some logging output indicating the system is starting and loading data. Don't worry if you see errors related to `TODO`s; that's expected as you haven't completed the exercise yet.

## Troubleshooting

-   **`python` command not found**: Ensure Python is installed and added to your system's PATH. Try `python3` instead of `python`.
-   **`pip` command not found**: `pip` is usually installed with Python. If not, ensure Python is correctly installed.
-   **Virtual environment activation issues**: Double-check the activation command for your operating system and shell.
-   **ModuleNotFoundError**: If you get this after `pip install -r requirements.txt`, ensure your virtual environment is activated before installing dependencies.
-   **GitHub Copilot not working**: 
    -   Verify the GitHub Copilot extension is installed and enabled in your IDE.
    -   Ensure you are logged into GitHub in your IDE.
    -   Check your internet connection.
    -   Restart your IDE.

If you encounter persistent issues, please consult your instructor or refer to the `TROUBLESHOOTING.md` file in the `instructor_materials` directory.
