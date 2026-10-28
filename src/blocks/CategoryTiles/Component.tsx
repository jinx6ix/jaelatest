import React from 'react'
import Link from 'next/link'
import { Media } from '@/payload-types'
import type { CategoryTiles as CategoryTilesProps } from '@/payload-types'
import Image from 'next/image'

export const CategoryTilesBlock: React.FC<CategoryTilesProps> = ({ title, categories }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(categories || []).map((cat, i) => (
          <Link
            key={cat.id || i}
            href={cat.url}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {cat.image && typeof cat.image !== 'string' && (
                <Image
                  src={(cat.image as Media).url || ''}
                  alt={cat.title || 'Category image'}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-4">
              <div className="font-bold text-lg group-hover:text-primary transition-colors">{cat.title}</div>
              {cat.description && <div className="text-sm text-muted-foreground line-clamp-2">{cat.description}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
