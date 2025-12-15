import type { PerformanceCategory, PerformanceCategoryResult } from '../../../specs/001-response-status-indicators/contracts/component-interfaces';
import { RESPONSE_CODE_DESCRIPTIONS } from './constants';
import { describeByteSize } from './misc';

/**
 * Categorizes response time into performance category
 * 
 * @param milliseconds - Response time in milliseconds
 * @returns Performance category: 'fast' (<500ms - Green), 'moderate' (500ms-1500ms - Yellow), or 'slow' (>1500ms - Red)
 * 
 * @example
 * getPerformanceCategory(200) // returns 'fast'
 * getPerformanceCategory(1000) // returns 'moderate'
 * getPerformanceCategory(2000) // returns 'slow'
 * getPerformanceCategory(0) // returns 'fast' (edge case: 0ms treated as fast)
 * getPerformanceCategory(-1) // returns 'fast' (edge case: negative times treated as fast)
 */
export function getPerformanceCategory(milliseconds: number): PerformanceCategory {
  // Handle edge cases: negative times, NaN, or invalid values treated as fast
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return 'fast';
  }
  
  // 0ms is treated as fast (instantaneous response)
  if (milliseconds < 500) {
    return 'fast';
  }
  if (milliseconds <= 1500) {
    return 'moderate';
  }
  // Very large times (>1500ms) are categorized as slow
  return 'slow';
}

/**
 * Gets performance category with visual indicator details
 * 
 * @param milliseconds - Response time in milliseconds
 * @returns Performance category result with visual indicator information
 * 
 * @example
 * getPerformanceIndicator(200) 
 * // returns { category: 'fast', indicatorClass: 'bg-success', label: 'Fast' }
 */
export function getPerformanceIndicator(milliseconds: number): PerformanceCategoryResult {
  const category = getPerformanceCategory(milliseconds);
  
  const indicators: Record<PerformanceCategory, Omit<PerformanceCategoryResult, 'category'>> = {
    fast: {
      indicatorClass: 'bg-success',
      label: 'Fast',
    },
    moderate: {
      indicatorClass: 'bg-warning',
      label: 'Moderate',
    },
    slow: {
      indicatorClass: 'bg-danger',
      label: 'Slow',
    },
  };

  return {
    category,
    ...indicators[category],
  };
}

/**
 * Formats response data into a structured summary string for clipboard
 * 
 * @param request - Request object with method and URL
 * @param response - Response object with status, time, size, etc.
 * @returns Formatted plain text summary string
 * 
 * @example
 * formatResponseSummary(
 *   { method: 'GET', url: 'https://api.example.com/users' },
 *   { statusCode: 200, statusMessage: 'OK', elapsedTime: 250, bytesContent: 1024, ... }
 * )
 * // returns formatted string with all response details
 */
export function formatResponseSummary(
  request: {
    method: string;
    url: string;
    name?: string;
  },
  response: {
    statusCode: number;
    statusMessage?: string;
    elapsedTime: number;
    bytesContent: number;
    bytesRead: number;
    created?: number;
    url?: string;
  }
): string {
  // Handle edge cases: ensure elapsedTime is valid
  const elapsedTime = Number.isFinite(response.elapsedTime) && response.elapsedTime >= 0 
    ? response.elapsedTime 
    : 0;
  
  const performanceCategory = getPerformanceCategory(elapsedTime);
  const performanceLabel = getPerformanceIndicator(elapsedTime).label;
  const responseSize = formatResponseSize(Math.max(response.bytesContent || 0, response.bytesRead || 0));
  const timestamp = formatTimestamp(response.created || Date.now());
  
  const lines = [
    `Request: ${request.method || 'UNKNOWN'} ${request.url || 'N/A'}`,
    `Status: ${response.statusCode || 'N/A'} ${(response.statusMessage || '').trim()}`,
    `Time: ${elapsedTime}ms (${performanceLabel})`,
    `Size: ${responseSize}`,
    `Timestamp: ${timestamp}`,
  ];

  return lines.join('\n');
}

/**
 * Gets status code description from constants
 * 
 * @param statusCode - HTTP status code
 * @returns Human-readable description of the status code, or class-based description (2xx, 4xx, 5xx) for unknown codes
 * 
 * @example
 * getStatusCodeDescription(404) 
 * // returns "Server cannot find requested resource. This response code is probably the most famous one due to how frequently it occurs on the web."
 * getStatusCodeDescription(299)
 * // returns generic class-based description for 2xx range
 * getStatusCodeDescription(999)
 * // returns "Unknown status code" for non-standard codes
 */
export function getStatusCodeDescription(statusCode: number): string {
  // Handle edge cases: invalid status codes
  if (!Number.isFinite(statusCode) || statusCode < 0 || statusCode > 999) {
    return 'Invalid status code';
  }

  // Check if we have a specific description for this status code
  const description = RESPONSE_CODE_DESCRIPTIONS[statusCode];
  if (description) {
    return description;
  }

  // For unknown status codes, return class-based description
  const firstDigit = Math.floor(statusCode / 100);
  const classDescriptions: Record<number, string> = {
    1: 'Informational response (1xx)',
    2: 'Successful response (2xx)',
    3: 'Redirection response (3xx)',
    4: 'Client error response (4xx)',
    5: 'Server error response (5xx)',
  };

  return classDescriptions[firstDigit] || 'Unknown status code';
}

/**
 * Formats response size for display
 * 
 * @param bytes - Size in bytes
 * @returns Formatted size string (e.g., "1.2 KB", "3.5 MB")
 * 
 * @example
 * formatResponseSize(1024) // returns "1 KB"
 * formatResponseSize(1536) // returns "1.5 KB"
 * formatResponseSize(0) // returns "0 B"
 * formatResponseSize(-1) // returns "0 B" (edge case: negative sizes)
 */
export function formatResponseSize(bytes: number): string {
  // Handle edge cases: invalid or negative sizes
  const validBytes = Number.isFinite(bytes) && bytes >= 0 ? bytes : 0;
  return describeByteSize(validBytes, true);
}

/**
 * Formats timestamp for display in summary
 * 
 * @param timestamp - Unix timestamp in milliseconds or Date object
 * @returns ISO 8601 formatted timestamp string
 * 
 * @example
 * formatTimestamp(Date.now()) // returns "2025-01-27T10:30:45.123Z"
 */
export function formatTimestamp(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return date.toISOString();
}

