import React from 'react'
import type { Newsletter as NewsletterProps } from '@/payload-types'

export const NewsletterBlock: React.FC<NewsletterProps> = ({ title, description }) => {
  return (
    <div className="bg-primary text-primary-foreground p-12 rounded-2xl my-12 text-center">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {description && <p className="mb-8 opacity-90">{description}</p>}
      <form className="max-w-md mx-auto flex gap-2">
        <input type="email" placeholder="Your email address" className="flex-grow p-3 rounded-lg text-black" />
        <button type="submit" className="bg-black text-white px-6 py-3 rounded-lg font-bold">Subscribe</button>
      </form>
    </div>
  )
}
