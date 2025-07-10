# Modular HTML Generation System

This directory contains a modular, well-organized system for generating static HTML security reports with advanced grouping and deduplication functionality.

## Overview

The HTML generation system has been refactored from a monolithic `generateHtml.ts` file into a modular architecture that separates concerns and improves maintainability. The system generates fully self-contained HTML reports that work offline and include interactive features like search, filtering, and group expansion.

## Architecture

The system is broken down into several focused modules:

```
html-generation/
├── index.ts           # Main orchestrator and public API
├── styles.ts          # CSS styles, theming, and color definitions
├── summary.ts         # Report metadata and summary generation
├── findings.ts        # Individual and grouped findings HTML
├── scripts.ts         # Interactive JavaScript functionality
└── README.md          # This documentation
```

### Module Responsibilities

#### `index.ts` - Main Orchestrator
- **Purpose**: Coordinates all modules and provides the main `generateHtml()` function
- **Exports**: Primary API functions used by the application
- **Features**: Document structure, head generation, performance monitoring

#### `styles.ts` - Styling System
- **Purpose**: Centralized CSS management and theming
- **Features**: 
  - Embedded fonts for offline usage
  - Responsive design utilities
  - Component-specific styles
  - Accessibility enhancements
  - Print styles
- **Exports**: Style functions and severity color mappings

#### `summary.ts` - Report Summary
- **Purpose**: Generate report metadata, statistics, and overview sections
- **Features**:
  - Report headers and timestamps
  - Tool information and metadata
  - Severity distribution charts
  - Deduplication statistics
- **Exports**: Summary component generators

#### `findings.ts` - Findings Rendering
- **Purpose**: Handle individual findings and grouped findings display
- **Features**:
  - Individual finding cards
  - Grouped finding cards with expansion
  - Search and filter integration
  - Location mapping for groups
- **Exports**: Finding component generators

#### `scripts.ts` - Interactive Functionality
- **Purpose**: Client-side JavaScript for interactive features
- **Features**:
  - View mode switching (grouped vs. all)
  - Group expansion/collapse
  - Search and filtering
  - Accessibility enhancements
  - Performance optimizations
- **Exports**: Script generators

## Key Features

### 🔍 Advanced Group Implementation

The system includes sophisticated grouping and deduplication:

1. **Intelligent Grouping**: Similar findings are automatically grouped based on:
   - Rule ID and severity
   - Message similarity (configurable threshold)
   - Normalized content patterns

2. **Interactive Groups**: 
   - Click to expand/collapse group details
   - View all occurrences across files
   - Maintain individual finding context

3. **Deduplication Statistics**:
   - Shows reduction in noise
   - Displays duplicate percentages
   - Tracks unique issue groups

### 🎨 Enhanced UI/UX

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Professional security-focused appearance
- **Smooth Animations**: Fade-ins, transitions, and hover effects
- **Accessibility**: ARIA labels, keyboard navigation, focus management

### 🔍 Interactive Features

- **Real-time Search**: Filter findings by message, file, or rule ID
- **Severity Filtering**: Filter by specific severity levels
- **View Modes**: Toggle between grouped and individual views
- **Highlighting**: Search term highlighting in results

### 📱 Offline Support

- **Embedded Fonts**: Complete Inter font family embedded as base64
- **Self-contained CSS**: No external dependencies
- **Standalone JavaScript**: All functionality works without internet

## Usage

### Basic Usage

```typescript
import { generateHtml } from '@/shared/html-generation';

const htmlContent = generateHtml({
  summary: reportSummary,
  results: securityFindings,
  generatedAt: new Date().toISOString(),
  enableDeduplication: true,
  offlineMode: true
});

// Save or serve the HTML
const blob = new Blob([htmlContent], { type: 'text/html' });
```

### Advanced Usage

```typescript
import { 
  generateHtml,
  generateFindingsSectionHtml,
  generateSummaryHtml,
  SEVERITY_COLORS 
} from '@/shared/html-generation';

// Generate just the findings section
const findingsHtml = generateFindingsSectionHtml(
  results,
  deduplicationGroups,
  true, // enable deduplication
  true  // show toggle
);

// Generate just the summary
const summaryHtml = generateSummaryHtml(
  summary,
  deduplicationStats,
  formattedTimestamp
);

// Access color mappings
const criticalColor = SEVERITY_COLORS.critical.bg;
```

## API Reference

### `generateHtml(options)`

Main function to generate complete HTML reports.

**Parameters:**
- `summary: ReportSummary` - Report metadata and statistics
- `results: ProcessedResult[]` - Array of security findings
- `generatedAt?: string` - ISO timestamp for report generation
- `enableDeduplication?: boolean` - Whether to show grouped view by default (default: true)
- `offlineMode?: boolean` - Whether to embed all resources (default: true)

**Returns:** `string` - Complete HTML document

### Component Generators

#### `generateFindingsSectionHtml(results, groups, enableDeduplication, showToggle)`

Generates the complete findings section with search, filters, and view toggle.

#### `generateSummaryHtml(summary, deduplicationStats?, timestamp?)`

Generates the report summary with metadata, statistics, and charts.

#### `generateGroupHtml(group)`

Generates HTML for a single grouped finding with expansion functionality.

#### `generateFindingHtml(result)`

Generates HTML for an individual security finding.

### Style System

#### `getAllStyles(offlineMode?)`

Returns complete CSS styles for the report.

#### `SEVERITY_COLORS`

Object mapping severity levels to color schemes:

```typescript
{
  critical: { bg: string, text: string, border: string, icon: string, badge: string },
  high: { bg: string, text: string, border: string, icon: string, badge: string },
  medium: { bg: string, text: string, border: string, icon: string, badge: string },
  low: { bg: string, text: string, border: string, icon: string, badge: string },
  info: { bg: string, text: string, border: string, icon: string, badge: string }
}
```

### Script System

#### `generateReportScripts(enableDeduplication?)`

Generates all interactive JavaScript functionality for the report.

## Group Functionality Details

### How Grouping Works

1. **Initial Processing**: Each finding is analyzed for grouping potential
2. **Key Generation**: Creates group keys based on rule ID, severity, and normalized message
3. **Similarity Matching**: Uses fuzzy string matching to find similar findings
4. **Group Creation**: Creates representative groups with occurrence tracking
5. **Location Mapping**: Tracks all file locations and line numbers for each group

### Group Data Structure

```typescript
interface DuplicateGroup {
  id: string;                    // Unique group identifier
  representativeResult: ProcessedResult;  // Primary finding for display
  duplicates: ProcessedResult[]; // All duplicate findings
  occurrences: number;           // Total occurrence count
  affectedFiles: string[];       // List of affected files
  lineRanges: Array<{           // Detailed location information
    file: string;
    startLine?: number;
    endLine?: number;
  }>;
}
```

### Interactive Group Features

- **Expandable Cards**: Click any group to see detailed information
- **Occurrence Tracking**: Shows total occurrences across files
- **Location Details**: Lists all file locations with line numbers
- **Context Preservation**: Maintains original finding context
- **Visual Indicators**: Clear badges showing occurrence counts

## Benefits of Modular Architecture

### 🏗️ Maintainability
- **Separation of Concerns**: Each module has a single responsibility
- **Easy Testing**: Individual modules can be tested in isolation
- **Clear Dependencies**: Explicit imports show relationships

### 🔧 Flexibility
- **Customizable Components**: Use individual generators for specific needs
- **Theme Variations**: Easy to modify colors and styles
- **Feature Toggles**: Enable/disable functionality as needed

### 📈 Scalability
- **Performance**: Smaller modules load faster
- **Memory Usage**: Only load what you need
- **Bundle Optimization**: Better tree-shaking opportunities

### 🐛 Debugging
- **Clear Error Messages**: Errors point to specific modules
- **Isolated Testing**: Test individual components
- **Stack Traces**: More precise error locations

## Migration from Legacy System

The modular system is backward compatible:

```typescript
// Old way (still works)
import { generateHtml } from '@/shared/generateHtml';

// New way (recommended)
import { generateHtml } from '@/shared/html-generation';
```

All existing functionality is preserved while gaining the benefits of the modular architecture.

## Performance Optimizations

### Client-Side Performance
- **Debounced Search**: Prevents excessive filtering during typing
- **Virtual Scrolling**: For large datasets (100+ findings)
- **Lazy Loading**: Group details loaded on demand
- **Intersection Observer**: Optimized visibility detection

### Bundle Size
- **Tree Shaking**: Unused modules are excluded
- **CSS Optimization**: Styles are minified and combined
- **Font Optimization**: Only necessary font weights included

### Runtime Performance
- **Efficient DOM Updates**: Minimal reflows and repaints
- **Event Delegation**: Reduces memory usage
- **Cached Calculations**: Avoid repeated computations

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Graceful Degradation**: Basic functionality works in older browsers
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile**: Responsive design for all screen sizes

## Future Enhancements

- **Export Formats**: PDF generation support
- **Advanced Filtering**: Complex query support
- **Collaboration**: Comment and annotation features
- **Integration**: API endpoints for programmatic access
- **Theming**: Multiple color scheme options