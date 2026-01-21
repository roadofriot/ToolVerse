# Contributing to ToolVerse

Thank you for your interest in contributing to ToolVerse! We welcome contributions from everyone.

## How to Contribute

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/your-username/toolverse.git
cd toolverse
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Follow the existing code style
- Keep changes focused and atomic
- Test your changes thoroughly
- Update documentation if needed

### 4. Commit Your Changes

```bash
git add .
git commit -m "Add: Brief description of your changes"
```

**Commit Message Format:**
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Refactor:` for code refactoring
- `Docs:` for documentation changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Guidelines

### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Keep structure clean and organized

### CSS
- Use CSS custom properties for theming
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Test on multiple browsers

### JavaScript
- Use vanilla JavaScript (no frameworks)
- Keep code modular and well-commented
- Ensure cross-browser compatibility
- Follow ES6+ standards

## Adding New Tools

To add a new tool to a category:

1. Add the tool item in the appropriate category in `index.html`:
   ```html
   <div class="tool-item">
       <span class="tool-icon">🎯</span>
       <span class="tool-name">Your Tool Name</span>
   </div>
   ```

2. (Optional) Create a dedicated page/component for the tool
3. Update README.md if adding a new category

## Reporting Issues

- Use the GitHub issue tracker
- Provide clear description and steps to reproduce
- Include browser/OS information
- Add screenshots if applicable

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow GitHub's Community Guidelines

## Questions?

Feel free to open a discussion or issue if you have questions!

Thank you for contributing to ToolVerse! 🌌
