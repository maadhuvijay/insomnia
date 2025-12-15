/**
 * Utility Function Contracts
 * 
 * These TypeScript function signatures define the contracts for utility
 * functions used in the Enhanced Response Status Indicators feature.
 */

import type { PerformanceCategory, PerformanceCategoryResult, ResponseSummaryData } from './component-interfaces';

/**
 * Categorizes response time into performance category
 * 
 * @param milliseconds - Response time in milliseconds
 * @returns Performance category: 'fast' (<500ms), 'acceptable' (500ms-3s), or 'slow' (>3s)
 * 
 * @example
 * getPerformanceCategory(200) // returns 'fast'
 * getPerformanceCategory(1500) // returns 'acceptable'
 * getPerformanceCategory(5000) // returns 'slow'
 */
export function getPerformanceCategory(milliseconds: number): PerformanceCategory;

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
export function getPerformanceIndicator(milliseconds: number): PerformanceCategoryResult;

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
): string;

/**
 * Gets status code description from constants
 * 
 * @param statusCode - HTTP status code
 * @returns Human-readable description of the status code, or "Unknown Response Code" if not found
 * 
 * @example
 * getStatusCodeDescription(404) 
 * // returns "Server cannot find requested resource. This response code is probably the most famous one due to how frequently it occurs on the web."
 */
export function getStatusCodeDescription(statusCode: number): string;

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
export function formatResponseSize(bytes: number): string;

/**
 * Formats timestamp for display in summary
 * 
 * @param timestamp - Unix timestamp in milliseconds or Date object
 * @returns ISO 8601 formatted timestamp string
 * 
 * @example
 * formatTimestamp(Date.now()) // returns "2025-01-27T10:30:45.123Z"
 */
export function formatTimestamp(timestamp: number | Date): string;

