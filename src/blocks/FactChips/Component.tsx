import React from 'react'
import type { FactChips as FactChipsProps } from '@/payload-types'

export const FactChipsBlock: React.FC<FactChipsProps> = ({ facts }) => {
  return (
    <div className="container my-12">
      <div className="flex flex-wrap gap-4">
        {(facts || []).map(({ label, value, id }, i) => (
          <div key={id || i} className="bg-muted px-4 py-2 rounded-full border border-border flex items-center gap-2">
            <span className="font-bold">{label}:</span>
            <span className="text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
