'use client'

import React, { useState } from 'react'
import type { Tour } from '@/payload-types'
import type { RoutesMap } from '@/lib/routes'
import type { TFn } from '@/i18n'
import { TourCard } from './Cards'

export function TourListingClient({
  tours,
  routes,
  locale,
  t,
}: {
  tours: Tour[]
  routes: RoutesMap
  locale: string
  t: TFn
}) {
  const [page, setPage] = useState(1)
  const pageSize = 9
  const totalPages = Math.ceil(tours.length / pageSize) || 1
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, tours.length)
  const currentTours = tours.slice(startIndex, endIndex)

  return (
    <div>
      {tours.length ? (
        <>
          <div className="jt-grid jt-grid--3" style={{ marginBottom: '2.5rem' }}>
            {currentTours.map((x, i) => (
              <TourCard key={x.id} tour={x} routes={routes} locale={locale} t={t} priority={i < 3} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--jt-muted)' }}>
                Showing {startIndex + 1}–{endIndex} of {tours.length} safaris
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="jt-btn jt-btn--line jt-btn--sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span style={{ font: '600 0.95rem var(--font-body)' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="jt-btn jt-btn--brand jt-btn--sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="jt-empty">{t('listing.empty')}</p>
      )}
    </div>
  )
}
