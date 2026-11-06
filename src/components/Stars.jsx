import { useState } from 'react'

/** Read-only when onRate is not provided. */
export default function Stars({ value = 0, onRate }) {
  const [hover, setHover] = useState(0)
  const shown = hover || Math.round(value)
  return (
    <span className={`stars ${onRate ? 'interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onRate}
          className={n <= shown ? 'on' : ''}
          onMouseEnter={() => onRate && setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate && onRate(n)}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </span>
  )
}
