// ============================================
// Image Processor - ToolVerse
// Advanced Image Processing Tools
// ============================================

export class ImageProcessor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.originalImage = null;
        this.currentTool = 'resize';
        this.history = [];
        this.historyIndex = -1;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadToolControls('resize');
    }

    setupEventListeners() {
        // File input
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.loadImage(file);
            }
        });

        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tool = btn.dataset.tool;
                this.currentTool = tool;
                this.loadToolControls(tool);
            });
        });

        // Reset and download
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.ctx.drawImage(img, 0, 0);

                // Show editor, hide upload
                document.getElementById('uploadArea').style.display = 'none';
                document.getElementById('editorArea').style.display = 'grid';

                // Update info
                this.updateImageInfo();

                // Reload tool controls with current image dimensions
                this.loadToolControls(this.currentTool);

                // Save to history
                this.saveToHistory();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updateImageInfo() {
        const size = (this.canvas.toDataURL().length * 0.75 / 1024).toFixed(2);
        document.getElementById('imageSize').textContent = `Size: ${size} KB`;
        document.getElementById('imageDimensions').textContent =
            `Dimensions: ${this.canvas.width} × ${this.canvas.height}px`;
        const format = this.originalImage.src.substring(5, this.originalImage.src.indexOf(';')).toUpperCase();
        document.getElementById('imageFormat').textContent = `Format: ${format}`;
    }

    saveToHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(this.canvas.toDataURL());
        this.historyIndex++;
    }

    reset() {
        if (this.originalImage) {
            this.canvas.width = this.originalImage.width;
            this.canvas.height = this.originalImage.height;
            this.ctx.drawImage(this.originalImage, 0, 0);
            this.updateImageInfo();
            this.saveToHistory();
        }
    }

    download() {
        // Detect image format from original image or default to PNG
        let format = 'png';
        let mimeType = 'image/png';

        if (this.originalImage && this.originalImage.src) {
            const srcFormat = this.originalImage.src.substring(5, this.originalImage.src.indexOf(';'));
            if (srcFormat.includes('jpeg') || srcFormat.includes('jpg')) {
                format = 'jpg';
                mimeType = 'image/jpeg';
            } else if (srcFormat.includes('webp')) {
                format = 'webp';
                mimeType = 'image/webp';
            }
        }

        const filename = `toolverse-${this.currentTool}-${Date.now()}.${format}`;

        // Use blob for better browser compatibility
        this.canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Failed to create blob');
                return;
            }

            // Force download by using application/octet-stream
            const downloadBlob = new Blob([blob], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(downloadBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';

            // Append to body to ensure it works
            document.body.appendChild(link);
            link.click();

            // Show feedback
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                const originalHTML = downloadBtn.innerHTML;
                downloadBtn.innerHTML = '<span>✓</span><span>Saved!</span>';
                setTimeout(() => {
                    downloadBtn.innerHTML = originalHTML;
                }, 2000);
            }

            // Clean up after short delay
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        }, mimeType, 0.95);
    }

    loadToolControls(tool) {
        const controlsContainer = document.getElementById('toolControls');
        const toolTitle = document.getElementById('toolTitle');

        const toolConfigs = {
            resize: {
                title: 'Resize Image',
                controls: `
                    <div class="control-group">
                        <label class="control-label">
                            Width (px)
                            <span class="control-value" id="widthValue">${this.canvas?.width || 800}</span>
                        </label>
                        <input type="range" class="slider" id="widthSlider" 
                               min="100" max="${Math.max(4000, (this.canvas?.width || 800) * 4)}" value="${this.canvas?.width || 800}">
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Height (px)
                            <span class="control-value" id="heightValue">${this.canvas?.height || 600}</span>
                        </label>
                        <input type="range" class="slider" id="heightSlider" 
                               min="100" max="${Math.max(4000, (this.canvas?.height || 600) * 4)}" value="${this.canvas?.height || 600}">
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="maintainAspect">
                        <label for="maintainAspect">Maintain aspect ratio</label>
                    </div>
                    <div class="info-box">
                        ⚡ Fast browser-based resizing with high quality output
                    </div>
                `
            },
            compress: {
                title: 'Compress Image',
                controls: `
                    <div class="control-group">
                        <label class="control-label">
                            Quality
                            <span class="control-value" id="qualityValue">80%</span>
                        </label>
                        <input type="range" class="slider" id="qualitySlider" 
                               min="1" max="100" value="80">
                    </div>
                    <div class="control-group">
                        <label class="control-label">Format</label>
                        <select class="control-input" id="compressFormat">
                            <option value="image/jpeg">JPEG (smaller file)</option>
                            <option value="image/png">PNG (lossless)</option>
                            <option value="image/webp">WEBP (best compression)</option>
                        </select>
                    </div>
                    <button class="apply-btn" id="applyCompress">Compress Now</button>
                    <div class="info-box">
                        💾 Reduce file size while maintaining visual quality
                    </div>
                `
            },
            convert: {
                title: 'Convert Format',
                controls: `
                    <div class="control-group">
                        <label class="control-label">Output Format</label>
                        <div class="button-group">
                            <button class="action-btn" data-format="png">PNG</button>
                            <button class="action-btn" data-format="jpeg">JPEG</button>
                            <button class="action-btn" data-format="webp">WEBP</button>
                            <button class="action-btn" data-format="bmp">BMP</button>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Quality (for JPEG/WEBP)
                            <span class="control-value" id="convertQualityValue">90%</span>
                        </label>
                        <input type="range" class="slider" id="convertQuality" 
                               min="1" max="100" value="90">
                    </div>
                    <div class="info-box">
                        🔄 Convert between image formats instantly
                    </div>
                `
            },
            crop: {
                title: 'Crop Image',
                controls: `
                    <div class="control-group">
                        <label class="control-label">Preset Ratios</label>
                        <div class="button-group">
                            <button class="action-btn" data-ratio="1:1">1:1</button>
                            <button class="action-btn" data-ratio="4:3">4:3</button>
                            <button class="action-btn" data-ratio="16:9">16:9</button>
                            <button class="action-btn" data-ratio="free">Free</button>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Crop Amount (%)
                            <span class="control-value" id="cropValue">20%</span>
                        </label>
                        <input type="range" class="slider" id="cropSlider" 
                               min="5" max="50" value="20">
                    </div>
                    <button class="apply-btn" id="applyCrop">Apply Crop</button>
                    <div class="info-box">
                        ✂️ Crop from all sides or use preset ratios
                    </div>
                `
            },
            rotate: {
                title: 'Rotate & Flip',
                controls: `
                    <div class="control-group">
                        <label class="control-label">Rotate</label>
                        <div class="button-group">
                            <button class="action-btn" id="rotate90">↻ 90°</button>
                            <button class="action-btn" id="rotate180">↻ 180°</button>
                            <button class="action-btn" id="rotate270">↻ 270°</button>
                            <button class="action-btn" id="rotateCustom">Custom</button>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Custom Angle
                            <span class="control-value" id="angleValue">0°</span>
                        </label>
                        <input type="range" class="slider" id="angleSlider" 
                               min="0" max="360" value="0">
                    </div>
                    <div class="control-group">
                        <label class="control-label">Flip</label>
                        <div class="button-group">
                            <button class="action-btn" id="flipH">⟷ Horizontal</button>
                            <button class="action-btn" id="flipV">⟱ Vertical</button>
                        </div>
                    </div>
                    <div class="info-box">
                        🔃 Rotate and flip with precision
                    </div>
                `
            },
            filters: {
                title: 'Image Filters',
                controls: `
                    <div class="control-group">
                        <label class="control-label">Apply Filter</label>
                        <div class="button-group">
                            <button class="action-btn" id="grayscale">Grayscale</button>
                            <button class="action-btn" id="sepia">Sepia</button>
                            <button class="action-btn" id="invert">Invert</button>
                            <button class="action-btn" id="vintage">Vintage</button>
                            <button class="action-btn" id="cool">Cool</button>
                            <button class="action-btn" id="warm">Warm</button>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Filter Intensity
                            <span class="control-value" id="filterIntensityValue">100%</span>
                        </label>
                        <input type="range" class="slider" id="filterIntensity" 
                               min="0" max="100" value="100">
                    </div>
                    <button class="apply-btn" id="resetFilters">Reset Filters</button>
                    <div class="info-box">
                        🎨 Apply beautiful filters and color effects
                    </div>
                `
            },
            blur: {
                title: 'Blur Effects',
                controls: `
                    <div class="control-group">
                        <label class="control-label">
                            Blur Amount
                            <span class="control-value" id="blurValue">5px</span>
                        </label>
                        <input type="range" class="slider" id="blurSlider" 
                               min="0" max="50" value="5">
                    </div>
                    <div class="control-group">
                        <label class="control-label">Blur Type</label>
                        <div class="button-group">
                            <button class="action-btn active" id="gaussianBlur">Gaussian</button>
                            <button class="action-btn" id="motionBlur">Motion</button>
                        </div>
                    </div>
                    <button class="apply-btn" id="applyBlur">Apply Blur</button>
                    <div class="info-box">
                        💨 Add blur effects for artistic results
                    </div>
                `
            },
            adjust: {
                title: 'Brightness & Contrast',
                controls: `
                    <div class="control-group">
                        <label class="control-label">
                            Brightness
                            <span class="control-value" id="brightnessValue">0</span>
                        </label>
                        <input type="range" class="slider" id="brightnessSlider" 
                               min="-100" max="100" value="0">
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Contrast
                            <span class="control-value" id="contrastValue">0</span>
                        </label>
                        <input type="range" class="slider" id="contrastSlider" 
                               min="-100" max="100" value="0">
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Saturation
                            <span class="control-value" id="saturationValue">0</span>
                        </label>
                        <input type="range" class="slider" id="saturationSlider" 
                               min="-100" max="100" value="0">
                    </div>
                    <button class="apply-btn" id="applyAdjust">Apply Adjustments</button>
                    <div class="info-box">
                        ☀️ Fine-tune image brightness and colors
                    </div>
                `
            },
            metadata: {
                title: 'View Metadata',
                controls: `
                    <div class="info-box">
                        <strong>Image Information:</strong><br>
                        <div id="metadataDisplay" style="margin-top: 12px; font-family: monospace; font-size: 0.75rem;">
                            Load an image to view metadata
                        </div>
                    </div>
                    <button class="apply-btn" id="removeMetadata">Strip All Metadata</button>
                    <div class="info-box">
                        ℹ️ View and remove EXIF data for privacy
                    </div>
                `
            },
            watermark: {
                title: 'Add Watermark',
                controls: `
                    <div class="control-group">
                        <label class="control-label">Watermark Text</label>
                        <input type="text" class="control-input" id="watermarkText" 
                               placeholder="Enter watermark text" value="© ToolVerse">
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Position
                        </label>
                        <div class="button-group">
                            <button class="action-btn" data-pos="tl">Top Left</button>
                            <button class="action-btn" data-pos="tr">Top Right</button>
                            <button class="action-btn active" data-pos="bl">Bottom Left</button>
                            <button class="action-btn" data-pos="br">Bottom Right</button>
                            <button class="action-btn" data-pos="center">Center</button>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Opacity
                            <span class="control-value" id="watermarkOpacityValue">50%</span>
                        </label>
                        <input type="range" class="slider" id="watermarkOpacity" 
                               min="10" max="100" value="50">
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            Font Size
                            <span class="control-value" id="fontSizeValue">24px</span>
                        </label>
                        <input type="range" class="slider" id="fontSize" 
                               min="12" max="72" value="24">
                    </div>
                    <button class="apply-btn" id="applyWatermark">Add Watermark</button>
                    <div class="info-box">
                        📝 Protect your images with custom watermarks
                    </div>
                `
            }
        };

        const config = toolConfigs[tool];
        toolTitle.textContent = config.title;
        controlsContainer.innerHTML = config.controls;

        // Attach tool-specific event listeners
        this.attachToolListeners(tool);
    }

    attachToolListeners(tool) {
        const methods = {
            resize: () => this.setupResizeTool(),
            compress: () => this.setupCompressTool(),
            convert: () => this.setupConvertTool(),
            crop: () => this.setupCropTool(),
            rotate: () => this.setupRotateTool(),
            filters: () => this.setupFiltersTool(),
            blur: () => this.setupBlurTool(),
            adjust: () => this.setupAdjustTool(),
            metadata: () => this.setupMetadataTool(),
            watermark: () => this.setupWatermarkTool()
        };

        if (methods[tool]) {
            methods[tool]();
        }
    }

    // ============================================
    // RESIZE TOOL
    // ============================================
    setupResizeTool() {
        const widthSlider = document.getElementById('widthSlider');
        const heightSlider = document.getElementById('heightSlider');
        const widthValue = document.getElementById('widthValue');
        const heightValue = document.getElementById('heightValue');
        const maintainAspect = document.getElementById('maintainAspect');

        if (!this.originalImage) return;

        const aspectRatio = this.originalImage.width / this.originalImage.height;

        widthSlider.addEventListener('input', (e) => {
            const width = parseInt(e.target.value);
            widthValue.textContent = width;

            if (maintainAspect.checked) {
                const height = Math.round(width / aspectRatio);
                heightSlider.value = height;
                heightValue.textContent = height;
            }

            this.resizeImage(width, parseInt(heightSlider.value));
        });

        heightSlider.addEventListener('input', (e) => {
            const height = parseInt(e.target.value);
            heightValue.textContent = height;

            if (maintainAspect.checked) {
                const width = Math.round(height * aspectRatio);
                widthSlider.value = width;
                widthValue.textContent = width;
            }

            this.resizeImage(parseInt(widthSlider.value), height);
        });
    }

    resizeImage(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(this.originalImage, 0, 0, width, height);
        this.updateImageInfo();
    }

    // ============================================
    // COMPRESS TOOL
    // ============================================
    setupCompressTool() {
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        const compressFormat = document.getElementById('compressFormat');
        const applyBtn = document.getElementById('applyCompress');

        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value + '%';
        });

        applyBtn.addEventListener('click', () => {
            const quality = parseFloat(qualitySlider.value) / 100;
            const format = compressFormat.value;

            const compressedData = this.canvas.toDataURL(format, quality);
            const img = new Image();
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0);
                this.updateImageInfo();
                this.saveToHistory();
            };
            img.src = compressedData;
        });
    }

    // ============================================
    // CONVERT TOOL
    // ============================================
    setupConvertTool() {
        const formatBtns = document.querySelectorAll('[data-format]');
        const qualitySlider = document.getElementById('convertQuality');
        const qualityValue = document.getElementById('convertQualityValue');

        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value + '%';
        });

        formatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                formatBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const format = btn.dataset.format;
                const quality = parseFloat(qualitySlider.value) / 100;

                let mimeType;
                switch (format) {
                    case 'png': mimeType = 'image/png'; break;
                    case 'jpeg': mimeType = 'image/jpeg'; break;
                    case 'webp': mimeType = 'image/webp'; break;
                    case 'bmp': mimeType = 'image/bmp'; break;
                }

                const convertedData = this.canvas.toDataURL(mimeType, quality);
                const img = new Image();
                img.onload = () => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0);
                    this.updateImageInfo();
                };
                img.src = convertedData;
            });
        });
    }

    // ============================================
    // CROP TOOL
    // ============================================
    setupCropTool() {
        const cropSlider = document.getElementById('cropSlider');
        const cropValue = document.getElementById('cropValue');
        const applyCropBtn = document.getElementById('applyCrop');

        cropSlider.addEventListener('input', (e) => {
            cropValue.textContent = e.target.value + '%';
        });

        applyCropBtn.addEventListener('click', () => {
            const cropPercent = parseInt(cropSlider.value) / 100;
            const cropX = this.canvas.width * cropPercent;
            const cropY = this.canvas.height * cropPercent;

            const newWidth = this.canvas.width - (cropX * 2);
            const newHeight = this.canvas.height - (cropY * 2);

            const imageData = this.ctx.getImageData(cropX, cropY, newWidth, newHeight);

            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.ctx.putImageData(imageData, 0, 0);

            this.updateImageInfo();
            this.saveToHistory();
        });
    }

    // ============================================
    // ROTATE TOOL
    // ============================================
    setupRotateTool() {
        const rotate90 = document.getElementById('rotate90');
        const rotate180 = document.getElementById('rotate180');
        const rotate270 = document.getElementById('rotate270');
        const angleSlider = document.getElementById('angleSlider');
        const angleValue = document.getElementById('angleValue');
        const flipH = document.getElementById('flipH');
        const flipV = document.getElementById('flipV');

        const rotateImage = (angle) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            if (angle === 90 || angle === 270) {
                tempCanvas.width = this.canvas.height;
                tempCanvas.height = this.canvas.width;
            } else {
                tempCanvas.width = this.canvas.width;
                tempCanvas.height = this.canvas.height;
            }

            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tempCtx.rotate(angle * Math.PI / 180);
            tempCtx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2);

            this.canvas.width = tempCanvas.width;
            this.canvas.height = tempCanvas.height;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(tempCanvas, 0, 0);

            this.updateImageInfo();
            this.saveToHistory();
        };

        rotate90.addEventListener('click', () => rotateImage(90));
        rotate180.addEventListener('click', () => rotateImage(180));
        rotate270.addEventListener('click', () => rotateImage(270));

        angleSlider.addEventListener('change', (e) => {
            const angle = parseInt(e.target.value);
            angleValue.textContent = angle + '°';
            rotateImage(angle);
        });

        angleSlider.addEventListener('input', (e) => {
            angleValue.textContent = e.target.value + '°';
        });

        flipH.addEventListener('click', () => {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.canvas, -this.canvas.width, 0);
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.saveToHistory();
        });

        flipV.addEventListener('click', () => {
            this.ctx.scale(1, -1);
            this.ctx.drawImage(this.canvas, 0, -this.canvas.height);
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.saveToHistory();
        });
    }

    // ============================================
    // FILTERS TOOL
    // ============================================
    setupFiltersTool() {
        const filterBtns = {
            grayscale: document.getElementById('grayscale'),
            sepia: document.getElementById('sepia'),
            invert: document.getElementById('invert'),
            vintage: document.getElementById('vintage'),
            cool: document.getElementById('cool'),
            warm: document.getElementById('warm')
        };

        const applyFilter = (filterName) => {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                switch (filterName) {
                    case 'grayscale':
                        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                        data[i] = data[i + 1] = data[i + 2] = gray;
                        break;
                    case 'sepia':
                        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                        break;
                    case 'invert':
                        data[i] = 255 - r;
                        data[i + 1] = 255 - g;
                        data[i + 2] = 255 - b;
                        break;
                    case 'vintage':
                        data[i] = r * 1.2;
                        data[i + 1] = g * 0.9;
                        data[i + 2] = b * 0.8;
                        break;
                    case 'cool':
                        data[i] = r * 0.9;
                        data[i + 1] = g * 1.0;
                        data[i + 2] = b * 1.2;
                        break;
                    case 'warm':
                        data[i] = Math.min(255, r * 1.2);
                        data[i + 1] = g * 1.0;
                        data[i + 2] = b * 0.8;
                        break;
                }
            }

            this.ctx.putImageData(imageData, 0, 0);
            this.saveToHistory();
        };

        Object.keys(filterBtns).forEach(filterName => {
            filterBtns[filterName].addEventListener('click', () => {
                applyFilter(filterName);
            });
        });

        document.getElementById('resetFilters').addEventListener('click', () => {
            this.reset();
        });
    }

    // ============================================
    // BLUR TOOL
    // ============================================
    setupBlurTool() {
        const blurSlider = document.getElementById('blurSlider');
        const blurValue = document.getElementById('blurValue');
        const applyBlurBtn = document.getElementById('applyBlur');

        blurSlider.addEventListener('input', (e) => {
            blurValue.textContent = e.target.value + 'px';
        });

        applyBlurBtn.addEventListener('click', () => {
            const blurAmount = parseInt(blurSlider.value);
            this.ctx.filter = `blur(${blurAmount}px)`;
            this.ctx.drawImage(this.canvas, 0, 0);
            this.ctx.filter = 'none';
            this.saveToHistory();
        });
    }

    // ============================================
    // ADJUST TOOL
    // ============================================
    setupAdjustTool() {
        const brightnessSlider = document.getElementById('brightnessSlider');
        const contrastSlider = document.getElementById('contrastSlider');
        const saturationSlider = document.getElementById('saturationSlider');
        const applyBtn = document.getElementById('applyAdjust');

        brightnessSlider.addEventListener('input', (e) => {
            document.getElementById('brightnessValue').textContent = e.target.value;
        });

        contrastSlider.addEventListener('input', (e) => {
            document.getElementById('contrastValue').textContent = e.target.value;
        });

        saturationSlider.addEventListener('input', (e) => {
            document.getElementById('saturationValue').textContent = e.target.value;
        });

        applyBtn.addEventListener('click', () => {
            const brightness = parseInt(brightnessSlider.value);
            const contrast = parseInt(contrastSlider.value);
            const saturation = parseInt(saturationSlider.value);

            this.ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%)`;
            this.ctx.drawImage(this.canvas, 0, 0);
            this.ctx.filter = 'none';
            this.saveToHistory();
        });
    }

    // ============================================
    // METADATA TOOL
    // ============================================
    setupMetadataTool() {
        if (this.canvas && this.canvas.width > 0) {
            const metadata = `
                Filename: ${this.originalImage ? 'uploaded-image' : 'N/A'}<br>
                Dimensions: ${this.canvas.width} × ${this.canvas.height} pixels<br>
                File Size: ${(this.canvas.toDataURL().length * 0.75 / 1024).toFixed(2)} KB<br>
                Color Space: RGB<br>
                Created: ${new Date().toLocaleString()}
            `;
            document.getElementById('metadataDisplay').innerHTML = metadata;
        }

        document.getElementById('removeMetadata').addEventListener('click', () => {
            // Canvas already strips metadata, just re-export
            const cleanData = this.canvas.toDataURL('image/png');
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
                alert('✓ Metadata removed! Download image to save cleaned version.');
            };
            img.src = cleanData;
        });
    }

    // ============================================
    // WATERMARK TOOL
    // ============================================
    setupWatermarkTool() {
        const watermarkText = document.getElementById('watermarkText');
        const opacitySlider = document.getElementById('watermarkOpacity');
        const fontSizeSlider = document.getElementById('fontSize');
        const applyBtn = document.getElementById('applyWatermark');
        const posBtns = document.querySelectorAll('[data-pos]');

        let selectedPos = 'bl';

        posBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                posBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedPos = btn.dataset.pos;
            });
        });

        opacitySlider.addEventListener('input', (e) => {
            document.getElementById('watermarkOpacityValue').textContent = e.target.value + '%';
        });

        fontSizeSlider.addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
        });

        applyBtn.addEventListener('click', () => {
            const text = watermarkText.value;
            const opacity = parseFloat(opacitySlider.value) / 100;
            const fontSize = parseInt(fontSizeSlider.value);

            this.ctx.font = `bold ${fontSize}px Inter, sans-serif`;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.5})`;
            this.ctx.lineWidth = 2;

            const textWidth = this.ctx.measureText(text).width;
            const padding = 20;

            let x, y;
            switch (selectedPos) {
                case 'tl':
                    x = padding;
                    y = padding + fontSize;
                    break;
                case 'tr':
                    x = this.canvas.width - textWidth - padding;
                    y = padding + fontSize;
                    break;
                case 'bl':
                    x = padding;
                    y = this.canvas.height - padding;
                    break;
                case 'br':
                    x = this.canvas.width - textWidth - padding;
                    y = this.canvas.height - padding;
                    break;
                case 'center':
                    x = (this.canvas.width - textWidth) / 2;
                    y = this.canvas.height / 2;
                    break;
            }

            this.ctx.strokeText(text, x, y);
            this.ctx.fillText(text, x, y);

            this.saveToHistory();
        });
    }
}

// Initialize the image processor when DOM is ready

