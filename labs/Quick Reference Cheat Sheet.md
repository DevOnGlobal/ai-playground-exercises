# GitHub Copilot for VS Code: Quick Reference Cheat Sheet

## Essential Keyboard Shortcuts (Windows)

### Code Suggestions
| Action | Shortcut | Description |
|--------|----------|-------------|
| **Accept Suggestion** | `Tab` | Accept the current Copilot suggestion |
| **Reject Suggestion** | `Esc` | Dismiss the current suggestion |
| **Next Suggestion** | `Alt + ]` | Cycle to the next alternative suggestion |
| **Previous Suggestion** | `Alt + [` | Cycle to the previous alternative suggestion |
| **Trigger Suggestion** | `Ctrl + Space` | Manually trigger Copilot suggestions |
| **Accept Word** | `Ctrl + →` | Accept only the next word of the suggestion |
| **Accept Line** | `Ctrl + Enter` | Accept only the current line of the suggestion |

### Copilot Chat
| Action | Shortcut | Description |
|--------|----------|-------------|
| **Open Chat View** | `Ctrl + Alt + I` | Open Copilot Chat panel in sidebar |
| **Inline Chat** | `Ctrl + I` | Open inline chat in editor |
| **Voice Chat** | `Ctrl + I` (hold) | Start voice conversation with Copilot |
| **New Chat Session** | `Ctrl + N` | Start new chat session in Chat view |
| **Agent Mode** | `Ctrl + Shift + I` | Switch to agent mode |

**Reference:** [GitHub Copilot in VS Code Features](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)

---

## Copilot Chat Commands & Variables

### Chat Variables (Use # to reference context)
| Variable | Description | Example |
|---------|-------------|---------|
| `#file` | Include current file's content | `#file explain this function` |
| `#selection` | Include currently selected text | `#selection optimize this code` |
| `#function` | Include current function/method | `#function add error handling` |
| `#class` | Include current class | `#class explain this design pattern` |
| `#line` | Include current line of code | `#line fix this syntax error` |
| `#project` | Include project context | `#project show me all API routes` |
| `#sym` | Include current symbol | `#sym explain this variable` |
| `#block` | Include current block of code | `#block what does this do?` |
| `#path` | Include file path | `#path where is this file located?` |
| `#comment` | Include current comment | `#comment explain this TODO` |

### Slash Commands (Official VS Code commands)
| Command | Description | Example |
|---------|-------------|---------|
| `/clear` | Start a new chat session | `/clear` |
| `/explain` | Explain how code works | `/explain how does this algorithm work?` |
| `/fix` | Propose fixes for problems | `/fix this function has a bug` |
| `/tests` | Generate unit tests | `/tests create tests for this function` |
| `/new` | Create a new project | `/new create a React app` |
| `/help` | Quick reference for Copilot | `/help` |
| `/fixTestFailure` | Find and fix failing tests | `/fixTestFailure why is this test breaking?` |

**Reference:** [GitHub Copilot Chat Cheat Sheet](https://docs.github.com/en/copilot/reference/cheat-sheet)

---

## Chat Participants & Agents

### Chat Participants (Official agents)
| Agent | Command | Description |
|-------|---------|-------------|
| **Workspace** | `@workspace` | Ask questions about your codebase structure and patterns | 
| **VSCode** | `@vscode` | Get help with VS Code features and settings |
| **Terminal** | `@terminal` | Get help with terminal/command line tasks |
| **GitHub** | `@github` | Access GitHub-specific skills and repository information |

### Chat Participant Examples
```
@workspace how do I add authentication to this app?
@workspace find all TODO comments in my project
@vscode how do I set up debugging for Node.js?
@terminal how do I create a git branch?
@github what issues are assigned to me?
```

**Reference:** [Using GitHub Copilot Chat Participants](https://docs.github.com/en/copilot/how-tos/chat/asking-github-copilot-questions-in-your-ide)

---

## Status Bar Indicators

### Copilot Status Icons
| Icon | Meaning |
|------|---------|
| 🤖 **Active** | Copilot is active and ready |
| ⏸️ **Paused** | Suggestions are paused |
| ❌ **Disabled** | Copilot is disabled for this file type |
| ⚠️ **Warning** | Authentication or connection issue |

**Reference:** [Configuring GitHub Copilot in VS Code](https://docs.github.com/en/copilot/how-tos/configure-personal-settings/configure-in-your-environment)

---

## Chat Modes

### Available Chat Modes
| Mode | Description | Best For |
|------|-------------|----------|
| **Ask** | Get answers and code suggestions | Questions about code, explanations, general help |
| **Edit** | Make changes across multiple files | Coordinated edits, refactoring across project |
| **Agent** | Autonomous multi-step workflows | Complex tasks, feature implementation |

### How to Switch Modes
- Use the dropdown at the top of the Chat view
- Or use `Ctrl + Shift + I` to switch to Agent mode directly

**Reference:** [Using Chat in VS Code](https://code.visualstudio.com/docs/copilot/chat/copilot-chat)

---

## Prompt Files & Customization

### Copilot Instructions File
**File:** `.github/copilot-instructions.md`
**Purpose:** Global instructions that apply to all Copilot interactions in your project
**Usage:** Automatically included in every chat request

```markdown
# Project: E-commerce Platform
Use TypeScript for all new code.
Follow our coding standards: camelCase, descriptive names.
Include error handling and JSDoc comments.
Prefer async/await over promises.
```

### Custom Prompt Files
**Location:** `.github/prompts/`
**Extension:** `.prompt.md`
**Purpose:** Reusable prompts for common tasks
**Usage:** Reference with `#prompt:filename`

#### Example: Code Review Prompt
**File:** `.github/prompts/code-review.prompt.md`
```markdown
Review this code for:
- Security vulnerabilities
- Performance issues  
- Code style consistency
- Best practices adherence
- Documentation completeness
```

#### Example: API Development Prompt
**File:** `.github/prompts/api-development.prompt.md`
```markdown
Create a REST API endpoint that:
- Follows RESTful conventions
- Includes proper error handling
- Has input validation
- Returns appropriate HTTP status codes
- Includes OpenAPI documentation
```

### Chat Mode Files
**Location:** `.github/copilot-chat-modes/`
**Extension:** `.md`
**Purpose:** Define specialized chat behaviors and tool access
**Usage:** Select from chat mode dropdown

#### Example: Code Reviewer Mode
**File:** `.github/copilot-chat-modes/code-reviewer.md`
```markdown
---
description: 'Review code for quality and adherence to best practices.'
tools: ['codebase', 'usages', 'vscodeAPI', 'problems']
---
# Code Reviewer Mode
You are a senior developer conducting thorough code reviews.
Focus on code quality, security, and maintainability.
```

### Language-Specific Instructions
**Purpose:** Provide language-specific guidance for better code generation
**Usage:** Automatically applied when working in specific languages

#### Example: JavaScript Instructions
```markdown
# JavaScript Guidelines
- Use ES6+ features (arrow functions, destructuring, modules)
- Prefer const/let over var
- Use template literals for string interpolation
- Include proper error handling with try/catch
```

### How to Use Prompt Files
| Action | Command | Example |
|--------|---------|---------|
| **Reference Prompt File** | `#prompt:filename` | `#prompt:code-review check this function` |
| **Add Context** | Click ➕ in chat input | Select prompt file from context menu |
| **Create New Prompt** | Save `.prompt.md` in `.github/prompts/` | Custom prompts appear in `#prompt:` suggestions |

**Reference:** [Customize Chat Responses in VS Code](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-chat-context)

---

## Remember
- **Copilot is a tool, you're the developer** - Always review and understand generated code
- **Context is key** - The more context you provide, the better the suggestions
- **Experiment freely** - Try different prompting styles to see what works best
- **Stay curious** - Use Copilot to explore new patterns and approaches