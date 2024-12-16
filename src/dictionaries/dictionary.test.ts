import { describe, expect, it } from 'vitest';
import { type Dictionary } from './dictionary';
import germanDictionary from './de.json';
import fs from 'fs';
import path from 'path';

/**
 * Represents a nested dictionary structure where values can be either strings or nested dictionaries
 */
interface NestedDictionary {
    [key: string]: string | NestedDictionary;
}

/**
 * Parses a string representation of a nested object structure into a NestedDictionary
 * @param str - The string to parse
 * @returns A NestedDictionary object
 */
function parseNested(str: string): NestedDictionary {
    const obj: NestedDictionary = {};
    let currentKey = '';
    let buffer = '';

    /**
     * Formats a key to ensure numeric keys are properly quoted
     */
    const formatKey = (key: string): string =>
        /^\d+$/.test(key.trim()) ? `"${key.trim()}"` : key.trim();

    /**
     * Creates an object value based on the type definition string
     */
    const createValue = (value: string): string | NestedDictionary => {
        if (value.includes('name: string') && value.includes('description: string')) {
            return { name: '', description: '' };
        }
        if (value === 'string') return '';
        if (value.includes(': {')) return {};
        return value;
    };

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char === '{') {
            // Handle nested object parsing
            buffer = '';
            let nestedContent = '';
            let braceCount = 1;
            i++;

            while (i < str.length && braceCount > 0) {
                const nextChar = str[i];
                if (nextChar === '{') braceCount++;
                if (nextChar === '}') braceCount--;
                if (braceCount > 0) nestedContent += nextChar;
                i++;
            }
            i--;

            if (currentKey) {
                obj[formatKey(currentKey)] = parseNested(nestedContent);
                currentKey = '';
            }
        } else if (char === ':') {
            currentKey = buffer.trim();
            buffer = '';
        } else if (char === ';' || char === ',') {
            if (currentKey) {
                obj[formatKey(currentKey)] = createValue(buffer.trim());
                currentKey = '';
            }
            buffer = '';
        } else if (char !== '}') {
            buffer += char;
        }
    }

    // Handle any remaining buffer content
    if (currentKey && buffer.trim()) {
        obj[formatKey(currentKey)] = createValue(buffer.trim());
    }

    return obj;
}

function extractInterfaceContent(content: string, startIndex: number): string {
    let braceCount = 0;
    let endIndex = startIndex;
    let started = false;

    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            started = true;
        } else if (content[i] === '}') {
            braceCount--;
        }

        if (started && braceCount === 0) {
            endIndex = i + 1;
            break;
        }
    }

    return content.slice(startIndex, endIndex);
}

describe('Dictionary Type Check', () => {
    /**
     * Extracts and parses the Dictionary interface from the source file
     */
    function parseInterface(content: string): NestedDictionary {
        const cleanContent = content
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
            .replace(/\s+/g, ' ');

        const startIndex = cleanContent.indexOf('interface Dictionary {');
        if (startIndex === -1) {
            console.error('Could not find interface Dictionary');
            return {};
        }

        // Extract interface content
        const interfaceContent = extractInterfaceContent(cleanContent, startIndex);
        const interfaceBody = interfaceContent.slice(
            interfaceContent.indexOf('{') + 1,
            -1
        );

        return parseNested(interfaceBody);
    }

    /**
     * Validates that all required keys from the template exist in the dictionary
     * and that there are no unexpected keys
     */
    function checkNestedKeys(
        obj: NestedDictionary,
        template: NestedDictionary,
        path: string[] = []
    ): string[] {
        const errors: string[] = [];

        // Check for missing or mismatched keys
        for (const key in template) {
            const currentPath = [...path, key.replace(/"/g, '')];
            const pathStr = currentPath.join('.');
            const objKey = /^\d+$/.test(key.replace(/"/g, ''))
                ? key.replace(/"/g, '')
                : key;

            if (!(objKey in obj)) {
                errors.push(`Missing key in dictionary: ${pathStr}`);
                continue;
            }

            if (
                typeof template[key] === 'object' &&
                template[key] !== null &&
                (typeof obj[objKey] !== 'object' || obj[objKey] === null)
            ) {
                errors.push(
                    `Type mismatch for key ${pathStr}: expected object but got ${typeof obj[objKey]}`
                );
            } else if (typeof template[key] === 'object' && template[key] !== null) {
                // eslint-disable-next-line 
                errors.push(...checkNestedKeys(obj[objKey] as NestedDictionary, template[key] as NestedDictionary, currentPath));
            }
        }

        // Check for unexpected keys
        for (const key in obj) {
            const currentPath = [...path, key];
            const templateKey = /^\d+$/.test(key) ? `"${key}"` : key;

            if (!(templateKey in template)) {
                errors.push(`Unexpected key in dictionary: ${currentPath.join('.')}`);
            }
        }

        return errors;
    }

    it('should have all required keys from Dictionary interface', () => {
        const interfaceContent = fs.readFileSync(
            path.join(__dirname, 'dictionary.ts'),
            'utf-8'
        );

        const template = parseInterface(interfaceContent);
        const errors = checkNestedKeys(germanDictionary, template);

        if (errors.length > 0) {
            throw new Error(
                'Dictionary structure mismatch:\n' +
                errors.map(error => `- ${error}`).join('\n')
            );
        }

        const typedDictionary: Dictionary = germanDictionary;
        expect(typedDictionary).toBeDefined();
    });

    it('should not have any empty string values', () => {
        /**
         * Recursively finds empty string values in the dictionary
         */
        const findEmptyStrings = (
            obj: NestedDictionary,
            path: string[] = []
        ): string[] => {
            const emptyPaths: string[] = [];

            for (const key in obj) {
                const currentPath = [...path, key];

                if (typeof obj[key] === 'string' && obj[key].trim() === '') {
                    emptyPaths.push(currentPath.join('.'));
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    emptyPaths.push(...findEmptyStrings(obj[key], currentPath));
                }
            }

            return emptyPaths;
        };

        const emptyStrings = findEmptyStrings(germanDictionary);

        if (emptyStrings.length > 0) {
            throw new Error(
                'Empty strings found in dictionary:\n' +
                emptyStrings.map(path => `- ${path}`).join('\n')
            );
        }
    });
});