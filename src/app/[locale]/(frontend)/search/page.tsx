import type { Metadata } from 'next'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { buildMetadata } from '@/lib/seo'
import { getSiteContext } from '@/lib/site'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ params, searchParams: searchParamsPromise }: Args) {
  const { locale = 'en' } = await params
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    locale: locale as any,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search Tours & Articles</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container text-center py-12">No results found.</div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale = 'en' } = await params
  const ctx = await getSiteContext(locale)
  return buildMetadata({
    ctx,
    path: '/search',
    title: 'Search Expeditions & Articles',
    description: 'Search across all African safaris, tours, and travel articles on JaeTravel Expeditions.',
  })
}
