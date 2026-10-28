import React from 'react'
import type { SeatMap as SeatMapProps } from '@/payload-types'

export const SeatMapBlock: React.FC<SeatMapProps> = ({ imageUrl, caption }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">Vehicle Seating Plan</h2>
      <div className="card p-4 flex flex-col items-center">
        <img
          src={imageUrl}
          alt="Vehicle Seat Map"
          className="max-w-full h-auto rounded-lg"
        />
        {caption && <p className="mt-4 text-muted-foreground text-center">{caption}</p>}
      </div>
    </div>
  )
}
