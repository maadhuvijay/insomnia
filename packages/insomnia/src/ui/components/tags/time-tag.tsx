import classnames from 'classnames';
import React, { type FC, memo } from 'react';

import type { TimingStep } from '../../../main/network/request-timing';
import { getPerformanceIndicator } from '../../../common/response-utils';
import { Tooltip } from '../tooltip';

interface Props {
  milliseconds: number;
  small?: boolean;
  className?: string;
  tooltipDelay?: number;
  steps?: TimingStep[];
  showPerformanceIndicator?: boolean;
  error?: string;
  statusMessage?: string;
}
export const getTimeAndUnit = (milliseconds: number) => {
  let unit = 'ms';
  let number = milliseconds;

  if (milliseconds > 1000 * 60) {
    unit = 'm';
    number = milliseconds / 1000 / 60;
  } else if (milliseconds > 1000) {
    unit = 's';
    number = milliseconds / 1000;
  }

  // Round to 0, 1, 2 decimal places depending on how big the number is
  if (number > 100) {
    number = Math.round(number);
  } else if (number > 10) {
    number = Math.round(number * 10) / 10;
  } else {
    number = Math.round(number * 100) / 100;
  }

  return { number, unit };
};
export const TimeTag: FC<Props> = memo(({ milliseconds, small, className, tooltipDelay, steps, showPerformanceIndicator, error, statusMessage }) => {
  const totalMs = steps?.reduce((acc, step) => acc + (step.duration || 0), 0) || milliseconds;
  const { number, unit } = getTimeAndUnit(totalMs);
  const timesandunits = steps?.map(step => {
    const { number, unit } = getTimeAndUnit(step.duration || 0);
    return { stepName: step.stepName, number, unit };
  });

  // Handle edge cases: don't show performance indicator for cancelled requests, errors, or 0ms times
  const isCancelled = statusMessage === 'Cancelled' || error?.toLowerCase().includes('cancelled');
  const hasError = !!error;
  const isZeroTime = totalMs === 0 || !totalMs;
  const shouldShowIndicator = showPerformanceIndicator && !isCancelled && !hasError && !isZeroTime && totalMs > 0;
  
  const performanceIndicator = shouldShowIndicator ? getPerformanceIndicator(totalMs) : null;

  return (
    <div
      className={classnames(
        'tag',
        {
          'tag--small': small,
        },
        className,
      )}
    >
      <div className="flex items-center gap-1">
        {performanceIndicator && (
          <div
            className={classnames(
              'h-2 w-2 rounded-full',
              performanceIndicator.indicatorClass,
            )}
            aria-label={performanceIndicator.label}
            title={performanceIndicator.label}
          />
        )}
        <Tooltip
          message={
            <div>
              {timesandunits?.map(step => (
                <div key={step.stepName} className="flex justify-between">
                  <div className="mr-5">{step.stepName} </div>
                  <div>
                    {step.number} {step.unit}
                  </div>
                </div>
              ))}
              <div key="total" className="flex justify-between">
                <div className="mr-5">Total </div>
                <div>
                  {number} {unit}
                </div>
              </div>
            </div>
          }
          position="bottom"
          delay={tooltipDelay}
        >
          {number}&nbsp;{unit}
        </Tooltip>
      </div>
    </div>
  );
});

TimeTag.displayName = 'TimeTag';
