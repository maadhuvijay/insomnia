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
 */
export function getPerformanceCategory(milliseconds: number): PerformanceCategory {
  if (milliseconds < 500) {
    return 'fast';
  }
  if (milliseconds <= 1500) {
    return 'moderate';
  }
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
  const performanceCategory = getPerformanceCategory(response.elapsedTime);
  const performanceLabel = getPerformanceIndicator(response.elapsedTime).label;
  const responseSize = formatResponseSize(Math.max(response.bytesContent, response.bytesRead));
  const timestamp = formatTimestamp(response.created || Date.now());
  
  const lines = [
    `Request: ${request.method} ${request.url}`,
    request.name ? `Name: ${request.name}` : null,
    '',
    `Status: ${response.statusCode} ${response.statusMessage || ''}`.trim(),
    `Time: ${response.elapsedTime}ms (${performanceLabel})`,
    `Size: ${responseSize}`,
    `Timestamp: ${timestamp}`,
  ].filter(Boolean);

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
 */
export function getStatusCodeDescription(statusCode: number): string {
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
 */
export function formatResponseSize(bytes: number): string {
  return describeByteSize(bytes, true);
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

