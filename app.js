/**
 * Chroma Creative Studio
 * Core Canvas Engine & Tool System
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('main-canvas');
  const ctx = canvas.getContext('2d');
  const viewport = document.getElementById('viewport');

  // State
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let currentTool = 'brush';
  let brushSize = 5;
  let brushOpacity = 1.0;
  let primaryColor = '#6366f1';

  // History stack for Undo / Redo
  const history = [];
  let historyStep = -1;
  const MAX_HISTORY = 30;

  // Initialize Canvas
  function initCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }

  // Save State
  function saveState() {
    if (historyStep < history.length - 1) {
      history.length = historyStep + 1;
    }
    history.push(canvas.toDataURL());
    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      historyStep++;
    }
  }

  // Restore State
  function restoreState(index) {
    if (index >= 0 && index < history.length) {
      const img = new Image();
      img.src = history[index];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      historyStep = index;
    }
  }

  // Get mouse coordinates relative to canvas
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  // Canvas Mouse Events
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getPos(e);
    startX = pos.x;
    startY = pos.y;

    if (currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      applyStrokeSettings();
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);

    if (currentTool === 'brush' || currentTool === 'eraser') {
      applyStrokeSettings();
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      // Shape preview - restore current step before drawing preview
      const img = new Image();
      img.src = history[historyStep];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        applyStrokeSettings();

        if (currentTool === 'line') {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        } else if (currentTool === 'rect') {
          ctx.beginPath();
          ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
        } else if (currentTool === 'circle') {
          ctx.beginPath();
          const radius = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      };
    }
  });

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
      saveState();
    }
  }

  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  function applyStrokeSettings() {
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.globalAlpha = 1.0;
    } else {
      ctx.strokeStyle = primaryColor;
      ctx.globalAlpha = brushOpacity;
    }
  }

  // Tool Switching
  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      toolButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentTool = btn.dataset.tool;
    });
  });

  // Brush Size & Opacity Controls
  const sizeInput = document.getElementById('brush-size');
  const sizeVal = document.getElementById('size-val');
  sizeInput.addEventListener('input', (e) => {
    brushSize = e.target.value;
    sizeVal.textContent = brushSize;
  });

  const opacityInput = document.getElementById('brush-opacity');
  const opacityVal = document.getElementById('opacity-val');
  opacityInput.addEventListener('input', (e) => {
    brushOpacity = e.target.value / 100;
    opacityVal.textContent = e.target.value;
  });

  // Color Pickers & Swatches
  const colorInput = document.getElementById('primary-color');
  const colorHex = document.getElementById('color-hex');
  colorInput.addEventListener('input', (e) => {
    primaryColor = e.target.value;
    colorHex.textContent = primaryColor;
  });

  document.querySelectorAll('.swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      primaryColor = swatch.dataset.color;
      colorInput.value = primaryColor;
      colorHex.textContent = primaryColor;
    });
  });

  // Undo / Redo
  document.getElementById('btn-undo').addEventListener('click', () => {
    if (historyStep > 0) {
      restoreState(historyStep - 1);
    }
  });

  document.getElementById('btn-redo').addEventListener('click', () => {
    if (historyStep < history.length - 1) {
      restoreState(historyStep + 1);
    }
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      if (historyStep > 0) restoreState(historyStep - 1);
    } else if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      if (historyStep < history.length - 1) restoreState(historyStep + 1);
    }
  });

  // Clear Canvas
  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('Clear the entire canvas?')) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  });

  // Image Upload onto Canvas
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveState();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Export Artwork
  document.getElementById('btn-export').addEventListener('click', () => {
    // If filters applied to viewport, render them into an export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');

    exportCtx.filter = viewport.style.filter || 'none';
    exportCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `chroma-artwork-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  });

  // Adjustments & Filters
  const filterBrightness = document.getElementById('filter-brightness');
  const filterContrast = document.getElementById('filter-contrast');
  const filterSaturation = document.getElementById('filter-saturation');
  const filterBlur = document.getElementById('filter-blur');
  const filterGrayscale = document.getElementById('filter-grayscale');
  const filterInvert = document.getElementById('filter-invert');
  const filterSepia = document.getElementById('filter-sepia');

  function updateFilters() {
    const b = filterBrightness.value;
    const c = filterContrast.value;
    const s = filterSaturation.value;
    const blur = filterBlur.value;
    const gray = filterGrayscale.checked ? 100 : 0;
    const inv = filterInvert.checked ? 100 : 0;
    const sep = filterSepia.checked ? 100 : 0;

    document.getElementById('val-brightness').textContent = b;
    document.getElementById('val-contrast').textContent = c;
    document.getElementById('val-saturation').textContent = s;
    document.getElementById('val-blur').textContent = blur;

    viewport.style.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) blur(${blur}px) grayscale(${gray}%) invert(${inv}%) sepia(${sep}%)`;
  }

  [filterBrightness, filterContrast, filterSaturation, filterBlur].forEach((el) => {
    el.addEventListener('input', updateFilters);
  });
  [filterGrayscale, filterInvert, filterSepia].forEach((el) => {
    el.addEventListener('change', updateFilters);
  });

  document.getElementById('btn-reset-filters').addEventListener('click', () => {
    filterBrightness.value = 100;
    filterContrast.value = 100;
    filterSaturation.value = 100;
    filterBlur.value = 0;
    filterGrayscale.checked = false;
    filterInvert.checked = false;
    filterSepia.checked = false;
    updateFilters();
  });

  // Canvas Resize
  document.getElementById('btn-resize-canvas').addEventListener('click', () => {
    const newW = parseInt(document.getElementById('canvas-w').value, 10);
    const newH = parseInt(document.getElementById('canvas-h').value, 10);
    if (newW > 100 && newH > 100) {
      const tempImg = canvas.toDataURL();
      canvas.width = newW;
      canvas.height = newH;
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveState();
      };
      img.src = tempImg;
    }
  });

  // Start
  initCanvas();
});
