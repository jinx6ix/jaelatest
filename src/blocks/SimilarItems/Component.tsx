import React from 'react'
import type { SimilarItems as SimilarItemsProps, Tour } from '@/payload-types'
import Link from 'next/link'

export const SimilarItemsBlock: React.FC<SimilarItemsProps> = ({ title, tours }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(tours || []).map((tour, i) => {
          const t = tour as Tour
          return (
            <div key={t.id || i} className="bg-card p-6 rounded-lg border border-border">
              <h4 className="text-lg font-bold mb-2">{t.title}</h4>
              <Link href={`/tours/${t.slug}`} className="text-primary hover:underline">
                View Tour
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
