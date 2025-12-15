import classnames from 'classnames';
import { type FC, memo } from 'react';

import { RESPONSE_CODE_DESCRIPTIONS, RESPONSE_CODE_REASONS } from '../../../common/constants';
import type { StatusCodeExplanationPanelProps } from '../../../../specs/001-response-status-indicators/contracts/component-interfaces';

/**
 * Helper function to get class-based description for unknown/non-standard status codes
 * Returns generic descriptions based on status code range (2xx, 4xx, 5xx)
 */
function getClassBasedDescription(statusCode: number): string {
  const firstDigit = Math.floor(statusCode / 100);
  const ranges: Record<number, string> = {
    1: 'Informational response (1xx). The request was received, continuing process.',
    2: 'Successful response (2xx). The request was successfully received, understood, and accepted.',
    3: 'Redirection response (3xx). Further action needs to be taken in order to complete the request.',
    4: 'Client error response (4xx). The request contains bad syntax or cannot be fulfilled.',
    5: 'Server error response (5xx). The server failed to fulfill a valid request.',
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
  // Get description from constants or fall back to class-based description
  const description = RESPONSE_CODE_DESCRIPTIONS[statusCode] || getClassBasedDescription(statusCode);
  const isUnknown = !RESPONSE_CODE_DESCRIPTIONS[statusCode];
  
  // Get status message, preferring the provided one or falling back to constants
  const isStatusMessageUnknown = statusMessage === 'Unknown' || statusMessage === 'unknown';
  let statusMessageToShow = statusMessage || RESPONSE_CODE_REASONS[statusCode];
  if (isStatusMessageUnknown) {
    statusMessageToShow = RESPONSE_CODE_REASONS[statusCode] || statusMessage || 'Unknown';
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
  const firstChar = (statusCode + '')[0] || '';
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
      aria-label={`Status code ${statusCode} explanation`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <strong className={classnames('text-base', statusColorClass)}>
              {statusCode}
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
