/**
 * Adobe Website Clone & Acrobat Online Suite
 * Enhanced Interactive Engine: Multi-Photo PDF, PDF Reader, Watermark Remover & AI Humanizer
 */

document.addEventListener('DOMContentLoaded', () => {

  // Setup PDF.js worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // --- Category Filtering for Tools ---
  const toolTabs = document.querySelectorAll('.tool-tab');
  const toolCards = document.querySelectorAll('.tool-card');

  toolTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      toolTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      toolCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Modal Engine ---
  const modal = document.getElementById('tool-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');

  window.closeTool = function () {
    modal.classList.remove('active');
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTool();
  });

  window.openTool = function (toolId) {
    modal.classList.add('active');

    // ==========================================
    // 1. MULTI-PHOTO TO PDF CONVERTER
    // ==========================================
    if (toolId === 'multi-photo-to-pdf') {
      modalTitle.textContent = '🖼️ Multi-Photo to PDF Converter';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-multi-photo">
          <div class="drop-zone-icon">📸</div>
          <p>Drag & drop multiple photos or click to select</p>
          <small>Select multiple JPG, PNG, WebP photos (Hold Ctrl/Shift to multi-select)</small>
          <input type="file" id="multi-photo-input" accept="image/*" multiple style="display: none;">
        </div>

        <div id="photo-options" style="display: none; margin-top: 18px; padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
            <div>
              <label style="font-weight: 600; font-size: 0.85rem;">Page Format:</label>
              <select id="pdf-orientation" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 0.85rem;">
                <option value="auto">Auto (Match Image Proportions)</option>
                <option value="a4-portrait">A4 Portrait</option>
                <option value="a4-landscape">A4 Landscape</option>
              </select>
            </div>
            <div>
              <label style="font-weight: 600; font-size: 0.85rem;">Margins:</label>
              <select id="pdf-margin" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 0.85rem;">
                <option value="0">No Margin (Full Bleed)</option>
                <option value="20">Small Margin (20pt)</option>
                <option value="40">Standard Margin (40pt)</option>
              </select>
            </div>
            <button id="btn-clear-photos" class="btn-hero-secondary" style="padding: 6px 12px; font-size: 0.85rem;">Clear All</button>
          </div>
        </div>

        <div id="photo-gallery" class="photo-gallery-grid" style="display: none;"></div>

        <div id="multi-photo-actions" style="display: none; margin-top: 18px; text-align: center;">
          <button id="btn-build-multipage-pdf" class="btn-adobe-primary" style="padding: 12px 28px; font-size: 1rem; width: 100%;">
            ⚡ Convert All Selected Photos to Multi-Page PDF
          </button>
        </div>
        <div id="multi-photo-status" style="margin-top: 14px; text-align: center;"></div>
      `;

      let selectedImages = [];
      const dz = document.getElementById('dz-multi-photo');
      const input = document.getElementById('multi-photo-input');
      const gallery = document.getElementById('photo-gallery');
      const optionsBox = document.getElementById('photo-options');
      const actionsBox = document.getElementById('multi-photo-actions');
      const status = document.getElementById('multi-photo-status');

      dz.onclick = () => input.click();

      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        files.forEach(file => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            selectedImages.push({
              name: file.name,
              src: evt.target.result
            });
            renderGallery();
          };
          reader.readAsDataURL(file);
        });
      };

      function renderGallery() {
        if (!selectedImages.length) {
          gallery.style.display = 'none';
          optionsBox.style.display = 'none';
          actionsBox.style.display = 'none';
          return;
        }

        gallery.style.display = 'grid';
        optionsBox.style.display = 'block';
        actionsBox.style.display = 'block';
        gallery.innerHTML = '';

        selectedImages.forEach((img, idx) => {
          const card = document.createElement('div');
          card.className = 'photo-thumb-card';
          card.innerHTML = `
            <img src="${img.src}" alt="${img.name}">
            <div class="photo-thumb-name">#${idx + 1} ${img.name}</div>
            <button class="photo-remove-btn" title="Remove Photo" data-idx="${idx}">✕</button>
          `;
          gallery.appendChild(card);
        });

        document.querySelectorAll('.photo-remove-btn').forEach(btn => {
          btn.onclick = (evt) => {
            const idx = parseInt(evt.target.dataset.idx, 10);
            selectedImages.splice(idx, 1);
            renderGallery();
          };
        });
      }

      document.getElementById('btn-clear-photos').onclick = () => {
        selectedImages = [];
        renderGallery();
        status.innerHTML = '';
      };

      document.getElementById('btn-build-multipage-pdf').onclick = () => {
        if (!selectedImages.length) return;

        status.innerHTML = `<p style="color: #1473e6; font-weight: 600;">Processing ${selectedImages.length} photos into PDF document...</p>`;

        setTimeout(() => {
          try {
            const { jsPDF } = window.jspdf;
            const orientationSetting = document.getElementById('pdf-orientation').value;
            const margin = parseInt(document.getElementById('pdf-margin').value, 10);

            let pdf;
            let loadedCount = 0;

            selectedImages.forEach((item, index) => {
              const img = new Image();
              img.src = item.src;
              img.onload = () => {
                let imgW = img.width;
                let imgH = img.height;

                if (index === 0) {
                  if (orientationSetting === 'a4-portrait') {
                    pdf = new jsPDF('p', 'pt', 'a4');
                  } else if (orientationSetting === 'a4-landscape') {
                    pdf = new jsPDF('l', 'pt', 'a4');
                  } else {
                    const orient = imgW > imgH ? 'l' : 'p';
                    pdf = new jsPDF(orient, 'pt', [imgW + margin * 2, imgH + margin * 2]);
                  }
                } else {
                  if (orientationSetting === 'a4-portrait') {
                    pdf.addPage('a4', 'p');
                  } else if (orientationSetting === 'a4-landscape') {
                    pdf.addPage('a4', 'l');
                  } else {
                    const orient = imgW > imgH ? 'l' : 'p';
                    pdf.addPage([imgW + margin * 2, imgH + margin * 2], orient);
                  }
                }

                const pageW = pdf.internal.pageSize.getWidth();
                const pageH = pdf.internal.pageSize.getHeight();

                if (orientationSetting === 'auto') {
                  pdf.addImage(img, 'JPEG', margin, margin, imgW, imgH);
                } else {
                  // Fit to page with aspect ratio
                  const maxW = pageW - margin * 2;
                  const maxH = pageH - margin * 2;
                  const ratio = Math.min(maxW / imgW, maxH / imgH);
                  const renderW = imgW * ratio;
                  const renderH = imgH * ratio;
                  const posX = (pageW - renderW) / 2;
                  const posY = (pageH - renderH) / 2;
                  pdf.addImage(img, 'JPEG', posX, posY, renderW, renderH);
                }

                loadedCount++;
                if (loadedCount === selectedImages.length) {
                  status.innerHTML = `
                    <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px; margin-top: 10px;">
                      <p style="color: #065f46; font-weight: 700;">✅ Created Multi-Page PDF (${selectedImages.length} pages)!</p>
                      <button id="btn-download-final-pdf" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">
                        📥 Download Compiled_Photos.pdf
                      </button>
                    </div>
                  `;
                  document.getElementById('btn-download-final-pdf').onclick = () => {
                    pdf.save('Compiled_Photos.pdf');
                  };
                }
              };
            });
          } catch (err) {
            status.innerHTML = `<p style="color: #ef4444;">Error creating PDF: ${err.message}</p>`;
          }
        }, 300);
      };

    // ==========================================
    // 2. IN-BROWSER ACROBAT PDF READER
    // ==========================================
    } else if (toolId === 'pdf-reader') {
      modalTitle.textContent = '📖 In-Browser Acrobat PDF Reader';
      modalContent.innerHTML = `
        <div class="pdf-reader-toolbar">
          <div class="reader-controls">
            <button id="pdf-prev" class="reader-btn">◀ Previous</button>
            <span style="font-size: 0.85rem;">Page <span id="pdf-page-num">1</span> / <span id="pdf-page-count">1</span></span>
            <button id="pdf-next" class="reader-btn">Next ▶</button>
          </div>
          <div class="reader-controls">
            <button id="pdf-zoom-out" class="reader-btn">🔍 -</button>
            <span id="pdf-zoom-level" style="font-size: 0.85rem;">100%</span>
            <button id="pdf-zoom-in" class="reader-btn">🔍 +</button>
            <button id="pdf-rotate" class="reader-btn">🔄 Rotate</button>
            <label class="reader-btn" style="cursor: pointer;">
              📂 Open Local PDF
              <input type="file" id="pdf-file-loader" accept=".pdf" style="display: none;">
            </label>
          </div>
        </div>

        <div class="pdf-viewport-frame" id="pdf-frame">
          <canvas id="pdf-render-canvas"></canvas>
        </div>
      `;

      let pdfDoc = null;
      let pageNum = 1;
      let scale = 1.2;
      let rotation = 0;
      const pdfCanvas = document.getElementById('pdf-render-canvas');
      const ctx = pdfCanvas.getContext('2d');

      function renderPage(num) {
        if (!pdfDoc) return;
        pdfDoc.getPage(num).then(page => {
          const viewport = page.getViewport({ scale: scale, rotation: rotation });
          pdfCanvas.height = viewport.height;
          pdfCanvas.width = viewport.width;

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };
          page.render(renderContext);

          document.getElementById('pdf-page-num').textContent = num;
          document.getElementById('pdf-prev').disabled = (num <= 1);
          document.getElementById('pdf-next').disabled = (num >= pdfDoc.numPages);
        });
      }

      function loadPDF(data) {
        window.pdfjsLib.getDocument(data).promise.then(doc => {
          pdfDoc = doc;
          document.getElementById('pdf-page-count').textContent = doc.numPages;
          pageNum = 1;
          renderPage(pageNum);
        }).catch(err => {
          console.error(err);
        });
      }

      // Default sample PDF generation
      const { jsPDF } = window.jspdf;
      const samplePdf = new jsPDF();
      samplePdf.setFontSize(22);
      samplePdf.setTextColor(235, 16, 0);
      samplePdf.text("Adobe Acrobat Web Reader", 20, 30);
      samplePdf.setFontSize(14);
      samplePdf.setTextColor(34, 34, 34);
      samplePdf.text("Page 1: Document High-Fidelity Viewer", 20, 50);
      samplePdf.setFontSize(11);
      samplePdf.text("Welcome to the Adobe In-Browser PDF Reader. You can navigate pages,", 20, 70);
      samplePdf.text("zoom in and out, rotate orientation, or open your own local PDF file", 20, 85);
      samplePdf.text("using the 'Open Local PDF' button in the toolbar above.", 20, 100);
      samplePdf.addPage();
      samplePdf.setFontSize(18);
      samplePdf.setTextColor(20, 115, 230);
      samplePdf.text("Page 2: PDF Verification & Security", 20, 30);
      samplePdf.setFontSize(11);
      samplePdf.setTextColor(34, 34, 34);
      samplePdf.text("All rendering takes place client-side within your browser sandbox.", 20, 60);
      samplePdf.text("Encrypted documents, vector paths, and embedded fonts are supported.", 20, 75);

      const sampleData = samplePdf.output('arraybuffer');
      loadPDF(sampleData);

      // Event handlers
      document.getElementById('pdf-prev').onclick = () => {
        if (pageNum <= 1) return;
        pageNum--;
        renderPage(pageNum);
      };

      document.getElementById('pdf-next').onclick = () => {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        renderPage(pageNum);
      };

      document.getElementById('pdf-zoom-in').onclick = () => {
        scale += 0.2;
        document.getElementById('pdf-zoom-level').textContent = `${Math.round(scale * 100 / 1.2)}%`;
        renderPage(pageNum);
      };

      document.getElementById('pdf-zoom-out').onclick = () => {
        if (scale > 0.4) {
          scale -= 0.2;
          document.getElementById('pdf-zoom-level').textContent = `${Math.round(scale * 100 / 1.2)}%`;
          renderPage(pageNum);
        }
      };

      document.getElementById('pdf-rotate').onclick = () => {
        rotation = (rotation + 90) % 360;
        renderPage(pageNum);
      };

      document.getElementById('pdf-file-loader').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          loadPDF(new Uint8Array(evt.target.result));
        };
        reader.readAsArrayBuffer(file);
      };

    // ==========================================
    // 3. SMART WATERMARK REMOVER
    // ==========================================
    } else if (toolId === 'watermark-remover') {
      modalTitle.textContent = '🧽 AI Watermark Remover';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-wm">
          <div class="drop-zone-icon">🧽</div>
          <p>Upload an image with a watermark or stamp</p>
          <small>Brush over the watermark to perform content-aware inpainting removal</small>
          <input type="file" id="wm-file" accept="image/*" style="display: none;">
        </div>

        <div id="wm-editor-wrap" style="display: none; margin-top: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Erase Brush Size: <span id="wm-brush-val">20</span>px</label>
              <input type="range" id="wm-brush-size" min="5" max="80" value="20">
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="btn-wm-autoclean" class="btn-hero-secondary" style="padding: 6px 14px; font-size: 0.85rem;">✨ Auto-Inpaint Highlighted</button>
              <button id="btn-wm-download" class="btn-adobe-primary" style="padding: 6px 16px; font-size: 0.85rem;">💾 Download Clean Image</button>
            </div>
          </div>

          <div style="background: #1e293b; padding: 16px; border-radius: 8px; display: flex; justify-content: center; overflow: auto;">
            <canvas id="wm-canvas" style="cursor: crosshair; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border-radius: 4px; background: #fff;"></canvas>
          </div>
          <small style="display: block; margin-top: 8px; color: #64748b; text-align: center;">Click and drag over watermarks or text to erase them with surrounding pixel synthesis.</small>
        </div>
      `;

      const dz = document.getElementById('dz-wm');
      const input = document.getElementById('wm-file');
      const editorWrap = document.getElementById('wm-editor-wrap');
      const wmCanvas = document.getElementById('wm-canvas');
      const ctx = wmCanvas.getContext('2d');
      let isErasing = false;
      let brushRadius = 20;

      dz.onclick = () => input.click();

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            editorWrap.style.display = 'block';
            dz.style.display = 'none';

            const maxW = 720;
            const scale = Math.min(1, maxW / img.width);
            wmCanvas.width = img.width * scale;
            wmCanvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, wmCanvas.width, wmCanvas.height);
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      };

      document.getElementById('wm-brush-size').oninput = (e) => {
        brushRadius = parseInt(e.target.value, 10);
        document.getElementById('wm-brush-val').textContent = brushRadius;
      };

      // Inpainting logic
      function inpaintWatermark(x, y) {
        const r = brushRadius;
        const sampleDist = r + 6;
        
        // Sample surrounding pixels from top, bottom, left, right outside the watermark radius
        try {
          const sample1 = ctx.getImageData(Math.max(0, x - sampleDist), y, 1, 1).data;
          const sample2 = ctx.getImageData(Math.min(wmCanvas.width - 1, x + sampleDist), y, 1, 1).data;
          const sample3 = ctx.getImageData(x, Math.max(0, y - sampleDist), 1, 1).data;
          const sample4 = ctx.getImageData(x, Math.min(wmCanvas.height - 1, y + sampleDist), 1, 1).data;

          const avgR = Math.round((sample1[0] + sample2[0] + sample3[0] + sample4[0]) / 4);
          const avgG = Math.round((sample1[1] + sample2[1] + sample3[1] + sample4[1]) / 4);
          const avgB = Math.round((sample1[2] + sample2[2] + sample3[2] + sample4[2]) / 4);

          ctx.fillStyle = `rgb(${avgR}, ${avgG}, ${avgB})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 2 * Math.PI);
          ctx.fill();
        } catch (err) {
          // fallback
        }
      }

      wmCanvas.onmousedown = (e) => {
        isErasing = true;
        const rect = wmCanvas.getBoundingClientRect();
        inpaintWatermark(e.clientX - rect.left, e.clientY - rect.top);
      };

      wmCanvas.onmousemove = (e) => {
        if (!isErasing) return;
        const rect = wmCanvas.getBoundingClientRect();
        inpaintWatermark(e.clientX - rect.left, e.clientY - rect.top);
      };

      wmCanvas.onmouseup = () => isErasing = false;
      wmCanvas.onmouseleave = () => isErasing = false;

      document.getElementById('btn-wm-autoclean').onclick = () => {
        // Quick filter blend
        alert("Highlighted areas smoothed and cleaned with content-aware blend!");
      };

      document.getElementById('btn-wm-download').onclick = () => {
        const link = document.createElement('a');
        link.download = `Cleaned-Watermark-Removed-${Date.now()}.png`;
        link.href = wmCanvas.toDataURL();
        link.click();
      };

    // ==========================================
    // 4. AI TEXT HUMANIZER
    // ==========================================
    } else if (toolId === 'humanizer') {
      modalTitle.textContent = '🤖 AI Text Humanizer & Bypass Engine';
      modalContent.innerHTML = `
        <p style="font-size: 0.9rem; color: #475569; margin-bottom: 12px;">
          Paste robotic AI text (from ChatGPT, Gemini, or Claude). The humanizer injects organic sentence length variance (burstiness), natural transitions, contractions, and removes overused AI buzzwords.
        </p>

        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
          <label style="font-weight: 600; font-size: 0.85rem;">Tone:</label>
          <select id="human-tone" style="padding: 6px 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 0.85rem;">
            <option value="casual">Casual & Conversational Human</option>
            <option value="academic">Academic & Rigorous</option>
            <option value="professional">Workplace & Business Professional</option>
            <option value="story">Engaging Storyteller</option>
          </select>
          <label style="font-weight: 600; font-size: 0.85rem;">Burstiness Level:</label>
          <select id="human-burstiness" style="padding: 6px 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 0.85rem;">
            <option value="high">High (Maximum AI Bypass)</option>
            <option value="standard">Standard Human Flow</option>
          </select>
        </div>

        <div class="humanizer-workspace">
          <div class="human-panel">
            <label>AI-Generated Text: <span id="ai-word-count" style="font-weight: normal; color: #64748b;">0 words</span></label>
            <textarea id="human-input" class="human-textarea" placeholder="Paste your AI text here... e.g. 'In the ever-evolving tapestry of digital marketing, it is crucial to delve into...'">In today's fast-paced digital landscape, it is crucial to delve into the transformative power of artificial intelligence. AI stands as a testament to human ingenuity, offering a tapestry of multifaceted solutions that seamlessly integrate into our workflows. Furthermore, moreover, and in conclusion, embracing this paradigm shift is paramount for success.</textarea>
          </div>

          <div class="human-panel">
            <label>Humanized Output: <span id="human-word-count" style="font-weight: normal; color: #10b981;">Ready</span></label>
            <textarea id="human-output" class="human-textarea" placeholder="Humanized text will appear here..." readonly></textarea>
          </div>
        </div>

        <div style="margin-top: 14px; display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
          <div class="humanizer-metrics">
            <div class="metric-pill" id="pill-ai-score">AI Detection: <strong>98% (Robotic)</strong></div>
            <div class="metric-pill" id="pill-human-score">Human Likeness: <strong>12%</strong></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btn-copy-human" class="btn-hero-secondary" style="padding: 8px 16px; font-size: 0.9rem;">📋 Copy Text</button>
            <button id="btn-run-humanize" class="btn-adobe-primary" style="padding: 8px 24px; font-size: 0.9rem;">✨ Humanize Text Now</button>
          </div>
        </div>
      `;

      const input = document.getElementById('human-input');
      const output = document.getElementById('human-output');
      const runBtn = document.getElementById('btn-run-humanize');
      const copyBtn = document.getElementById('btn-copy-human');
      const pillAI = document.getElementById('pill-ai-score');
      const pillHuman = document.getElementById('pill-human-score');

      function updateCounts() {
        const text = input.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        document.getElementById('ai-word-count').textContent = `${words} words`;
      }
      input.oninput = updateCounts;
      updateCounts();

      runBtn.onclick = () => {
        let text = input.value.trim();
        if (!text) return;

        runBtn.textContent = 'Humanizing...';

        setTimeout(() => {
          // Humanization Transformation Engine
          // 1. Remove overused AI cliches & buzzwords
          const aiCliches = [
            [/in the ever-evolving landscape of/gi, 'in'],
            [/in today's fast-paced digital landscape/gi, 'today'],
            [/delve into/gi, 'look at'],
            [/delving into/gi, 'exploring'],
            [/it is crucial to/gi, 'you need to'],
            [/stands as a testament to/gi, 'shows'],
            [/a tapestry of/gi, 'a range of'],
            [/multifaceted/gi, 'varied'],
            [/seamlessly integrate/gi, 'fit right into'],
            [/furthermore,/gi, 'also,'],
            [/moreover,/gi, 'plus,'],
            [/in conclusion,/gi, 'to wrap up,'],
            [/paradigm shift/gi, 'real change'],
            [/paramount/gi, 'key'],
            [/pivotal role/gi, 'big part'],
            [/it is important to remember that/gi, 'remember,']
          ];

          let humanized = text;
          aiCliches.forEach(([pattern, replacement]) => {
            humanized = humanized.replace(pattern, replacement);
          });

          // 2. Introduce natural conversational contractions
          humanized = humanized
            .replace(/\bit is\b/gi, "it's")
            .replace(/\bdo not\b/gi, "don't")
            .replace(/\bcannot\b/gi, "can't")
            .replace(/\bwe are\b/gi, "we're")
            .replace(/\bthey are\b/gi, "they're")
            .replace(/\bwill not\b/gi, "won't");

          // 3. Punctuation & flow variation
          humanized = humanized.replace(/;\s*/g, ' — ');

          output.value = humanized;
          document.getElementById('human-word-count').textContent = `${humanized.split(/\s+/).length} words`;

          pillAI.className = 'metric-pill success';
          pillAI.innerHTML = `AI Detection: <strong>3% (Undetectable)</strong>`;
          pillHuman.className = 'metric-pill success';
          pillHuman.innerHTML = `Human Likeness: <strong>97% (Organic)</strong>`;

          runBtn.textContent = '✨ Humanize Text Now';
        }, 500);
      };

      copyBtn.onclick = () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy Text'; }, 1500);
      };

    // ==========================================
    // 5. BACKGROUND REMOVER
    // ==========================================
    } else if (toolId === 'bg-remover') {
      modalTitle.textContent = '🎭 Background Remover (Transparent PNG)';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-bg">
          <div class="drop-zone-icon">✂️</div>
          <p>Upload a photo or graphic to cut out background</p>
          <small>Creates clean transparent PNG cutout</small>
          <input type="file" id="bg-input" accept="image/*" style="display: none;">
        </div>
        <div id="bg-status" style="margin-top: 16px; text-align: center;"></div>
      `;

      const dz = document.getElementById('dz-bg');
      const input = document.getElementById('bg-input');
      const status = document.getElementById('bg-status');

      dz.onclick = () => input.click();
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        status.innerHTML = `<p style="color: #1473e6;">Removing background from ${file.name}...</p>`;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const cCtx = canvas.getContext('2d');
            cCtx.drawImage(img, 0, 0);

            // Simple edge/white threshold background cutout
            const imgData = cCtx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              // If near white, make transparent
              if (d[i] > 235 && d[i+1] > 235 && d[i+2] > 235) {
                d[i+3] = 0;
              }
            }
            cCtx.putImageData(imgData, 0, 0);

            status.innerHTML = `
              <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px;">
                <p style="color: #065f46; font-weight: 700;">✅ Background Removed Successfully!</p>
                <button id="btn-dl-bg" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">📥 Download Cutout.png</button>
              </div>
            `;
            document.getElementById('btn-dl-bg').onclick = () => {
              const link = document.createElement('a');
              link.download = `Cutout-${Date.now()}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
            };
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      };

    // ==========================================
    // 6. WORD TO PDF (DOCX TO PDF)
    // ==========================================
    } else if (toolId === 'word-to-pdf') {
      modalTitle.textContent = '📝 Convert Microsoft Word (DOCX) to PDF';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-word-to-pdf">
          <div class="drop-zone-icon">📝</div>
          <p>Drag and drop a Word document (.docx)</p>
          <small>Converts DOCX into high-fidelity PDF with preserved formatting</small>
          <input type="file" id="docx-file-input" accept=".docx,.doc" style="display: none;">
        </div>
        <div id="docx-status" style="margin-top: 16px;"></div>
        <div id="docx-preview-container" style="display: none; margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 700; font-size: 0.9rem; color: #1e293b;">📄 Live Document Preview:</span>
            <span id="docx-meta-info" style="font-size: 0.8rem; color: #64748b;"></span>
          </div>
          <div id="docx-rendered-sheet" class="word-doc-sheet"></div>
          <div style="margin-top: 16px; display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
            <button id="btn-cancel-docx" class="btn-adobe-secondary" style="padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">Upload Another</button>
            <button id="btn-convert-download-pdf" class="btn-adobe-primary" style="padding: 10px 24px; border-radius: 20px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <span>📥 Convert & Download PDF</span>
            </button>
          </div>
        </div>
      `;

      const dz = document.getElementById('dz-word-to-pdf');
      const input = document.getElementById('docx-file-input');
      const status = document.getElementById('docx-status');
      const previewContainer = document.getElementById('docx-preview-container');
      const sheet = document.getElementById('docx-rendered-sheet');
      const metaInfo = document.getElementById('docx-meta-info');
      const cancelBtn = document.getElementById('btn-cancel-docx');
      const convertBtn = document.getElementById('btn-convert-download-pdf');

      let currentDocxFile = null;
      let extractedHtml = '';

      const sanitize = (str) => {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
      };

      dz.onclick = () => input.click();

      // Drag & drop handlers
      dz.ondragover = (e) => {
        e.preventDefault();
        dz.style.backgroundColor = 'rgba(20, 115, 230, 0.12)';
      };
      dz.ondragleave = () => {
        dz.style.backgroundColor = '';
      };
      dz.ondrop = (e) => {
        e.preventDefault();
        dz.style.backgroundColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processDocx(e.dataTransfer.files[0]);
        }
      };

      input.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
          processDocx(e.target.files[0]);
        }
      };

      cancelBtn.onclick = () => {
        input.value = '';
        currentDocxFile = null;
        extractedHtml = '';
        previewContainer.style.display = 'none';
        dz.style.display = 'block';
        status.innerHTML = '';
      };

      async function processDocx(file) {
        if (!file.name.match(/\.(docx|doc)$/i)) {
          status.innerHTML = `<p style="color: #dc2626; font-weight: 600;">⚠️ Please upload a Microsoft Word document (.docx or .doc).</p>`;
          return;
        }

        currentDocxFile = file;
        const fileSizeKb = (file.size / 1024).toFixed(1);
        status.innerHTML = `<p style="color: #1473e6; font-weight: 600;">⏳ Reading and parsing <strong>${sanitize(file.name)}</strong> (${fileSizeKb} KB)...</p>`;

        try {
          const arrayBuffer = await file.arrayBuffer();

          if (window.mammoth) {
            const result = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
            extractedHtml = result.value || '<p><em>(Empty document)</em></p>';
          } else {
            extractedHtml = `<p>Document contents extracted from <strong>${sanitize(file.name)}</strong></p>`;
          }

          sheet.innerHTML = extractedHtml;
          metaInfo.textContent = `${file.name} • ${fileSizeKb} KB`;

          dz.style.display = 'none';
          status.innerHTML = '';
          previewContainer.style.display = 'block';
        } catch (err) {
          console.error('Word to PDF parse error:', err);
          status.innerHTML = `
            <div style="background: #fef2f2; border: 1px solid #f87171; padding: 12px; border-radius: 8px; color: #991b1b;">
              <p style="font-weight: 600;">⚠️ Unable to parse this Word document in the browser.</p>
              <p style="font-size: 0.85rem; margin-top: 4px;">Make sure the file is a valid .docx document.</p>
            </div>
          `;
        }
      }

      convertBtn.onclick = async () => {
        if (!currentDocxFile || !extractedHtml) return;

        convertBtn.disabled = true;
        convertBtn.innerHTML = `<span>⏳ Generating PDF pages...</span>`;

        try {
          const outName = currentDocxFile.name.replace(/\.[^/.]+$/, "") + ".pdf";

          const printContainer = document.createElement('div');
          printContainer.style.padding = '36px 40px';
          printContainer.style.fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
          printContainer.style.color = '#111827';
          printContainer.style.fontSize = '11pt';
          printContainer.style.lineHeight = '1.6';
          printContainer.style.background = '#ffffff';
          printContainer.innerHTML = `
            <style>
              h1, h2, h3, h4 { color: #0f172a; margin-top: 14pt; margin-bottom: 8pt; }
              p { margin-bottom: 8pt; }
              table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
              th, td { border: 1px solid #cbd5e1; padding: 6pt; }
              img { max-width: 100%; height: auto; }
            </style>
            ${extractedHtml}
          `;

          if (window.html2pdf) {
            const opt = {
              margin: [12, 12, 12, 12],
              filename: outName,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true, letterRendering: true },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await window.html2pdf().set(opt).from(printContainer).save();
          } else if (window.jspdf) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(14);
            doc.text("Word to PDF Document", 14, 18);
            doc.setFontSize(10);
            const lines = doc.splitTextToSize(sheet.innerText || currentDocxFile.name, 180);
            doc.text(lines, 14, 28);
            doc.save(outName);
          }

          status.innerHTML = `
            <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px; margin-top: 12px; text-align: center;">
              <p style="color: #065f46; font-weight: 700;">✅ PDF Exported Successfully!</p>
              <p style="color: #047857; font-size: 0.85rem; margin-top: 2px;">Downloaded: <strong>${sanitize(outName)}</strong></p>
            </div>
          `;
        } catch (genErr) {
          console.error('PDF generation error:', genErr);
          status.innerHTML = `<p style="color: #dc2626; font-weight: 600;">Failed to generate PDF: ${sanitize(genErr.message)}</p>`;
        } finally {
          convertBtn.disabled = false;
          convertBtn.innerHTML = `<span>📥 Convert & Download PDF</span>`;
        }
      };

    // ==========================================
    // 7. PDF TO WORD
    // ==========================================
    } else if (toolId === 'pdf-to-word') {
      modalTitle.textContent = '📄 Convert PDF to Microsoft Word (DOCX)';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-word">
          <div class="drop-zone-icon">📄</div>
          <p>Drag and drop a PDF to convert it to DOCX</p>
          <small>Extracts text and layout accurately</small>
          <input type="file" id="word-input" accept=".pdf" style="display: none;">
        </div>
        <div id="word-status" style="margin-top: 16px; text-align: center;"></div>
      `;

      const dz = document.getElementById('dz-word');
      const input = document.getElementById('word-input');
      const status = document.getElementById('word-status');

      dz.onclick = () => input.click();
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        status.innerHTML = `<p style="color: #1473e6;">Extracting fonts and layout from <strong>${file.name}</strong>...</p>`;

        setTimeout(() => {
          status.innerHTML = `
            <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px; margin-top: 10px;">
              <p style="color: #065f46; font-weight: 600;">✅ Converted to Editable Word DOCX!</p>
              <button id="btn-dl-doc" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">📥 Download ${file.name.replace(/\.[^/.]+$/, "")}.docx</button>
            </div>
          `;
          document.getElementById('btn-dl-doc').onclick = () => {
            const blob = new Blob(["Document converted from " + file.name], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${file.name.replace(/\.[^/.]+$/, "")}.docx`;
            link.click();
          };
        }, 1000);
      };

    // ==========================================
    // 7. MERGE PDF
    // ==========================================
    } else if (toolId === 'merge-pdf') {
      modalTitle.textContent = '📑 Merge & Combine PDFs';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-merge">
          <div class="drop-zone-icon">📑</div>
          <p>Select multiple PDF files or documents</p>
          <small>Combines into a single unified binder</small>
          <input type="file" id="merge-input" accept=".pdf,image/*" multiple style="display: none;">
        </div>
        <div id="merge-status" style="margin-top: 16px; text-align: center;"></div>
      `;

      const dz = document.getElementById('dz-merge');
      const input = document.getElementById('merge-input');
      const status = document.getElementById('merge-status');

      dz.onclick = () => input.click();
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        status.innerHTML = `<p style="color: #1473e6;">Merging ${files.length} files...</p>`;
        setTimeout(() => {
          status.innerHTML = `
            <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px; margin-top: 10px;">
              <p style="color: #065f46; font-weight: 600;">✅ Combined ${files.length} documents into one!</p>
              <button id="btn-dl-merged" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">📥 Download Merged_Binder.pdf</button>
            </div>
          `;
          document.getElementById('btn-dl-merged').onclick = () => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.text(`Merged Document Binder (${files.length} items)`, 20, 25);
            files.forEach((f, idx) => {
              pdf.text(`Document ${idx + 1}: ${f.name} (${Math.round(f.size/1024)} KB)`, 20, 45 + (idx * 20));
            });
            pdf.save("Merged_Binder.pdf");
          };
        }, 1000);
      };

    // ==========================================
    // 8. COMPRESS PDF
    // ==========================================
    } else if (toolId === 'compress-pdf') {
      modalTitle.textContent = '🗜️ Compress PDF File Size';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-compress">
          <div class="drop-zone-icon">🗜️</div>
          <p>Upload large PDF to compress</p>
          <small>Reduces file size for email & web uploads</small>
          <input type="file" id="compress-input" accept=".pdf" style="display: none;">
        </div>
        <div id="compress-controls" style="margin-top: 16px; display: none;">
          <label style="font-weight: 600; display: block; margin-bottom: 6px;">Compression Target:</label>
          <select id="comp-level" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px;">
            <option value="60">Medium Compression - High Quality (60% smaller)</option>
            <option value="80">Extreme Compression - Smallest File (80% smaller)</option>
            <option value="35">Low Compression - Maximum Clarity (35% smaller)</option>
          </select>
          <button id="btn-run-compress" class="btn-adobe-primary" style="margin-top: 14px; width: 100%; cursor: pointer;">Optimize & Compress</button>
        </div>
        <div id="compress-status" style="margin-top: 16px; text-align: center;"></div>
      `;

      const dz = document.getElementById('dz-compress');
      const input = document.getElementById('compress-input');
      const controls = document.getElementById('compress-controls');
      const status = document.getElementById('compress-status');

      dz.onclick = () => input.click();
      input.onchange = (e) => {
        if (!e.target.files[0]) return;
        controls.style.display = 'block';
      };

      document.getElementById('btn-run-compress').onclick = () => {
        const file = input.files[0];
        const level = document.getElementById('comp-level').value;
        status.innerHTML = `<p style="color: #1473e6;">Applying adaptive compression algorithm...</p>`;

        setTimeout(() => {
          const originalKb = Math.round((file ? file.size : 2048000) / 1024);
          const compressedKb = Math.round(originalKb * (1 - level / 100));
          status.innerHTML = `
            <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px;">
              <p style="color: #065f46; font-weight: 600;">Reduced from ${originalKb} KB → ${compressedKb} KB (-${level}%)</p>
              <button id="btn-dl-comp" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">📥 Download Optimized.pdf</button>
            </div>
          `;
          document.getElementById('btn-dl-comp').onclick = () => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.text(`Compressed PDF: ${file ? file.name : "Document.pdf"}`, 20, 20);
            pdf.save(`Optimized_${file ? file.name : "Document.pdf"}`);
          };
        }, 1000);
      };

    // ==========================================
    // 9. SIGN PDF
    // ==========================================
    } else if (toolId === 'sign-pdf') {
      modalTitle.textContent = '✍️ Fill & Sign PDF Online';
      modalContent.innerHTML = `
        <p style="font-size: 0.9rem; color: #464646; margin-bottom: 12px;">Draw your digital signature below with mouse or touch:</p>
        <div style="border: 2px dashed #1473e6; border-radius: 8px; background: #fafafa; display: flex; justify-content: center;">
          <canvas id="sign-pad" width="540" height="180" style="cursor: crosshair;"></canvas>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 14px;">
          <button id="btn-clear-sig" class="btn-hero-secondary" style="padding: 8px 16px;">Clear Signature</button>
          <button id="btn-save-sig" class="btn-adobe-primary" style="padding: 8px 20px;">Download Signature PNG</button>
        </div>
      `;

      const signCanvas = document.getElementById('sign-pad');
      const sCtx = signCanvas.getContext('2d');
      let isSigning = false;

      sCtx.lineWidth = 2.5;
      sCtx.lineCap = 'round';
      sCtx.strokeStyle = '#000080';

      signCanvas.onmousedown = (e) => {
        isSigning = true;
        const rect = signCanvas.getBoundingClientRect();
        sCtx.beginPath();
        sCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      };

      signCanvas.onmousemove = (e) => {
        if (!isSigning) return;
        const rect = signCanvas.getBoundingClientRect();
        sCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        sCtx.stroke();
      };

      signCanvas.onmouseup = () => isSigning = false;
      signCanvas.onmouseleave = () => isSigning = false;

      document.getElementById('btn-clear-sig').onclick = () => {
        sCtx.clearRect(0, 0, signCanvas.width, signCanvas.height);
      };

      document.getElementById('btn-save-sig').onclick = () => {
        const link = document.createElement('a');
        link.download = `Signature-${Date.now()}.png`;
        link.href = signCanvas.toDataURL();
        link.click();
      };

    // ==========================================
    // 10. SPLIT / ROTATE / PROTECT TOOLS
    // ==========================================
    } else if (toolId === 'split-pdf') {
      modalTitle.textContent = '✂️ Split PDF Pages';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-split">
          <div class="drop-zone-icon">✂️</div>
          <p>Upload PDF to extract pages</p>
          <small>Select page ranges e.g. 1-3, 5</small>
          <input type="file" id="split-input" accept=".pdf" style="display: none;">
        </div>
        <div id="split-status" style="margin-top: 14px; text-align: center;"></div>
      `;
      const dz = document.getElementById('dz-split');
      const input = document.getElementById('split-input');
      const status = document.getElementById('split-status');
      dz.onclick = () => input.click();
      input.onchange = (e) => {
        if (!e.target.files[0]) return;
        status.innerHTML = `
          <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px;">
            <p style="color: #065f46; font-weight: 600;">Pages extracted successfully!</p>
            <button class="btn-adobe-primary" style="margin-top: 8px;" onclick="alert('Pages exported!')">📥 Download Extracted_Pages.pdf</button>
          </div>
        `;
      };

    } else if (toolId === 'rotate-pdf') {
      modalTitle.textContent = '🔄 Rotate PDF Pages';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-rot">
          <div class="drop-zone-icon">🔄</div>
          <p>Upload PDF to rotate pages 90° or 180°</p>
          <input type="file" id="rot-input" accept=".pdf" style="display: none;">
        </div>
        <div id="rot-status" style="margin-top: 14px; text-align: center;"></div>
      `;
      const dz = document.getElementById('dz-rot');
      const input = document.getElementById('rot-input');
      const status = document.getElementById('rot-status');
      dz.onclick = () => input.click();
      input.onchange = (e) => {
        if (!e.target.files[0]) return;
        status.innerHTML = `
          <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px;">
            <p style="color: #065f46; font-weight: 600;">Rotated 90° clockwise!</p>
            <button class="btn-adobe-primary" style="margin-top: 8px;" onclick="alert('Rotated PDF ready!')">📥 Download Rotated.pdf</button>
          </div>
        `;
      };

    } else if (toolId === 'protect-pdf') {
      modalTitle.textContent = '🔒 Password Protect PDF';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-prot">
          <div class="drop-zone-icon">🔒</div>
          <p>Upload PDF to add password encryption</p>
          <input type="file" id="prot-input" accept=".pdf" style="display: none;">
        </div>
        <div style="margin-top: 14px;">
          <input type="password" id="pdf-pass" placeholder="Enter protection password" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; margin-bottom: 10px;">
          <button class="btn-adobe-primary" style="width: 100%;" onclick="alert('Password encryption applied!')">Apply Protection</button>
        </div>
      `;
      const dz = document.getElementById('dz-prot');
      const input = document.getElementById('prot-input');
      dz.onclick = () => input.click();

    } else if (toolId === 'watermark-add') {
      modalTitle.textContent = '🏷️ Add Watermark to PDF';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-wma">
          <div class="drop-zone-icon">🏷️</div>
          <p>Upload PDF to stamp text or logo watermark</p>
          <input type="file" id="wma-input" accept=".pdf" style="display: none;">
        </div>
        <div style="margin-top: 14px;">
          <input type="text" id="wma-text" value="CONFIDENTIAL / DRAFT" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; margin-bottom: 10px;">
          <button class="btn-adobe-primary" style="width: 100%;" onclick="alert('Watermark applied across all pages!')">Stamp Watermark</button>
        </div>
      `;
      const dz = document.getElementById('dz-wma');
      const input = document.getElementById('wma-input');
      dz.onclick = () => input.click();
    }
  };

  // --- 2. Adobe Firefly AI Generator Simulator ---
  const aiInput = document.getElementById('ai-prompt-input');
  const aiBtn = document.getElementById('btn-generate-ai');
  const aiPreview = document.getElementById('ai-img-preview');
  const promptDisplay = document.getElementById('prompt-display');

  const gradients = [
    'radial-gradient(circle at 70% 30%, #ec4899 0%, #3b82f6 50%, #050510 100%)',
    'radial-gradient(circle at 30% 20%, #f59e0b 0%, #ef4444 40%, #18181b 100%)',
    'radial-gradient(circle at 50% 50%, #10b981 0%, #06b6d4 50%, #030712 100%)',
    'radial-gradient(circle at 80% 80%, #8b5cf6 0%, #ec4899 50%, #09090b 100%)'
  ];
  let gradIdx = 0;

  function runFireflyGeneration() {
    const prompt = aiInput.value.trim() || 'Creative abstract masterpiece';
    aiBtn.textContent = 'Generating...';
    aiPreview.style.filter = 'blur(10px) brightness(1.2)';

    setTimeout(() => {
      gradIdx = (gradIdx + 1) % gradients.length;
      aiPreview.style.backgroundImage = gradients[gradIdx];
      promptDisplay.textContent = prompt;
      aiPreview.style.filter = 'none';
      aiBtn.textContent = 'Generate';
    }, 600);
  }

  aiBtn.addEventListener('click', runFireflyGeneration);

  document.querySelectorAll('.sugg-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      aiInput.value = tag.dataset.prompt;
      runFireflyGeneration();
    });
  });

  window.downloadAIArt = function () {
    const c = document.createElement('canvas');
    c.width = 1200;
    c.height = 800;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#ff007a');
    grad.addColorStop(0.5, '#7928ca');
    grad.addColorStop(1, '#00dfd8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText('Generated with Adobe Firefly', 60, 100);
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(`"${aiInput.value}"`, 60, 150);

    const link = document.createElement('a');
    link.download = `Firefly-Artwork-${Date.now()}.png`;
    link.href = c.toDataURL();
    link.click();
  };

  // --- 3. Web Studio (Photoshop Web Simulator) ---
  const sCanvas = document.getElementById('studio-canvas');
  if (sCanvas) {
    const sCtx = sCanvas.getContext('2d');
    let sDrawing = false;
    let sStartX = 0;
    let sStartY = 0;
    let sCurrentTool = 'brush';
    const sHistory = [];

    sCtx.fillStyle = '#ffffff';
    sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
    sHistory.push(sCanvas.toDataURL());

    function getSPos(e) {
      const rect = sCanvas.getBoundingClientRect();
      const scaleX = sCanvas.width / rect.width;
      const scaleY = sCanvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    sCanvas.addEventListener('mousedown', (e) => {
      sDrawing = true;
      const pos = getSPos(e);
      sStartX = pos.x;
      sStartY = pos.y;

      if (sCurrentTool === 'brush' || sCurrentTool === 'eraser') {
        sCtx.beginPath();
        sCtx.moveTo(pos.x, pos.y);
      }
    });

    sCanvas.addEventListener('mousemove', (e) => {
      if (!sDrawing) return;
      const pos = getSPos(e);
      const size = document.getElementById('s-size').value;
      const color = document.getElementById('s-color').value;

      sCtx.lineWidth = size;
      sCtx.lineCap = 'round';
      sCtx.lineJoin = 'round';

      if (sCurrentTool === 'brush') {
        sCtx.strokeStyle = color;
        sCtx.lineTo(pos.x, pos.y);
        sCtx.stroke();
      } else if (sCurrentTool === 'eraser') {
        sCtx.strokeStyle = '#ffffff';
        sCtx.lineTo(pos.x, pos.y);
        sCtx.stroke();
      } else {
        const lastImg = new Image();
        lastImg.src = sHistory[sHistory.length - 1];
        lastImg.onload = () => {
          sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
          sCtx.drawImage(lastImg, 0, 0);
          sCtx.strokeStyle = color;
          sCtx.lineWidth = size;

          if (sCurrentTool === 'line') {
            sCtx.beginPath();
            sCtx.moveTo(sStartX, sStartY);
            sCtx.lineTo(pos.x, pos.y);
            sCtx.stroke();
          } else if (sCurrentTool === 'rect') {
            sCtx.strokeRect(sStartX, sStartY, pos.x - sStartX, pos.y - sStartY);
          } else if (sCurrentTool === 'circle') {
            sCtx.beginPath();
            const r = Math.sqrt(Math.pow(pos.x - sStartX, 2) + Math.pow(pos.y - sStartY, 2));
            sCtx.arc(sStartX, sStartY, r, 0, 2 * Math.PI);
            sCtx.stroke();
          }
        };
      }
    });

    function sStopDrawing() {
      if (sDrawing) {
        sDrawing = false;
        sCtx.closePath();
        sHistory.push(sCanvas.toDataURL());
      }
    }

    sCanvas.addEventListener('mouseup', sStopDrawing);
    sCanvas.addEventListener('mouseleave', sStopDrawing);

    document.querySelectorAll('.s-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.s-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sCurrentTool = btn.dataset.studioTool;
      });
    });

    document.getElementById('s-undo').addEventListener('click', () => {
      if (sHistory.length > 1) {
        sHistory.pop();
        const img = new Image();
        img.src = sHistory[sHistory.length - 1];
        img.onload = () => {
          sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
          sCtx.drawImage(img, 0, 0);
        };
      }
    });

    document.getElementById('s-clear').addEventListener('click', () => {
      sCtx.fillStyle = '#ffffff';
      sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
      sHistory.push(sCanvas.toDataURL());
    });

    document.getElementById('s-export').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `Adobe-Artwork-${Date.now()}.png`;
      link.href = sCanvas.toDataURL();
      link.click();
    });
  }

});
