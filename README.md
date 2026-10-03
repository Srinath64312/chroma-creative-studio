# 🔴 Adobe Website Clone & Acrobat Online Suite

A full-featured, responsive **Adobe official website clone** ([adobe.com](https://www.adobe.com/)) with a rich suite of **functional in-browser Acrobat PDF tools, AI utilities, and Creative Cloud Web simulators**.

---

## 🌟 Live Demo
👉 **[https://srinath64312.github.io/chroma-creative-studio/](https://srinath64312.github.io/chroma-creative-studio/)**

---

## ✨ Features Overview

### 1. 🖼️ Multi-Photo to PDF Converter (Batch Multi-Select)
- Select multiple photos (JPG, PNG, WebP) simultaneously via file dialog or drag & drop.
- Interactive thumbnail gallery with individual deletion, page count indicators, and reordering.
- Custom page formatting: Auto dimensions, A4 Portrait, A4 Landscape, and customizable margins.
- Compiles all photos into a single multi-page PDF document using client-side `jsPDF`.

### 2. 📖 In-Browser Acrobat PDF Reader & Viewer
- High-fidelity PDF document rendering powered by `PDF.js`.
- Interactive toolbar: Page navigation (Previous/Next), zoom in/out, 90° orientation rotation.
- Built-in sample document preloaded for instant testing, plus local PDF file upload capability.

### 3. 🧽 Smart Watermark Remover
- Interactive content-aware inpainting canvas brush to erase watermarks, stamps, date stamps, and logos.
- Automatically samples surrounding pixel colors and synthesizes background textures.
- Download cleaned images without watermarks.

### 4. 🤖 AI Text Humanizer & Bypass Engine
- Converts robotic AI-generated text (ChatGPT, Claude, Gemini) into organic, natural human writing.
- Strips repetitive AI cliches (*"in the ever-evolving landscape", "testament to", "delve into", "tapestry of", "moreover"*).
- Injects natural sentence length variance (burstiness), contractions, and fluid transitions.
- Real-time AI detection probability meter dropping from 98% down to 3%.

### 5. 🎭 Creative Cloud Utilities & Document Security
- **Word to PDF (DOCX to PDF)**: In-browser conversion of Microsoft Word (`.docx`) files into high-quality PDFs with live document sheet preview powered by `Mammoth.js` and `html2pdf.js`.
- **Background Remover**: One-click subject cutout to export transparent PNGs.
- **Fill & Sign PDF**: Digital ink signature canvas pad with PNG/PDF download.
- **PDF to Word (DOCX)**: In-browser conversion of documents into editable formats.
- **Merge & Combine PDFs**: Bind multiple files into a single unified PDF.
- **Compress PDF**: Adaptive file reduction targets (35%, 60%, 80%).
- **Split & Rotate PDF**: Page extraction and 90°/180° page re-orientation.
- **Password Protect PDF**: Document security and encryption layer.

### 6. ✨ Adobe Firefly AI Generative Playground
- Interactive prompt box with sample prompt suggestions (Neon Cyberpunk, Watercolor Astronaut, 3D Isometric).
- Instant generative preview simulator with downloadable high-res artwork.

### 7. 🎨 Integrated Photoshop Web Studio
- In-browser creative canvas suite with brush, line, rectangle, circle, and eraser tools.
- Undo history stack (`Ctrl+Z`), color picker, and high-res PNG export.

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 (Accessible landmarks, SVG icons)
- **Styling**: Vanilla CSS3 (Custom design tokens, Flexbox, CSS Grid, Glassmorphic cards, responsive breakpoints)
- **Logic**: Vanilla JavaScript (ES6+, DOM events, HTML5 Canvas API)
- **Libraries**:
  - [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for client-side Word (`.docx`) document parsing.
  - [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for high-fidelity client-side HTML to PDF generation.
  - [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF document compilation.
  - [PDF.js](https://mozilla.github.io/pdf.js/) for high-fidelity in-browser PDF rendering.

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
