# Contributing to ToolVerse

Thank you for your interest in contributing to ToolVerse! We have high standards for code quality, testing, and architecture.

## 🧱 Technical Expectations

When adding a new tool, you **MUST** follow this protocol:

### 1. Tool Architecture (MANDATORY)

For **each tool**, you must:
1. **Define the Purpose**: Clear problem statement.
2. **Specify Inputs & Outputs**: Typed interfaces expected.
3. **Core Logic**: Separate logic from UI (MVC pattern).
4. **Edge Cases**: Handle `null`, `undefined`, empty, and extreme values.
5. **Validation**: Validate all user input before processing.
6. **Performance**: Optimize for 60fps; use Web Workers for heavy tasks.
7. **Tests**: Write unit tests covering >90% of logic.
8. **Documentation**: Inline JSDoc + User Guide.
9. **UI**: Clean, accessible (WCAG), and responsive interface.

### 2. Directory Structure

Organize your tool as follows:
```
tools/
  └── [category]/          # e.g., developer/
      └── [tool-name]/     # e.g., json-formatter/
          ├── index.html   # Tool UI (partial or full)
          ├── logic.js     # Pure JS logic (no DOM)
          ├── ui.js        # DOM manipulation
          ├── style.css    # Tool-specific styles
          └── test.js      # Unit tests
```

### 3. Testing Requirements (CRITICAL)

- **Do not** consider a tool complete until **all tests pass**.
- Logic files should be testable without a browser environment (Polyfills allowed).
- Validate results against known test cases.

### 4. Git Workflow

- Use conventional commits: `feat: add json formatter`, `fix: resize aspect ratio`.
- Branch naming: `feat/tool-name` or `fix/issue-desc`.
- Create a Pull Request with a clear description of changes and test results.

## 🧪 Running Tests

Open `tests/runner.html` in your browser to run the suite.

Thank you for helping build the universe of tools! 🚀
