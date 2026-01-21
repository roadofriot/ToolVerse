/**
 * ToolVerse Registry
 * Central management for all tools in the universe.
 */

const ToolRegistry = {
    categories: {
        design: {
            id: 'design',
            name: 'Design & Content',
            icon: '🖼️',
            description: 'Image processing and content creation tools.'
        },
        productivity: {
            id: 'productivity',
            name: 'Productivity',
            icon: '⚡',
            description: 'Tools to boost your efficiency and focus.'
        },
        developer: {
            id: 'developer',
            name: 'Developer Tools',
            icon: '👨‍💻',
            description: 'Utilities for coding, debugging, and data formatting.'
        },
        student: {
            id: 'student',
            name: 'Student Tools',
            icon: '🎓',
            description: 'Academic aids for calculations and citations.'
        },
        utility: {
            id: 'utility',
            name: 'Utilities',
            icon: '🔧',
            description: 'General purpose converters and generators.'
        }
    },

    tools: {
        'json-formatter': {
            id: 'json-formatter',
            name: 'JSON Formatter & Validator',
            description: 'Format, validate, and minify JSON data with ease.',
            path: 'tools/developer/json-formatter',
            version: '1.0.0',
            categoryId: 'developer',
            loaded: false
        }
    },

    /**
     * Register a new tool in the universe.
     * @param {string} categoryId - ID of the category.
     * @param {object} toolConfig - Configuration object for the tool.
     */
    register(categoryId, toolConfig) {
        if (!this.categories[categoryId]) {
            console.error(`Category ${categoryId} not found.`);
            return;
        }

        const toolId = toolConfig.id;

        // Validate mandatory fields per protocol
        const required = ['id', 'name', 'description', 'path', 'version'];
        const missing = required.filter(field => !toolConfig[field]);

        if (missing.length > 0) {
            console.error(`Tool ${toolId} missing required fields: ${missing.join(', ')}`);
            return;
        }

        this.tools[toolId] = {
            ...toolConfig,
            categoryId,
            loaded: false
        };

        console.log(`Tool registered: ${toolConfig.name} (${toolId})`);
    },

    /**
     * Get all tools for a specific category.
     * @param {string} categoryId 
     * @returns {Array} List of tools.
     */
    getToolsByCategory(categoryId) {
        return Object.values(this.tools).filter(tool => tool.categoryId === categoryId);
    },

    /**
     * Load a tool's resources dynamically.
     * @param {string} toolId 
     */
    async loadTool(toolId) {
        const tool = this.tools[toolId];
        if (!tool) throw new Error(`Tool ${toolId} not found`);
        if (tool.loaded) return;

        try {
            // Dynamic import of tool logic if separated
            // For now, we assume tools might be monolithic or modular
            // This is a placeholder for dynamic loading logic
            tool.loaded = true;
            console.log(`Tool loaded: ${tool.name}`);
        } catch (error) {
            console.error(`Failed to load tool ${toolId}:`, error);
        }
    }
};

// Export to global scope for now (Vanilla JS architecture)
window.ToolRegistry = ToolRegistry;
