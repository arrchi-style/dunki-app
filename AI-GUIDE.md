# 🤖 AI-Assisted Development Guide

This project is optimized for AI-augmented development (GitHub Copilot, Cursor, etc.). To ensure the AI generates code that aligns with our modern Angular 21, Zoneless, and Nx architecture, please follow these guidelines.

## 🛠 AI Configuration
We use a global ruleset located in `.github/copilot-instructions.md`. Ensure your AI agent (Copilot or Cursor) is referencing this file for every request.

## 📝 Effective Prompting Patterns

### Generating New Features
Avoid generic "write code for..." prompts. Use structural requests:
> "Generate a new [Feature Name] in `libs/`. Split it into `data-access` (services, models) and `ui` (standalone components). Use Angular Signals for state and `inject()` for dependencies."

### Writing Unit Tests (Vitest)
Standard AI suggestions often include heavy `TestBed` configurations. Use this prompt to keep tests lightweight:
> "Write unit tests for `[FileName].component.ts`. Test Signal states directly. Avoid heavy `TestBed` boilerplate where possible. Use Vitest for execution."

## 🛑 AI Guardrails (What to Reject)
If the AI suggests any of the following, please **reject** the suggestion and ask for a correction:
- **RxJS/BehaviorSubject** for component state → **Demand Signals**.
- **Constructor Injection** → **Demand `inject()` function**.
- **Zone.js or `async` pipe** → We are a **Zoneless** environment.
- **Inline Templates/Styles** → We follow **Separation of Concerns** (.ts, .html, .scss).
- **Relative Imports** → Use **Nx Path Aliases** (e.g., `@dunki-app/shared/models`).

---

## 🏗 Architecture Reference
- **State:** `signal()`, `computed()`, `effect()`, `linkedSignal()`.
- **Control Flow:** `@if`, `@for`, `@switch`.
- **Backend:** Node.js (Real-time/WebSockets) & .NET (Business/Finance logic).