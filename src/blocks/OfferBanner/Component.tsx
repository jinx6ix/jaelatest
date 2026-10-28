import React from 'react'
type OfferBannerProps = any
import Link from 'next/link'

export const OfferBannerBlock: React.FC<OfferBannerProps> = ({ title, description, link, backgroundColor }) => {
  const bgClass = backgroundColor === 'gold' ? 'border-l-orange-500 bg-orange-50' : 'bg-card'

  return (
    <div className={`my-12 p-6 rounded-lg border border-border ${bgClass} border-l-4`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {link && typeof link === 'object' && (
        <Link href={`/${link.slug}`} className="text-primary font-bold hover:underline">
          View Offer
        </Link>
      )}
    </div>
  )
}
