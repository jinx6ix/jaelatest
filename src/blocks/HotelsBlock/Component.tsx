import React from 'react'
import type { HotelsBlock as HotelsBlockProps, Hotel } from '@/payload-types'

export const HotelsBlock: React.FC<HotelsBlockProps> = ({ hotels }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">Hotels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(hotels || []).map(({ hotel, description, id }, i) => {
          const hotelData = hotel as Hotel
          return (
            <div key={id || i} className="bg-card p-6 rounded-lg border border-border">
              <h4 className="text-lg font-bold">{hotelData.name}</h4>
              <p className="text-muted-foreground">{description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
