import React, { useState } from 'react';

interface PlaceholderProps {
  field: string;
  tip?: string;
}

/**
 * Renders an amber-highlighted placeholder for uncollected user data.
 * Displays a tooltip on hover with guidance for the user.
 */
export const Placeholder: React.FC<PlaceholderProps> = ({
  field,
  tip = "Complete this field before signing.",
}) => {
  const [showTip, setShowTip] = useState(false);

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <span
        className="px-1.5 py-0.5 rounded font-semibold text-sm"
        style={{
          color: '#92700C',
          background: 'rgba(191,160,82,0.15)',
          border: '1.5px dashed rgba(191,160,82,0.5)',
        }}
      >
        [PLACEHOLDER: {field}]
      </span>

      {showTip && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg"
          style={{
            background: '#1A1A1A',
            color: '#D4B766',
            border: '1px solid rgba(191,160,82,0.3)',
          }}
        >
          {tip}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #1A1A1A',
            }}
          />
        </span>
      )}
    </span>
  );
};
