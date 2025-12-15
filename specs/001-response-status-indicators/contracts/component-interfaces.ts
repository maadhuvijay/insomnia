/**
 * Component Interface Contracts
 * 
 * These TypeScript interfaces define the contracts for components in the
 * Enhanced Response Status Indicators feature. These serve as the API
 * contracts between components and ensure type safety.
 */

/**
 * Props for StatusCodeExplanationPanel component
 */
export interface StatusCodeExplanationPanelProps {
  /** HTTP status code from the response */
  statusCode: number;
  /** Status message from the response (optional) */
  statusMessage?: string;
  /** Whether the response is still loading */
  isLoading?: boolean;
  /** Optional className for styling */
  className?: string;
}

/**
 * Props for CopyResponseSummaryButton component
 */
export interface CopyResponseSummaryButtonProps {
  /** The active request object */
  request: {
    method: string;
    url: string;
    name?: string;
  };
  /** The active response object */
  response: {
    statusCode: number;
    statusMessage?: string;
    elapsedTime: number;
    bytesContent: number;
    bytesRead: number;
    created?: number;
    url?: string;
  };
  /** Optional className for styling */
  className?: string;
  /** Optional callback when copy succeeds */
  onCopySuccess?: () => void;
  /** Optional callback when copy fails */
  onCopyError?: (error: Error) => void;
}

/**
 * Performance category type
 * - fast: <500ms (Green)
 * - moderate: 500ms-1500ms (Yellow)
 * - slow: >1500ms (Red)
 */
export type PerformanceCategory = 'fast' | 'moderate' | 'slow';

/**
 * Result of performance categorization
 */
export interface PerformanceCategoryResult {
  /** The performance category */
  category: PerformanceCategory;
  /** The visual indicator class name */
  indicatorClass: string;
  /** Optional icon name for the indicator */
  iconName?: string;
  /** Human-readable label */
  label: string;
}

/**
 * Props for TimeTag with performance indicator
 */
export interface TimeTagWithPerformanceProps {
  /** Response time in milliseconds */
  milliseconds: number;
  /** Optional timing steps for detailed breakdown */
  steps?: Array<{
    stepName: string;
    duration?: number;
  }>;
  /** Whether to show performance indicator */
  showPerformanceIndicator?: boolean;
  /** Optional className for styling */
  className?: string;
  /** Optional tooltip delay */
  tooltipDelay?: number;
  /** Small variant */
  small?: boolean;
}

/**
 * Formatted response summary structure
 */
export interface ResponseSummaryData {
  /** HTTP method */
  requestMethod: string;
  /** Full request URL */
  requestUrl: string;
  /** Status code */
  statusCode: number;
  /** Status message */
  statusMessage: string;
  /** Response time in milliseconds */
  responseTime: number;
  /** Performance category */
  performanceCategory: PerformanceCategory;
  /** Formatted response size string */
  responseSize: string;
  /** ISO 8601 formatted timestamp */
  timestamp: string;
}

