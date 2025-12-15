# Component and Function Contracts

This directory contains TypeScript interface definitions and function signatures that serve as contracts for the Enhanced Response Status Indicators feature.

## Files

### `component-interfaces.ts`
Defines TypeScript interfaces for React components:
- `StatusCodeExplanationPanelProps` - Props for status code explanation panel
- `CopyResponseSummaryButtonProps` - Props for copy summary button
- `TimeTagWithPerformanceProps` - Enhanced props for time tag with performance indicator
- `PerformanceCategory` - Type definition for performance categories
- `PerformanceCategoryResult` - Result structure for performance categorization
- `ResponseSummaryData` - Structure for formatted response summary

### `utility-functions.ts`
Defines function signatures for utility functions:
- `getPerformanceCategory()` - Categorizes response time
- `getPerformanceIndicator()` - Gets performance category with visual details
- `formatResponseSummary()` - Formats response data for clipboard
- `getStatusCodeDescription()` - Gets status code description
- `formatResponseSize()` - Formats byte size for display
- `formatTimestamp()` - Formats timestamp for display

## Usage

These contracts ensure type safety and serve as documentation for:
1. Component developers implementing the UI
2. Test writers creating unit and integration tests
3. Code reviewers verifying implementation correctness

## Implementation Notes

- All interfaces should be implemented exactly as specified
- Function signatures define the public API - internal implementation may vary
- These contracts are TypeScript-only (no runtime validation)
- For runtime validation, add appropriate checks in implementation

