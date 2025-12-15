import classnames from 'classnames';
import React, { type FC, useCallback, useState } from 'react';
import * as reactUse from 'react-use';

import { formatResponseSummary } from '../../../common/response-utils';
import type { CopyResponseSummaryButtonProps } from '../../../../specs/001-response-status-indicators/contracts/component-interfaces';
import { Button } from '../themed-button';

/**
 * CopyResponseSummaryButton component
 * 
 * Provides a copy summary button in the Response Summary Strip header area that allows
 * users to copy a concise, well-formatted summary of the API response to their clipboard
 * for sharing in tickets, documentation, or chat tools.
 * 
 * Features:
 * - Formats response summary using formatResponseSummary utility
 * - Copies to clipboard using window.clipboard.writeText()
 * - Shows visual feedback (success/error) for copy action
 * - Handles clipboard access failures gracefully
 * - Includes all required fields (method, URL, status, time with category, size, timestamp)
 */
export const CopyResponseSummaryButton: FC<CopyResponseSummaryButtonProps> = ({
  request,
  response,
  className,
  onCopySuccess,
  onCopyError,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Auto-hide confirmation after 2 seconds
  reactUse.useInterval(() => {
    if (showConfirmation) {
      setShowConfirmation(false);
    }
    if (errorState) {
      setErrorState(null);
    }
  }, 2000);

  const handleCopy = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        // Generate formatted summary using utility function
        const summary = formatResponseSummary(request, response);

        // Copy to clipboard
        window.clipboard.writeText(summary);

        // Show success feedback
        setShowConfirmation(true);
        setErrorState(null);

        // Call success callback if provided
        if (onCopySuccess) {
          onCopySuccess();
        }
      } catch (error) {
        // Handle clipboard access failures
        const errorMessage = error instanceof Error ? error.message : 'Failed to copy to clipboard';
        setErrorState(errorMessage);
        setShowConfirmation(false);

        // Call error callback if provided
        if (onCopyError) {
          onCopyError(error instanceof Error ? error : new Error(errorMessage));
        }

        // Log error for debugging (non-blocking)
        console.error('Failed to copy response summary:', error);
      }
    },
    [request, response, onCopySuccess, onCopyError],
  );

  // Determine button content based on state
  let buttonContent: React.ReactNode;
  let buttonTitle: string;

  if (errorState) {
    buttonContent = (
      <span>
        Error <i className="fa fa-exclamation-circle" />
      </span>
    );
    buttonTitle = errorState;
  } else if (showConfirmation) {
    buttonContent = (
      <span>
        Copied <i className="fa fa-check-circle-o" />
      </span>
    );
    buttonTitle = 'Response summary copied to clipboard';
  } else {
    buttonContent = <i className="fa fa-copy text-orange-500" />;
    buttonTitle = 'Copy response summary to clipboard';
  }

  return (
    <Button
      className={classnames(className)}
      onClick={handleCopy}
      title={buttonTitle}
      aria-label={buttonTitle}
      aria-live="polite"
    >
      {buttonContent}
    </Button>
  );
};

CopyResponseSummaryButton.displayName = 'CopyResponseSummaryButton';

