'use client'
import React, { useState, useEffect } from 'react'
import { Img } from './Img'

export function TourHeroStack({ images, alt }: { images: any[]; alt: string }) {
  const [items, setItems] = useState(images)
  const [animating, setAnimating] = useState(false)

  if (!items.length) return null

  const handleFlip = () => {
    if (animating || items.length <= 1) return
    setAnimating(true)
    setTimeout(() => {
      setItems((prev) => [...prev.slice(1), prev[0]])
      setAnimating(false)
    }, 450)
  }

  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(handleFlip, 4500)
    return () => clearInterval(timer)
  }, [items.length, animating])

  return (
    <div className="jt-herostack" onClick={handleFlip} title="Click to flip card">
      {items.map((img, index) => {
        const isFront = index === 0
        const isSecond = index === 1
        return (
          <div
            key={index}
            className={`jt-herostack__card ${isFront ? 'is-front' : isSecond ? 'is-second' : 'is-back'} ${animating && isFront ? 'is-flipping' : ''}`}
            style={{ zIndex: items.length - index }}
          >
            <Img media={img} alt={`${alt} - ${index + 1}`} sizes="(min-width:1000px) 45vw, 100vw" priority={isFront} />
          </div>
        )
      })}
    </div>
  )
}
