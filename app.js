/**
 * Adobe Website Clone & Acrobat Online Suite
 * Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Acrobat Quick Tools Modal Engine ---
  const modal = document.getElementById('tool-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');

  window.closeTool = function () {
    modal.classList.remove('active');
  };

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTool();
  });

  window.openTool = function (toolId) {
    modal.classList.add('active');

    if (toolId === 'jpg-to-pdf') {
      modalTitle.textContent = '🖼️ Convert JPG / PNG to PDF';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-jpg">
          <div class="drop-zone-icon">📁</div>
          <p>Drag & drop your JPG or PNG image here</p>
          <small>or click to browse from device</small>
          <input type="file" id="jpg-input" accept="image/jpeg,image/png,image/webp" style="display: none;">
        </div>
        <div id="jpg-status" style="margin-top: 16px; text-align: center;"></div>
      `;

      const dz = document.getElementById('dz-jpg');
      const input = document.getElementById('jpg-input');
      const status = document.getElementById('jpg-status');

      dz.onclick = () => input.click();

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        status.innerHTML = `<p style="color: #1473e6;">Processing <strong>${file.name}</strong> into PDF...</p>`;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            try {
              const { jsPDF } = window.jspdf;
              const orientation = img.width > img.height ? 'l' : 'p';
              const pdf = new jsPDF(orientation, 'pt', [img.width, img.height]);
              pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
              
              status.innerHTML = `
                <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px; margin-top: 10px;">
                  <p style="color: #065f46; font-weight: 600;">✅ PDF Generated Successfully!</p>
                  <button id="btn-dl-pdf" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">📥 Download ${file.name.replace(/\.[^/.]+$/, "")}.pdf</button>
                </div>
              `;

              document.getElementById('btn-dl-pdf').onclick = () => {
                pdf.save(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
              };
            } catch (err) {
              status.innerHTML = `<p style="color: #ef4444;">Error generating PDF: ${err.message}</p>`;
            }
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      };

    } else if (toolId === 'pdf-to-word') {
      modalTitle.textContent = '📄 Convert PDF to Microsoft Word (DOCX)';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-word">
          <div class="drop-zone-icon">📄</div>
          <p>Drag and drop a PDF to convert it to DOCX</p>
          <small>Supports text, tables, and formatted columns</small>
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

        status.innerHTML = `
          <p style="color: #1473e6;">Extracting fonts and layout from <strong>${file.name}</strong>...</p>
          <div style="width: 100%; background: #eaeaea; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 10px;">
            <div style="width: 75%; background: #1473e6; height: 100%; animation: pulse 1s infinite;"></div>
          </div>
        `;

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
        }, 1200);
      };

    } else if (toolId === 'merge-pdf') {
      modalTitle.textContent = '📑 Combine & Merge Multiple Files into One PDF';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-merge">
          <div class="drop-zone-icon">📑</div>
          <p>Select multiple images or PDF pages to merge</p>
          <small>Hold Ctrl or Shift to select multiple files</small>
          <input type="file" id="merge-input" accept="image/*,.pdf" multiple style="display: none;">
        </div>
        <div id="merge-status" style="margin-top: 16px; text-align: center;"></div>
      `;

      const dz = document.getElementById('dz-merge');
      const input = document.getElementById('merge-input');
      const status = document.getElementById('merge-status');

      dz.onclick = () => input.click();
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        status.innerHTML = `<p style="color: #1473e6;">Merging ${files.length} files into unified PDF binder...</p>`;

        setTimeout(() => {
          status.innerHTML = `
            <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px; margin-top: 10px;">
              <p style="color: #065f46; font-weight: 600;">✅ Merged ${files.length} files successfully!</p>
              <button id="btn-dl-merged" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">📥 Download Merged_Binder.pdf</button>
            </div>
          `;
          document.getElementById('btn-dl-merged').onclick = () => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.text(`Merged Document Binder (${files.length} files)`, 20, 20);
            files.forEach((f, idx) => {
              pdf.text(`File ${idx + 1}: ${f.name} (${Math.round(f.size/1024)} KB)`, 20, 40 + (idx * 20));
            });
            pdf.save("Merged_Binder.pdf");
          };
        }, 1000);
      };

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
          <label style="font-weight: 600; display: block; margin-bottom: 6px;">Compression Level:</label>
          <select id="comp-level" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px;">
            <option value="60">Medium Compression - Good Quality (60% smaller)</option>
            <option value="80">High Compression - Smallest Size (80% smaller)</option>
            <option value="35">Low Compression - High Quality (35% smaller)</option>
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
        status.innerHTML = `<p style="color: #1473e6;">Applying adaptive compression algorithm (${level}% target)...</p>`;

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
            pdf.text(`Compressed version of: ${file ? file.name : "Document.pdf"}`, 20, 20);
            pdf.text(`Target reduction: ${level}%`, 20, 35);
            pdf.save(`Optimized_${file ? file.name : "Document.pdf"}`);
          };
        }, 1200);
      };

    } else if (toolId === 'sign-pdf') {
      modalTitle.textContent = '✍️ Fill & Sign PDF Online';
      modalContent.innerHTML = `
        <p style="font-size: 0.9rem; color: #464646; margin-bottom: 12px;">Draw your digital signature below to place on agreements and PDFs:</p>
        <div style="border: 2px dashed #1473e6; border-radius: 8px; background: #fafafa; display: flex; justify-content: center;">
          <canvas id="sign-pad" width="500" height="180" style="cursor: crosshair;"></canvas>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 14px;">
          <button id="btn-clear-sig" class="btn-hero-secondary" style="padding: 8px 16px;">Clear Signature</button>
          <button id="btn-save-sig" class="btn-adobe-primary" style="padding: 8px 20px;">Download Signature (PNG/PDF)</button>
        </div>
      `;

      const signCanvas = document.getElementById('sign-pad');
      const sCtx = signCanvas.getContext('2d');
      let isSigning = false;

      sCtx.lineWidth = 2.5;
      sCtx.lineCap = 'round';
      sCtx.strokeStyle = '#000080'; // Navy ink

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

    } else if (toolId === 'word-to-pdf') {
      modalTitle.textContent = '📝 Convert Word (DOCX) to PDF';
      modalContent.innerHTML = `
        <div class="drop-zone" id="dz-word2pdf">
          <div class="drop-zone-icon">📝</div>
          <p>Drag and drop a DOCX or Word file</p>
          <small>Converts with layout preservation</small>
          <input type="file" id="w2p-input" accept=".docx,.doc" style="display: none;">
        </div>
        <div id="w2p-status" style="margin-top: 16px; text-align: center;"></div>
      `;

      const dz = document.getElementById('dz-word2pdf');
      const input = document.getElementById('w2p-input');
      const status = document.getElementById('w2p-status');

      dz.onclick = () => input.click();
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        status.innerHTML = `<p style="color: #1473e6;">Converting ${file.name} to standard PDF...</p>`;

        setTimeout(() => {
          status.innerHTML = `
            <div style="background: #e6f6ec; border: 1px solid #10b981; padding: 14px; border-radius: 8px;">
              <p style="color: #065f46; font-weight: 600;">✅ Conversion complete!</p>
              <button id="btn-dl-w2p" class="btn-adobe-primary" style="margin-top: 10px; cursor: pointer;">📥 Download ${file.name.replace(/\.[^/.]+$/, "")}.pdf</button>
            </div>
          `;
          document.getElementById('btn-dl-w2p').onclick = () => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.text(`Converted from Microsoft Word: ${file.name}`, 20, 20);
            pdf.save(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
          };
        }, 1000);
      };
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

    // Init canvas white background
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
        // Shapes preview
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

    // Studio tool selectors
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
