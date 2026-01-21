# ToolVerse 🌌
> **A universe of useful tools.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

ToolVerse is a fast, reliable, open-source web platform providing daily-use tools for productivity, students, research, developers, professionals, and creators.

## 🚀 Mission

To build a **cleanly architected, well-tested, and scalable** platform where tools work **100% in the browser** (privacy-first). No server-side uploads required.

## 🗂 Categories & Tools

The platform is organized into the following categories:

- **🖼️ Design & Content** (Image Resize, Compress, Crop, Filters...)
- **⚡ Productivity** (Pomodoro, To-Do, Notes...)
- **👨‍💻 Developer** (JSON Formatter, Regex Tester, Base64...)
- **🎓 Student** (Citation Generator, GPA Calculator...)
- **🔧 Utility** (Unit Converter, Password Generator...)
- **🤖 AI Tools** (Client-side AI integrations)

## 🏗 Technical Architecture

- **Core**: HTML5, Vanilla JavaScript (ES2023+), CSS3 (Variables + Flexbox/Grid).
- **Architecture**: Modular, Component-based Tool Registry.
- **Testing**: Automated Unit & Integration tests for every tool.
- **Performance**: Lighthouse score ≥ 90.

## 🛠 Installation & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/roadofriot/ToolVerse.git
   cd ToolVerse
   ```

2. **Run locally**
   Since ToolVerse is a static web application, you can serve it with any static file server.
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js
   npx serve .
   ```

3. **Visit** `http://localhost:8000`

## 🧪 Testing

We strictly adhere to a "Test Everything" policy.
Run the test suite:
```bash
# Open the test runner in your browser
open tests/runner.html
```

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
