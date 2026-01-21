import { JSONFormatterLogic } from './logic.js';

export const JSONFormatterUI = {
    render() {
        return `
            <div class="tool-layout-split">
                <div class="input-pane">
                    <h3>Input JSON</h3>
                    <textarea id="jsonInput" placeholder="Paste your JSON here..." spellcheck="false"></textarea>
                    <div class="toolbar">
                        <button id="btnFormat" class="primary-btn">Format</button>
                        <button id="btnMinify" class="secondary-btn">Minify</button>
                        <button id="btnClear" class="text-btn">Clear</button>
                    </div>
                </div>
                <div class="output-pane">
                    <h3>Output</h3>
                    <div id="jsonOutput" class="output-area" readonly></div>
                    <div class="toolbar-bottom">
                        <button id="btnCopy" class="icon-btn" title="Copy to Clipboard">📋 Copy</button>
                    </div>
                </div>
            </div>
            <div id="statusMsg" class="status-message"></div>
        `;
    },

    init(container) {
        // Inject styles if not present
        if (!document.getElementById('json-formatter-css')) {
            const link = document.createElement('link');
            link.id = 'json-formatter-css';
            link.rel = 'stylesheet';
            link.href = 'tools/developer/json-formatter/style.css';
            document.head.appendChild(link);
        }

        container.innerHTML = this.render();

        const input = container.querySelector('#jsonInput');
        const output = container.querySelector('#jsonOutput');
        const status = container.querySelector('#statusMsg');

        // Event Listeners
        container.querySelector('#btnFormat').addEventListener('click', () => {
            try {
                const res = JSONFormatterLogic.format(input.value);
                output.textContent = res;
                output.className = 'output-area success';
                this.showStatus('Formatted successfully', 'success', status);
            } catch (e) {
                output.textContent = e.message;
                output.className = 'output-area error';
                this.showStatus('Invalid JSON', 'error', status);
            }
        });

        container.querySelector('#btnMinify').addEventListener('click', () => {
            try {
                const res = JSONFormatterLogic.minify(input.value);
                output.textContent = res;
                output.className = 'output-area success';
                this.showStatus('Minified successfully', 'success', status);
            } catch (e) {
                output.textContent = e.message;
                output.className = 'output-area error';
                this.showStatus('Invalid JSON', 'error', status);
            }
        });

        container.querySelector('#btnClear').addEventListener('click', () => {
            input.value = '';
            output.textContent = '';
            input.focus();
        });

        container.querySelector('#btnCopy').addEventListener('click', () => {
            if (!output.textContent) return;
            navigator.clipboard.writeText(output.textContent);
            this.showStatus('Copied to clipboard!', 'success', status);
        });
    },

    showStatus(msg, type, el) {
        el.textContent = msg;
        el.className = `status-message ${type} visible`;
        setTimeout(() => {
            el.className = 'status-message';
        }, 2000);
    }
};
