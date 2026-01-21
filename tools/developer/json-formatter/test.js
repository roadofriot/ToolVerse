/**
 * JSON Formatter - Unit Tests
 */
import { JSONFormatterLogic } from './logic.js';

const runTests = () => {
    console.group('🧪 JSON Formatter Tests');
    let passed = 0;
    let failed = 0;

    const assert = (condition, message) => {
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${message}`);
            failed++;
        }
    };

    // Test 1: Validation of valid JSON
    const validJSON = '{"key": "value"}';
    assert(JSONFormatterLogic.validate(validJSON).isValid === true, 'Validates correct JSON');

    // Test 2: Validation of invalid JSON
    const invalidJSON = '{"key": "value"'; // Missing bracket
    assert(JSONFormatterLogic.validate(invalidJSON).isValid === false, 'Detects invalid JSON');

    // Test 3: Formatting
    const unformatted = '{"a":1,"b":2}';
    const formatted = JSONFormatterLogic.format(unformatted, 2);
    const expected = '{\n  "a": 1,\n  "b": 2\n}';
    assert(formatted === expected, 'Formats JSON correctly with 2 spaces');

    // Test 4: Minification
    const toMinify = '{\n  "a": 1\n}';
    assert(JSONFormatterLogic.minify(toMinify) === '{"a":1}', 'Minifies JSON correctly');

    // Test 5: Empty Input
    assert(JSONFormatterLogic.format('') === '', 'Handles empty input gracefully');

    console.log(`\n🎉 Summary: ${passed} Passed, ${failed} Failed`);
    console.groupEnd();
    return failed === 0;
};

// Auto-run if loaded in test environment
if (typeof window !== 'undefined') {
    window.runJSONTests = runTests;
}
