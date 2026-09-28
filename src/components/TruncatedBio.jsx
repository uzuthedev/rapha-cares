import { useState } from 'react';

export default function TruncatedBio({ text = '', maxLength = 100, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const needsTruncation = text.length > maxLength;

  // Find a clean word boundary for truncated text
  let truncatedText = text;
  if (needsTruncation) {
    const rawCut = text.slice(0, maxLength);
    const lastSpace = rawCut.lastIndexOf(' ');
    truncatedText = (lastSpace > 40 ? rawCut.slice(0, lastSpace) : rawCut).trim() + '…';
  }

  return (
    <div className={`text-stone-600 ${className}`}>
      <p className="leading-relaxed text-xs sm:text-sm inline">
        {isExpanded || !needsTruncation ? text : truncatedText}
      </p>
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="ml-1.5 inline-flex items-center text-xs font-semibold text-rc-terracotta hover:text-rc-terracotta-dark focus:outline-none focus:underline underline-offset-2 transition-colors cursor-pointer select-none"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Read Less <span className="ml-0.5 text-[10px]" aria-hidden="true">▲</span>
            </>
          ) : (
            <>
              Read More <span className="ml-0.5 text-[10px]" aria-hidden="true">▼</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
