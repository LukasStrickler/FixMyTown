import { describe, expect, it } from 'vitest';
import { parseInterface, checkNestedKeys, findEmptyStrings, parseNested, isNestedDictionary } from './dictionary.test';

describe('Dictionary Validation Tests', () => {
    describe('parseNested', () => {
        it('should parse simple key-value pairs', () => {
            const input = 'key: string; number: string';
            expect(parseNested(input)).toEqual({
                key: '',
                number: ''
            });
        });

        it('should parse nested objects', () => {
            const input = 'parent: { child: string; }';
            expect(parseNested(input)).toEqual({
                parent: {
                    child: ''
                }
            });
        });

        it('should parse string arrays', () => {
            const input = 'items: string[];';
            expect(parseNested(input)).toEqual({
                items: []
            });
        });

        it('should handle numeric keys', () => {
            const input = '1: string; 2: string;';
            expect(parseNested(input)).toEqual({
                '"1"': '',
                '"2"': ''
            });
        });

        it('should parse complex nested structures', () => {
            const input = 'form: { fields: { label: string; options: string[]; } }';
            expect(parseNested(input)).toEqual({
                form: {
                    fields: {
                        label: '',
                        options: []
                    }
                }
            });
        });

        it('should handle name-description objects', () => {
            const input = 'item: { name: string; description: string; }';
            expect(parseNested(input)).toEqual({
                item: {
                    name: '',
                    description: ''
                }
            });
        });
    });

    describe('checkNestedKeys', () => {
        it('should detect missing keys', () => {
            const template = { key1: '', key2: '' };
            const obj = { key1: '' };
            const errors = checkNestedKeys(obj, template);
            expect(errors).toContain('Missing key in dictionary: key2');
        });

        it('should detect missing numeric keys', () => {
            const template = { '"1"': { name: '', description: '' }, '"2"': { name: '', description: '' } };
            const obj = { '"1"': { name: '', description: '' } };
            const errors = checkNestedKeys(obj, template);
            expect(errors).toContain('Missing key in dictionary: 2');
        });

        it('should detect unexpected keys', () => {
            const template = { key1: '' };
            const obj = { key1: '', extra: '' };
            const errors = checkNestedKeys(obj, template);
            expect(errors).toContain('Unexpected key in dictionary: extra');
        });

        it('should validate nested structures', () => {
            const template = { parent: { child: '' } };
            const obj = { parent: '' };
            const errors = checkNestedKeys(obj, template);
            expect(errors).toContain('Type mismatch for key parent: expected object but got string');
        });

        it('should validate array types', () => {
            const template = { items: [] };
            const obj = { items: '' };
            const errors = checkNestedKeys(obj, template);
            expect(errors).toContain('Type mismatch for key items: expected array but got string');
        });

        it('should validate nested array contents', () => {
            const template = { items: { id: '', value: '' } };
            const obj = { items: { id: '', wrongKey: '' } };
            const errors = checkNestedKeys(obj, template);
            expect(errors).toContain('Missing key in dictionary: items.value');
            expect(errors).toContain('Unexpected key in dictionary: items.wrongKey');
        });
    });

    describe('findEmptyStrings', () => {
        it('should find empty strings in flat objects', () => {
            const obj = { key1: '', key2: 'value' };
            expect(findEmptyStrings(obj)).toEqual(['key1']);
        });

        it('should find empty strings in nested objects', () => {
            const obj = {
                parent: {
                    child1: '',
                    child2: 'value'
                }
            };
            expect(findEmptyStrings(obj)).toEqual(['parent.child1']);
        });

        it('should find empty strings in arrays', () => {
            const obj = {
                items: ['', 'value', '']
            };
            expect(findEmptyStrings(obj)).toEqual(['items[0]', 'items[2]']);
        });

        it('should handle complex nested structures', () => {
            const obj = {
                form: {
                    fields: {
                        label: '',
                        options: ['', 'option1', '']
                    }
                }
            };
            expect(findEmptyStrings(obj)).toEqual([
                'form.fields.label',
                'form.fields.options[0]',
                'form.fields.options[2]'
            ]);
        });
    });

    describe('isNestedDictionary', () => {
        it('should return true for valid nested dictionaries', () => {
            expect(isNestedDictionary({ key: 'value' })).toBe(true);
            expect(isNestedDictionary({ nested: { key: 'value' } })).toBe(true);
        });

        it('should return false for non-dictionary values', () => {
            expect(isNestedDictionary(null)).toBe(false);
            expect(isNestedDictionary([])).toBe(false);
            expect(isNestedDictionary('string')).toBe(false);
            expect(isNestedDictionary(123)).toBe(false);
        });
    });

    describe('parseInterface', () => {
        it('should parse interface content correctly', () => {
            const interfaceContent = `
                interface Dictionary {
                    key1: string;
                    nested: {
                        key2: string;
                    }
                }
            `;
            expect(parseInterface(interfaceContent)).toEqual({
                key1: '',
                nested: {
                    key2: ''
                }
            });
        });

        it('should handle comments in interface', () => {
            const interfaceContent = `
                interface Dictionary {
                    // This is a comment
                    key1: string;
                    /* Multi-line
                       comment */
                    key2: string;
                }
            `;
            expect(parseInterface(interfaceContent)).toEqual({
                key1: '',
                key2: ''
            });
        });

        it('should return empty object when interface is not found', () => {
            const content = 'interface WrongInterface {}';
            expect(parseInterface(content)).toEqual({});
        });
    });
}); 