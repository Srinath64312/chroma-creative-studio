# 🎨 Chroma Creative Studio

A lightweight, web-based creative suite and graphic design canvas inspired by Adobe Photoshop and Illustrator. Built with modern web standards, Chroma allows users to create, draw, apply filters, and export digital artwork directly in the browser.

---

## ✨ Features

- **🖌️ Dynamic Drawing Tools**:
  - Pen, Brush, Highlighter, and Eraser tools with customizable stroke size and opacity.
  - Interactive Color Picker with preset palettes and custom hex/RGB selection.
- **📐 Shape Tools**:
  - Insert geometric primitives: Rectangles, Circles/Ellipses, Lines, and Arrows.
- **🪄 Real-Time Filters**:
  - Non-destructive image adjustments: Brightness, Contrast, Saturation, Grayscale, Invert, and Sepia.
- **↩️ History State**:
  - Full Undo / Redo history stack (`Ctrl+Z` / `Ctrl+Y`).
- **💾 Image Import & Export**:
  - Load existing image files (PNG, JPG, WebP) directly onto the canvas.
  - High-resolution export to PNG and JPEG.
- **🌙 Creative Suite UI**:
  - Modern, dark-mode workspace inspired by professional creative applications.

---

## 🛠️ Tech Stack

- **Markup**: HTML5 Canvas API & Semantic UI
- **Styling**: Vanilla CSS3 (Custom properties, flexbox/grid layout, dark-mode glassmorphic theme)
- **Logic**: Vanilla JavaScript (ES6+ modular canvas rendering, state stack, event listeners)

---

## 🚀 Getting Started

### Quick Start
No build tools or installation required. Simply clone and open `index.html`:

```bash
git clone https://github.com/Srinath64312/chroma-creative-studio.git
cd chroma-creative-studio
```

Open `index.html` in your favorite browser, or start a lightweight local server:
```bash
# Using Python
python -m http.server 3000
```
Then navigate to `http://localhost:3000`.

---

## 📂 Project Structure

```
chroma-creative-studio/
├── index.html        # Creative studio UI & canvas workspace
├── style.css         # Adobe-inspired dark mode styling & toolbars
├── app.js            # Canvas rendering engine, tools, history & export
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
