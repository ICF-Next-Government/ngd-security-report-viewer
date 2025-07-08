# Contributing to ICF Security Report Viewer

Thank you for your interest in contributing to the ICF Security Report Viewer! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Adding New Report Formats](#adding-new-report-formats)
- [Documentation](#documentation)

## Code of Conduct

Please be respectful and considerate in all interactions. We strive to maintain a welcoming and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/icf-sarif-viewer.git`
3. Add upstream remote: `git remote add upstream https://github.com/ICF-Next-Government/icf-sarif-viewer.git`
4. Create a feature branch: `git checkout -b feat/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 20.x or higher (see `.nvmrc`)
- Bun package manager
- Git

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run type checking
bun run type-check

# Run linter
bun run lint
```

## Development Workflow

### Branch Naming

- Features: `feat/description`
- Bug fixes: `bug/description`
- Chores: `chore/description`

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Example:
```
feat(parser): add support for new security report format

- Implemented parser for XYZ format
- Added type definitions
- Updated UI to handle new format

Closes #123
```

## Code Style

### General Guidelines

- Use TypeScript for all new code
- Enable strict mode in TypeScript
- Use ES modules
- Prefer functional components with hooks for React
- Use `const` and `let`, avoid `var`

### File Organization

```
src/
├── components/        # React components
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.module.css
│       └── index.tsx
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── constants/        # Application constants
└── test/            # Test setup and utilities
```

### Import Order

1. External dependencies
2. Internal dependencies (absolute paths)
3. Relative imports
4. Type imports

Example:
```typescript
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { ReportParser } from '@/utils/reportParser';
import { ProcessedResult } from '@/types/report';
import './styles.css';
import type { SeverityLevel } from '@/constants';
```

### Component Guidelines

```typescript
// Export named components
export const ComponentName = () => {
  // Component logic
  return <div>Content</div>;
};

// Use CSS modules for styling
import styles from './ComponentName.module.css';
```

## Submitting Changes

1. Run type checking: `bun run type-check`
2. Fix any linting issues: `bun run lint`
3. Update documentation if needed
4. Push to your fork
5. Create a pull request with a clear description

### Pull Request Guidelines

- Reference any related issues
- Include screenshots for UI changes
- Describe what the changes do and why they're needed
- Ensure CI checks pass
- Request review from maintainers

## Adding New Report Formats

To add support for a new security report format:

1. **Create Type Definitions**
   ```typescript
   // src/types/your-format.ts
   export type YourFormatReport = {
     // Define the structure
   };
   ```

2. **Create Parser**
   ```typescript
   // src/utils/yourFormatParser.ts
   export class YourFormatParser {
     static parse(data: YourFormatReport): {
       results: ProcessedResult[];
       summary: ReportSummary;
     } {
       // Implementation
     }
   }
   ```

3. **Update Report Parser**
   - Add format detection in `reportParser.ts`
   - Add the new format to `ReportFormat` type
   - Update error messages and UI text

4. **Update Documentation**
   - Update README.md
   - Add examples of the new format

## Documentation

### Code Documentation

- Add JSDoc comments for public functions and complex logic
- Include parameter descriptions and return types
- Add examples for complex functionality

Example:
```typescript
/**
 * Validates a file based on extension and size
 * @param file - The file to validate
 * @returns Validation result with isValid flag and optional error message
 * @example
 * const result = validateFile(myFile);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 */
export function validateFile(file: File): FileValidationResult {
  // Implementation
}
```

### README Updates

Update the README when:
- Adding new features
- Changing installation or usage instructions
- Adding new dependencies
- Changing configuration options

## Questions?

If you have questions or need help:
1. Check existing issues and discussions
2. Create a new issue with the question label
3. Reach out to maintainers

Thank you for contributing! 🎉