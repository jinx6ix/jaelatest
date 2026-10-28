import React from 'react'
import type { IncludedExcluded as IncludedExcludedProps } from '@/payload-types'
import { Check, X } from 'lucide-react'

export const IncludedExcludedBlock: React.FC<IncludedExcludedProps> = ({ included, excluded }) => {
  return (
    <div className="container my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Check className="mr-2 text-green-500" /> Included
        </h3>
        <ul className="space-y-2">
          {included.map(({ item, id }, i) => (
            <li key={id || i} className="text-muted-foreground">{item}</li>
          ))}
        </ul>
      </div>
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <X className="mr-2 text-red-500" /> Excluded
        </h3>
        <ul className="space-y-2">
          {excluded.map(({ item, id }, i) => (
            <li key={id || i} className="text-muted-foreground">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
