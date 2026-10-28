import React from 'react'
import Link from 'next/link'
import { Media } from '@/payload-types'
import type { DestinationTiles as DestinationTilesProps } from '@/payload-types'
import Image from 'next/image'

export const DestinationTilesBlock: React.FC<DestinationTilesProps> = ({ title, destinations }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(destinations || []).map((dest, i) => (
          <Link
            key={dest.id || i}
            href={dest.url}
            className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
              {dest.image && typeof dest.image !== 'string' && (
                <Image
                  src={(dest.image as Media).url || ''}
                  alt={dest.title || 'Destination image'}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-4">
              <div className="font-bold text-lg group-hover:text-primary transition-colors">{dest.title}</div>
              {dest.description && <div className="text-sm text-muted-foreground">{dest.description}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
