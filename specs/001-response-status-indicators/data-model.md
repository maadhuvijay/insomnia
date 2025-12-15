# Data Model: Enhanced Response Status Indicators

**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts  
**Status**: Complete

## Overview

This document defines the data structures, entities, and relationships for the Enhanced Response Status Indicators feature. This is primarily a UI-only feature that enhances the display of existing response data without introducing new persistent data models.

## Entities

### 1. Response Status Information

**Purpose**: Represents the status code explanation displayed in the status code explanation panel.

**Attributes**:
- `statusCode: number` - The HTTP status code (e.g., 200, 404, 500)
- `statusMessage: string | undefined` - The status message from the response (e.g., "OK", "Not Found")
- `description: string` - Human-readable explanation of the status code
- `isUnknown: boolean` - Whether the status code is non-standard or unknown

**Source**: 
- `statusCode` and `statusMessage` come from `activeResponse.statusCode` and `activeResponse.statusMessage`
- `description` is looked up from `RESPONSE_CODE_DESCRIPTIONS[statusCode]` constant
- `isUnknown` is `true` when `RESPONSE_CODE_DESCRIPTIONS[statusCode]` is undefined

**Validation Rules**:
- `statusCode` must be a positive integer (0-999 range for HTTP status codes)
- `description` defaults to "Unknown Response Code" if status code is not in `RESPONSE_CODE_DESCRIPTIONS`
- `statusMessage` may be undefined or empty string

**State Transitions**:
- **Initial**: No response → No status information displayed
- **Loading**: Request executing → Show loading state (optional)
- **Complete**: Response received → Display status code and explanation
- **Error**: Request failed → Display error state with appropriate status code

### 2. Performance Threshold

**Purpose**: Defines the boundaries for categorizing response performance.

**Attributes**:
- `fastThreshold: number` - Upper bound for "fast" category (500ms)
- `acceptableThreshold: number` - Upper bound for "acceptable" category (3000ms)
- `slowThreshold: number` - Lower bound for "slow" category (3000ms)

**Categories**:
- `fast`: `elapsedTime < 500` (milliseconds)
- `acceptable`: `500 <= elapsedTime <= 3000` (milliseconds)
- `slow`: `elapsedTime > 3000` (milliseconds)

**Source**: Hard-coded constants (from feature spec requirements)

**Validation Rules**:
- Thresholds are fixed and not user-configurable (per spec)
- `fastThreshold < acceptableThreshold === slowThreshold`
- All thresholds are in milliseconds

**State Transitions**: N/A (static configuration)

### 3. Performance Category

**Purpose**: Represents the performance category of a response based on elapsed time.

**Type**: `'fast' | 'acceptable' | 'slow'`

**Attributes**:
- `category: 'fast' | 'acceptable' | 'slow'` - The performance category
- `elapsedTime: number` - Response time in milliseconds
- `visualIndicator: PerformanceIndicator` - Visual representation (color, icon)

**Source**: Calculated from `activeResponse.elapsedTime` using `getPerformanceCategory()` utility function

**Validation Rules**:
- `elapsedTime` must be a non-negative number
- `category` is determined by comparing `elapsedTime` against thresholds
- Edge case: `elapsedTime === 0` is categorized as "fast"

**State Transitions**:
- **Calculated**: When response completes → Category determined from elapsed time
- **Error**: When request fails or is cancelled → Show error state (not categorized by time)

### 4. Response Summary

**Purpose**: Concise representation of key response details for clipboard copying.

**Attributes**:
- `requestMethod: string` - HTTP method (GET, POST, etc.)
- `requestUrl: string` - Full request URL
- `statusCode: number` - HTTP status code
- `statusMessage: string` - Status message
- `responseTime: number` - Elapsed time in milliseconds
- `performanceCategory: 'fast' | 'acceptable' | 'slow'` - Performance category
- `responseSize: string` - Formatted response size (e.g., "1.2 KB")
- `timestamp: string` - ISO 8601 formatted timestamp

**Source**: 
- `requestMethod` and `requestUrl` from `activeRequest.method` and `activeRequest.url`
- `statusCode` and `statusMessage` from `activeResponse.statusCode` and `activeResponse.statusMessage`
- `responseTime` from `activeResponse.elapsedTime`
- `performanceCategory` from `getPerformanceCategory(activeResponse.elapsedTime)`
- `responseSize` from `activeResponse.bytesContent` or `activeResponse.bytesRead` (formatted by `SizeTag` logic)
- `timestamp` from `activeResponse.created` or current time

**Validation Rules**:
- All fields are required for a complete summary
- `requestMethod` must be a valid HTTP method
- `requestUrl` must be a valid URL format
- `responseTime` must be non-negative
- `responseSize` must be a formatted string (not raw bytes)

**State Transitions**:
- **Generated**: When copy button is clicked → Format all fields into structured text
- **Copied**: After clipboard write succeeds → Show success feedback
- **Error**: If clipboard write fails → Show error feedback

## Relationships

### Response Status Information ↔ Response
- **Type**: One-to-one
- **Relationship**: Each response has exactly one status information display
- **Source**: `activeResponse.statusCode` and `activeResponse.statusMessage`

### Performance Category ↔ Response
- **Type**: One-to-one
- **Relationship**: Each response has exactly one performance category
- **Source**: Calculated from `activeResponse.elapsedTime`

### Response Summary ↔ Response + Request
- **Type**: One-to-one (summary aggregates data from one response and its parent request)
- **Relationship**: Each response can generate one summary, which combines response and request data
- **Source**: `activeResponse` and `activeRequest` models

## Data Flow

### Status Code Explanation Display
```
activeResponse.statusCode
  → Lookup in RESPONSE_CODE_DESCRIPTIONS
  → StatusCodeExplanationPanel component
  → Display in UI (between tabs and content)
```

### Performance Indicator Display
```
activeResponse.elapsedTime
  → getPerformanceCategory(elapsedTime)
  → Returns 'fast' | 'acceptable' | 'slow'
  → TimeTag component with visual indicator
  → Display in PaneHeader next to time
```

### Copy Summary Flow
```
activeRequest + activeResponse
  → formatResponseSummary(request, response)
  → Structured text string
  → window.clipboard.writeText(summary)
  → Visual feedback (success/error)
```

## Edge Cases and Special Handling

### Non-Standard Status Codes
- **Scenario**: Status code not in `RESPONSE_CODE_DESCRIPTIONS` (e.g., 299, 999)
- **Handling**: Display status code with description "Unknown Response Code" or "Non-standard status code"

### Zero or Negative Response Times
- **Scenario**: `elapsedTime === 0` or `elapsedTime < 0`
- **Handling**: Treat 0ms as "fast" category, negative times as error state

### Missing Response Data
- **Scenario**: `activeResponse` is null or undefined
- **Handling**: Don't render status explanation panel, performance indicator, or copy button

### Cancelled Requests
- **Scenario**: Request is cancelled before completion
- **Handling**: Show error state in performance indicator, don't categorize by time alone

### Very Large Response Times
- **Scenario**: `elapsedTime` exceeds normal ranges (hours, days)
- **Handling**: Still categorize as "slow" (>3s), display with appropriate time unit (m/h)

### Clipboard Access Failures
- **Scenario**: `window.clipboard.writeText()` throws error
- **Handling**: Catch error, show error feedback to user, don't crash

## Data Persistence

**Note**: This feature does not introduce any new persistent data models. All data is derived from existing `Response` and `Request` models and is displayed in real-time. No database changes or new storage is required.

## Integration with Existing Models

### Response Model (`models/response.ts`)
- Uses: `statusCode`, `statusMessage`, `elapsedTime`, `bytesContent`, `bytesRead`, `created`, `url`
- No modifications required

### Request Model (`models/request.ts`)
- Uses: `method`, `url`, `name`
- No modifications required

### RequestMeta Model (`models/request-meta.ts`)
- Uses: None (feature is display-only)
- No modifications required

