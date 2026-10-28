import React from 'react'
import Link from 'next/link'
import { Media, Tour } from '@/payload-types'
import type { FeaturedTours as FeaturedToursProps } from '@/payload-types'
import Image from 'next/image'

export const FeaturedToursBlock: React.FC<FeaturedToursProps> = ({ title, subtitle, tours, viewAllUrl }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(tours || []).map((tour, i) => {
          if (typeof tour === 'string') return null
          const tourData = tour as Tour
          return (
            <Link
              key={tourData.id}
              href={`/tours/${tourData.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {tourData.heroImage && typeof tourData.heroImage !== 'string' && (
                  <Image
                    src={(tourData.heroImage as Media).url || ''}
                    alt={tourData.title || 'Tour image'}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{tourData.title}</div>
                {/* Assuming tourData.description exists, need to check types if needed, or use a simple summary field */}
                <div className="text-sm text-muted-foreground mb-4">{(tourData as any).shortDescription}</div>
                <div className="text-sm text-muted-foreground">
                    {/* Placeholder for duration/price */}
                    {(tourData as any).duration} days · from {(tourData as any).price}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      {viewAllUrl && (
        <div className="mt-8">
            <Link href={viewAllUrl} className="inline-flex items-center justify-center rounded-lg border border-primary px-6 py-3 font-bold text-primary hover:bg-primary/10">
                View all tours
            </Link>
        </div>
      )}
    </div>
  )
}
