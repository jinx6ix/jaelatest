import React from 'react'
import type { Itinerary as ItineraryProps } from '@/payload-types'
import RichText from '@/components/RichText'

export const ItineraryBlock: React.FC<ItineraryProps> = ({ days }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">Itinerary</h2>
      <div className="space-y-4">
        {(days || []).map(({ title, body, hotel, meals, id }, i) => (
          <details key={id || i} className="bg-card p-6 rounded-lg border border-border" open={i === 0}>
            <summary className="text-lg font-bold cursor-pointer">Day {i + 1}: {title}</summary>
            <div className="mt-4 text-muted-foreground prose">
              <RichText data={body} />
              {meals && meals.length > 0 && <p className="mt-2 text-sm font-medium">Meals: {meals.join(', ')}</p>}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
