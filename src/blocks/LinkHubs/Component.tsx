import React from 'react'
import type { LinkHubsBlock as LinkHubsBlockProps } from '@/payload-types'
import Link from 'next/link'

export const LinkHubsBlock: React.FC<LinkHubsBlockProps> = ({ title, links }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="flex flex-wrap gap-4">
        {(links || []).map(({ label, url, id }, i) => (
          <Link key={id || i} href={url} className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition">
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
