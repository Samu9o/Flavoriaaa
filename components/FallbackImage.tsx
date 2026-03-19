"use client"

import { useState } from "react"

type FallbackImageProps = {
  src: string
  alt: string
  className?: string
  fallbackSrc: string
}

export default function FallbackImage({
  src,
  alt,
  className,
  fallbackSrc,
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
        }
      }}
    />
  )
}
