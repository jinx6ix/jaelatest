import React from 'react'
import type { DepartureList as DepartureListProps } from '@/payload-types'

export const DepartureListBlock: React.FC<DepartureListProps> = ({ showUpcoming }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">
        {showUpcoming ? 'Upcoming Departures' : 'All Departures'}
      </h2>
      <div className="bg-card p-6 rounded-lg border border-border text-muted-foreground">
        <p>Departure list placeholder - active data from JointDepartures collection</p>
      </div>
    </div>
  )
}
