import React from 'react'
import Link from 'next/link'
import { Media } from '@/payload-types'
import type { SocialFeed as SocialFeedProps } from '@/payload-types'
import Image from 'next/image'

export const SocialFeedBlock: React.FC<SocialFeedProps> = ({ title, posts }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(posts || []).map((post, i) => (
          <Link
            key={post.id || i}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-square w-full overflow-hidden rounded-xl bg-muted transition-transform hover:scale-105"
          >
            {post.image && typeof post.image !== 'string' && (
              <Image
                src={(post.image as Media).url || ''}
                alt="Social media post"
                width={300}
                height={300}
                className="h-full w-full object-cover"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
