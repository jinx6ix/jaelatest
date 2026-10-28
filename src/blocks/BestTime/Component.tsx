import React from 'react'
import type { BestTimeBlock as BestTimeBlockProps } from '@/payload-types'
import Link from 'next/link'

export const BestTimeBlock: React.FC<BestTimeBlockProps> = ({ title, description, items }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-2 font-heading">{title}</h2>
      <p className="text-muted-foreground mb-8">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item, index) => (
          <div key={index} className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-muted-foreground mb-4">{item.description}</p>
            {item.link && (
              <Link href={item.link.url} className="text-primary font-bold hover:underline">
                {item.link.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
