# Dictionary Arrays Usage Guidelines

## When to Avoid Arrays in Dictionaries

Arrays in dictionary files should generally be avoided as they break the declarative nature of our internationalization system. Using arrays makes it harder to:

- Maintain a clear one-to-one mapping between keys and translations
- Track missing translations
- Perform automated validation
- Keep translations consistent across languages

## Acceptable Use Cases

Arrays should only be used in specific cases where content naturally varies between languages, such as:

- Legal documents (Terms of Service, Privacy Policy)
- Content that requires different formatting or structure per language
- Lists that may have different numbers of items based on regional requirements

### Example:
```json
"legalBasisTitle": "Legal Basis of Processing",
"legalBasisDescription": [
    "Art. 6 Para. 1 lit. a DSGVO – Consent.",
    "Art. 6 Para. 1 lit. b DSGVO – Contract fulfillment.",
    "Art. 6 Para. 1 lit. c DSGVO – Legal obligation.",
    "Art. 6 Para. 1 lit. f DSGVO – Legitimate interest."
],
```

## Best Practices

For most cases, prefer using named keys instead of arrays:
```json
{
    "welcome": {
        "heading": "Welcome",
        "subheading": "Get started",
        "cta": "Continue"
    }
}
```
This maintains a clear structure and makes it easier to manage translations across the application.

## Pull Request Guidelines

Pull requests that introduce arrays in dictionary files without meeting the acceptable use cases outlined above should be declined. Instead, request a restructuring of the dictionary using named keys.

### Example of what to avoid:
```json
{
    "errorMessages": [
        "Please fill out this field",
        "Invalid email format",
        "Password too short"
    ]
}
```

### Correct implementation:
```json
{
    "errorMessages": {
        "required": "Please fill out this field",
        "invalidEmail": "Invalid email format",
        "passwordTooShort": "Password too short"
    }
}
```

This ensures maintainability and follows our internationalization best practices.