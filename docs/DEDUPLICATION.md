# Deduplication Feature

## Overview

The NGD Security Report Viewer includes intelligent deduplication to help you manage duplicate security findings across your codebase. This feature automatically groups similar issues together, making it easier to understand and prioritize security concerns without being overwhelmed by repetitive findings.

## How It Works

### Automatic Grouping

The deduplication system groups findings based on:

1. **Rule ID**: Issues with the same security rule/check ID
2. **Severity Level**: Issues with the same severity (critical, high, medium, low, info)
3. **Message Similarity**: Issues with similar messages (configurable threshold, default 85%)

### Smart Message Normalization

The system normalizes messages before comparison by:

- Removing file paths
- Abstracting line numbers
- Normalizing quoted strings
- Standardizing number references

This ensures that issues like "SQL injection in file1.js:42" and "SQL injection in file2.js:156" are recognized as the same type of issue.

## Using the Feature

### Toggle View Modes

In the report viewer, you'll see a toggle button in the top right of the findings section:

- **Grouped View** (default): Shows deduplicated issues with occurrence counts
- **All View**: Shows every individual finding

### Understanding Grouped Results

In grouped view, each finding card shows:

- **Occurrence Badge**: Shows how many times this issue appears (e.g., "5 occurrences")
- **Summary Text**: Indicates the scope (e.g., "Found 5 times across 3 files")
- **Expandable Details**: Click on any group to see all occurrences with their specific locations

### Deduplication Statistics

The report summary section displays:

- **Unique Issue Groups**: Number of distinct security issues
- **Duplicate Findings**: Total number of duplicate occurrences
- **Duplication Rate**: Percentage of findings that are duplicates

## Benefits

### 1. Reduced Noise

Instead of seeing the same issue repeated dozens of times, you see it once with a clear indication of how widespread it is.

### 2. Better Prioritization

Focus on fixing the root cause of issues that appear multiple times, as these likely represent systematic problems.

### 3. Clearer Overview

Get a true sense of your security posture without duplicate findings inflating the numbers.

### 4. Faster Review

Review unique issues once instead of scrolling through repetitive findings.

## Example Scenarios

### Scenario 1: Hardcoded Secrets

Without deduplication:
- 50 findings for "Hardcoded secret found" across 10 files
- Difficult to see the scope of the problem

With deduplication:
- 1 grouped finding showing "Found 50 times across 10 files"
- Expandable list of all affected locations

### Scenario 2: SQL Injection Vulnerabilities

Without deduplication:
- Multiple identical SQL injection warnings for similar query patterns
- Each instance listed separately

With deduplication:
- Grouped by the type of SQL injection pattern
- Clear view of which patterns are most common

## Configuration

The deduplication algorithm uses these default settings:

```typescript
{
  groupByRuleId: true,           // Group by security rule ID
  groupBySimilarMessage: true,   // Use fuzzy matching for messages
  similarityThreshold: 0.85      // 85% similarity required for grouping
}
```

These settings provide a good balance between reducing noise and maintaining visibility of distinct issues.

## Best Practices

1. **Start with Grouped View**: Begin your security review in grouped mode to understand the scope
2. **Expand High-Occurrence Groups**: Focus on issues that appear many times
3. **Switch to All View When Needed**: Use the all view when you need to see specific instances
4. **Use Filters with Deduplication**: Combine severity filters with grouping for focused review

## Technical Details

The deduplication system uses:

- **Jaccard Similarity**: For comparing message similarity
- **Token-based Analysis**: Breaking messages into meaningful tokens for comparison
- **Normalized Comparison**: Abstracting variable parts of messages

This ensures accurate grouping while maintaining the ability to see all individual occurrences when needed.