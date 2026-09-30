# 🔴 Adobe Website Clone & Acrobat Online Suite

A full-featured, responsive **Adobe official website clone** ([adobe.com](https://www.adobe.com/)) built with modern web technologies. This project replicates the iconic Adobe user interface, navigation menus, Creative Cloud product showcases, Firefly AI generative simulator, and provides **functional in-browser Acrobat PDF tools** powered by `jsPDF`.

---

## ✨ Features Overview

### 1. 🌐 Adobe Global Navigation & Design System
- **Iconic Red Adobe Triangle Brand Identity**: Accurate SVG vector logo and styling.
- **Interactive Multi-Level Dropdowns**:
  - *Creativity & Design*: Photoshop, Illustrator, Premiere Pro, InDesign, Adobe Express, and Firefly.
  - *PDF & E-signatures*: Acrobat Web, Convert to PDF, Compress PDF, Merge PDF, and E-Sign.
- **Search, Sign In, and Free Trial Action Headers**.

### 2. ⚡ Acrobat Online Quick Tools (Working In-Browser Processing)
- **🖼️ Convert JPG / PNG to PDF**: Upload images and generate high-resolution downloadable `.pdf` documents directly in the client using `jsPDF`.
- **📄 PDF to Microsoft Word (DOCX)**: Extract layout and convert PDF documents into editable Word files.
- **📑 Merge PDFs**: Combine multiple images or document pages into a unified PDF binder.
- **🗜️ Compress PDF**: Adaptive compression optimization engine with target reduction percentages.
- **✍️ Fill & Sign PDF**: Interactive digital signature canvas pad to draw, clear, and download signatures.
- **📝 Word to PDF**: Convert DOCX documents to standard PDF records.

### 3. ✨ Adobe Firefly AI Generative Playground
- Interactive prompt box with sample prompt suggestions.
- Live generative preview simulator with downloadable high-res artwork.

### 4. 🎨 Integrated Web Studio (Photoshop Web Simulator)
- In-browser creative canvas suite featuring:
  - Brush, Line, Rectangle, Circle, and Eraser tools.
  - Dynamic stroke size and color spectrum picker.
  - Undo history stack, canvas clear, and high-resolution PNG export.

### 5. 📦 Creative Cloud Apps Showcase
- Feature matrix and overview cards for **Photoshop**, **Illustrator**, **Premiere Pro**, and **Acrobat Pro**.

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 (Accessible headings, landmarks, SVG icons)
- **Styling**: Vanilla CSS3 (Custom design tokens, Flexbox, CSS Grid, Glassmorphic cards, responsive breakpoints)
- **Logic**: Vanilla JavaScript (ES6+, DOM events, HTML5 Canvas API)
- **Libraries**: [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF document compilation

---

## 🚀 Getting Started

### Local Setup
No build steps or Node.js runtime required! Simply clone and launch:

```bash
git clone https://github.com/Srinath64312/chroma-creative-studio.git
cd chroma-creative-studio
```

Open `index.html` directly in your browser, or run a lightweight local server:

```bash
# Using Python
python -m http.server 3000

# Using Node / npx
npx serve
```

Then navigate to `http://localhost:3000`.

---

## 📂 Project Architecture

```
chroma-creative-studio/
├── index.html        # Adobe homepage, Acrobat tools, and Firefly UI
├── style.css         # Adobe design system, navigation, and modal styles
├── app.js            # In-browser PDF processing, Firefly AI & canvas engine
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```

---

## 📄 License
This project is open-source and intended for educational, portfolio, and demonstration purposes under the [MIT License](LICENSE).
