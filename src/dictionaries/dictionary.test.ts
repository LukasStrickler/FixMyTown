import { describe, expect, it } from 'vitest';
import { type Dictionary } from './dictionary';
import germanDictionary from './de.json';
import fs from 'fs';
import path from 'path';

interface NestedDictionary {
    [key: string]: string | NestedDictionary;
}

function parseNested(str: string): NestedDictionary {
    const obj: NestedDictionary = {};
    let currentKey = '';
    let buffer = '';

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char === '{') {
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
                obj[currentKey] = parseNested(nestedContent);
                currentKey = '';
            }
        } else if (char === '}') {
        } else if (char === ':') {
            currentKey = buffer.trim();
            buffer = '';
        } else if (char === ',' || char === ';') {
            if (currentKey && buffer.trim() === 'string') {
                obj[currentKey] = '';
                currentKey = '';
            }
            buffer = '';
        } else {
            buffer += char;
        }
    }

    return obj;
}

describe('Dictionary Type Check', () => {
    it('should have all required keys from Dictionary interface', () => {
        const interfaceContent = fs.readFileSync(
            path.join(__dirname, 'dictionary.ts'),
            'utf-8'
        );

        function parseInterface(content: string): NestedDictionary {
            content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
                .replace(/\s+/g, ' ');

            const startIndex = content.indexOf('interface Dictionary {');
            if (startIndex === -1) {
                console.error('Could not find interface Dictionary');
                return {};
            }

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

            const interfaceContent = content.slice(startIndex, endIndex);
            const interfaceBody = interfaceContent.slice(interfaceContent.indexOf('{') + 1, -1);

            // console.log('Interface content:', interfaceBody);
            const result = parseNested(interfaceBody);
            // console.log('Parsed result:', JSON.stringify(result, null, 2));
            return result;
        }

        const template = parseInterface(interfaceContent);
        // console.log('Final template:', JSON.stringify(template, null, 2));

        const checkNestedKeys = (
            obj: NestedDictionary,
            template: NestedDictionary,
            path: string[] = []
        ): string[] => {
            const errors: string[] = [];

            for (const key in template) {
                const currentPath = [...path, key];
                const pathStr = currentPath.join('.');

                if (!(key in obj)) {
                    errors.push(`Missing key in dictionary: ${pathStr}`);
                    continue;
                }

                if (typeof template[key] === 'object' && template[key] !== null) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        errors.push(...checkNestedKeys(
                            obj[key],
                            template[key],
                            currentPath
                        ));
                    } else {
                        errors.push(`Type mismatch for key ${currentPath.join('.')}: expected object but got ${typeof obj[key]}`);
                    }
                }
            }

            for (const key in obj) {
                const currentPath = [...path, key];
                const pathStr = currentPath.join('.');

                if (!(key in template)) {
                    errors.push(`Unexpected key in dictionary: ${pathStr}`);
                }
            }

            return errors;
        };

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
        const findEmptyStrings = (obj: NestedDictionary, path: string[] = []): string[] => {
            const emptyPaths: string[] = [];

            for (const key in obj) {
                const currentPath = [...path, key];

                if (typeof obj[key] === 'string') {
                    if (obj[key].trim() === '') {
                        emptyPaths.push(currentPath.join('.'));
                    }
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