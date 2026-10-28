import React from 'react'
import type { ReviewsBlock as ReviewsBlockProps } from '@/payload-types'

export const ReviewsBlock: React.FC<ReviewsBlockProps> = ({ title, reviews }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="text-muted-foreground p-6 bg-card rounded-lg border border-border">
          {/* Placeholder for reviews content */}
          <p>Reviews content placeholder</p>
      </div>
    </div>
  )
}
