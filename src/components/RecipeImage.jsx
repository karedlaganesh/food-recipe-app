import { useState } from 'react'

export default function RecipeImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        🍽️
      </div>
    )
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
}
