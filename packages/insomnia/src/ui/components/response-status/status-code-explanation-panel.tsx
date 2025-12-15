import classnames from 'classnames';
import { type FC, memo } from 'react';

import type { StatusCodeExplanationPanelProps } from '../../../../specs/001-response-status-indicators/contracts/component-interfaces';
import { RESPONSE_CODE_DESCRIPTIONS, RESPONSE_CODE_REASONS } from '../../../common/constants';

/**
 * Helper function to get class-based description for unknown/non-standard status codes
 * Returns generic descriptions based on status code range (2xx, 4xx, 5xx)
 */
function getClassBasedDescription(statusCode: number): string {
  const firstDigit = Math.floor(statusCode / 100);
  const ranges: Record<number, string> = {
    1: 'The request has been received and is still being processed.',
    2: 'The request was successfully processed.',
    3: 'The request requires redirection to another resource.',
    4: 'The request contains a client-side error.',
    5: 'The server failed to process a valid request.',
  };
  return ranges[firstDigit] || 'Unknown status code range. This is not a standard HTTP status code.';
}

/**
 * StatusCodeExplanationPanel component
 * 
 * Displays a clear explanation of the HTTP response status code directly in the response view,
 * positioned between the response view mode tabs and the response content area.
 * 
 * Features:
 * - Shows status code, message, and description
 * - Handles loading state when response is executing
 * - Handles unknown/non-standard status codes with class-based descriptions
 * - Remains visible when switching between response view mode tabs
 */
export const StatusCodeExplanationPanel: FC<StatusCodeExplanationPanelProps> = memo(({
  statusCode,
  statusMessage,
  isLoading = false,
  className,
}) => {
  // Handle edge cases: invalid status codes
  const isValidStatusCode = Number.isFinite(statusCode) && statusCode >= 0 && statusCode <= 999;
  const safeStatusCode = isValidStatusCode ? statusCode : 0;
  
  // Get description from constants or fall back to class-based description
  const description = isValidStatusCode 
    ? (RESPONSE_CODE_DESCRIPTIONS[safeStatusCode] || getClassBasedDescription(safeStatusCode))
    : 'Invalid status code. This is not a valid HTTP status code.';
  const isUnknown = isValidStatusCode && !RESPONSE_CODE_DESCRIPTIONS[safeStatusCode];
  
  // Get status message, preferring the provided one or falling back to constants
  const isStatusMessageUnknown = statusMessage === 'Unknown' || statusMessage === 'unknown';
  let statusMessageToShow = statusMessage || (isValidStatusCode ? RESPONSE_CODE_REASONS[safeStatusCode] : undefined);
  if (isStatusMessageUnknown && isValidStatusCode) {
    statusMessageToShow = RESPONSE_CODE_REASONS[safeStatusCode] || statusMessage || 'Unknown';
  }

  // Loading state: show a simple loading indicator
  if (isLoading) {
    return (
      <div
        className={classnames(
          'flex items-center gap-2 border-b border-solid border-(--hl-md) bg-(--color-bg) px-4 py-2 text-sm text-(--hl)',
          className
        )}
        aria-live="polite"
        aria-label="Loading response status"
      >
        <i className="fa fa-spinner fa-spin" />
        <span>Loading response status...</span>
      </div>
    );
  }

  // Determine status color based on first digit (matching StatusTag logic)
  const firstChar = isValidStatusCode ? (safeStatusCode + '')[0] || '' : '0';
  const statusColorClass =
    {
      '1': 'text-info',
      '2': 'text-success',
      '3': 'text-surprise',
      '4': 'text-warning',
      '5': 'text-danger',
      '0': 'text-danger',
    }[firstChar] || 'text-surprise';

  return (
    <div
      className={classnames(
        'border-b border-solid border-(--hl-md) bg-(--color-bg) px-4 py-3 text-sm',
        className
      )}
      aria-live="polite"
      aria-label={`Status code ${safeStatusCode} explanation`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <strong className={classnames('text-base', statusColorClass)}>
              {safeStatusCode}
            </strong>
            {statusMessageToShow && (
              <span className="text-(--hl)">{statusMessageToShow}</span>
            )}
            {isUnknown && (
              <span className="rounded-xs bg-(--hl-sm) px-1.5 py-0.5 text-xs text-(--hl)">
                Non-standard
              </span>
            )}
          </div>
          <p className="text-(--hl) leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
});

StatusCodeExplanationPanel.displayName = 'StatusCodeExplanationPanel';
