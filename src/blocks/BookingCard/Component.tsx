import React from 'react'
import type { BookingCard as BookingCardProps } from '@/payload-types'

export const BookingCardBlock: React.FC<BookingCardProps> = ({ mode, ctaText }) => {
  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-lg">
      <h3 className="text-xl font-bold mb-4 capitalize">{mode} Booking</h3>
      <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold">
        {ctaText || 'Book Now'}
      </button>
    </div>
  )
}
