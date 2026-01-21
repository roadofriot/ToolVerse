import { ImageProcessor } from './logic.js';

export const ImageToolsUI = {
    render() {
        return `
            <div class="tool-layout">
                <!-- Tool Selector Sidebar -->
                <aside class="tool-sidebar">
                    <h2>Select Tool</h2>
                    <div class="tool-buttons">
                        <button class="tool-btn active" data-tool="resize">
                            <span class="tool-btn-icon">📐</span>
                            <span class="tool-btn-text">Resize</span>
                        </button>
                        <button class="tool-btn" data-tool="compress">
                            <span class="tool-btn-icon">🗜️</span>
                            <span class="tool-btn-text">Compress</span>
                        </button>
                        <button class="tool-btn" data-tool="convert">
                            <span class="tool-btn-icon">🔄</span>
                            <span class="tool-btn-text">Convert</span>
                        </button>
                        <button class="tool-btn" data-tool="crop">
                            <span class="tool-btn-icon">✂️</span>
                            <span class="tool-btn-text">Crop</span>
                        </button>
                        <button class="tool-btn" data-tool="rotate">
                            <span class="tool-btn-icon">🔃</span>
                            <span class="tool-btn-text">Rotate</span>
                        </button>
                        <button class="tool-btn" data-tool="filters">
                            <span class="tool-btn-icon">⬛</span>
                            <span class="tool-btn-text">Filters</span>
                        </button>
                        <button class="tool-btn" data-tool="blur">
                            <span class="tool-btn-icon">💨</span>
                            <span class="tool-btn-text">Blur</span>
                        </button>
                        <button class="tool-btn" data-tool="adjust">
                            <span class="tool-btn-icon">☀️</span>
                            <span class="tool-btn-text">Adjust</span>
                        </button>
                        <button class="tool-btn" data-tool="metadata">
                            <span class="tool-btn-icon">ℹ️</span>
                            <span class="tool-btn-text">Metadata</span>
                        </button>
                        <button class="tool-btn" data-tool="watermark">
                            <span class="tool-btn-icon">📝</span>
                            <span class="tool-btn-text">Watermark</span>
                        </button>
                    </div>

                    <div class="privacy-badge">
                        <div class="badge-icon">🔒</div>
                        <div class="badge-text">
                            <strong>100% Private</strong>
                            <p>All processing happens in your browser. No uploads.</p>
                        </div>
                    </div>
                </aside>

                <!-- Tool Workspace -->
                <section class="tool-workspace">
                    <!-- Upload Area -->
                    <div id="uploadArea" class="upload-area">
                        <div class="upload-content">
                            <div class="upload-icon">📁</div>
                            <h3>Drop your image here</h3>
                            <p>or click to browse</p>
                            <input type="file" id="fileInput" accept="image/*" hidden>
                            <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
                                Choose Image
                            </button>
                            <div class="supported-formats">
                                Supports: JPG, PNG, WEBP, GIF
                            </div>
                        </div>
                    </div>

                    <!-- Image Editor (Hidden initially) -->
                    <div id="editorArea" class="editor-area" style="display: none;">
                        <!-- Preview Section -->
                        <div class="preview-section">
                            <div class="preview-header">
                                <h3>Preview</h3>
                                <div class="preview-controls">
                                    <button id="resetBtn" class="control-btn">
                                        <span>↻</span>
                                        <span>Reset</span>
                                    </button>
                                    <button id="downloadBtn" class="control-btn download-btn">
                                        <span>⬇</span>
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>

                            <div class="canvas-container">
                                <canvas id="canvas"></canvas>
                            </div>

                            <div class="image-info">
                                <span id="imageSize">Size: -</span>
                                <span id="imageDimensions">Dimensions: -</span>
                                <span id="imageFormat">Format: -</span>
                            </div>
                        </div>

                        <!-- Tool Controls -->
                        <div class="controls-section">
                            <h3 id="toolTitle">Resize Image</h3>

                            <!-- Dynamic Controls Container -->
                            <div id="toolControls" class="tool-controls">
                                <!-- Controls will be injected here based on selected tool -->
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    },

    init(container) {
        // Load styles
        if (!document.getElementById('image-tools-css')) {
            const link = document.createElement('link');
            link.id = 'image-tools-css';
            link.rel = 'stylesheet';
            link.href = 'tools/design/image-tools/style.css';
            document.head.appendChild(link);
        }

        container.innerHTML = this.render();

        // Initialize Logic
        try {
            // Check for subtool param
            const params = new URLSearchParams(window.location.search);
            const subtool = params.get('subtool');

            window.imageProcessor = new ImageProcessor();

            // Activate specific subtool if requested
            if (subtool) {
                setTimeout(() => {
                    const btn = container.querySelector(`.tool-btn[data-tool="${subtool}"]`);
                    if (btn) btn.click();
                }, 50);
            }
        } catch (error) {
            console.error("Failed to init ImageProcessor:", error);
            container.innerHTML += `<p style="color:red">Error: ${error.message}</p>`;
        }
    }
};
