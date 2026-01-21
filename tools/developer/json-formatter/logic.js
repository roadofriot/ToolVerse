/**
 * JSON Formatter - Core Logic
 * @module JSONFormatterLogic
 */

export const JSONFormatterLogic = {
    /**
     * Format a JSON string with specified indentation.
     * @param {string} jsonString - The raw JSON string.
     * @param {number} indent - Number of spaces for indentation (default 4).
     * @returns {string} Formatted JSON string.
     * @throws {Error} If JSON is invalid.
     */
    format(jsonString, indent = 4) {
        if (!jsonString || jsonString.trim() === '') {
            return '';
        }
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, indent);
        } catch (error) {
            throw new Error(`Invalid JSON: ${error.message}`);
        }
    },

    /**
     * Minify a JSON string (remove whitespace).
     * @param {string} jsonString - The raw JSON string.
     * @returns {string} Minified JSON string.
     * @throws {Error} If JSON is invalid.
     */
    minify(jsonString) {
        if (!jsonString || jsonString.trim() === '') {
            return '';
        }
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed);
        } catch (error) {
            throw new Error(`Invalid JSON: ${error.message}`);
        }
    },

    /**
     * Validate a JSON string.
     * @param {string} jsonString 
     * @returns {object} { isValid: boolean, error: string|null }
     */
    validate(jsonString) {
        if (!jsonString || jsonString.trim() === '') {
            return { isValid: false, error: 'Empty input' };
        }
        try {
            JSON.parse(jsonString);
            return { isValid: true, error: null };
        } catch (error) {
            return { isValid: false, error: error.message };
        }
    }
};
