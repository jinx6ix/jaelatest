import React from 'react'
import type { Gallery as GalleryProps } from '@/payload-types'

export const GalleryBlock: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="container my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(images || []).map(({ image, id }, i) => {
          const img = image as any
          return (
            <div key={id || i} className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
              {img?.url ? (
                <img src={img.url} alt={img.alt || 'Gallery image'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
