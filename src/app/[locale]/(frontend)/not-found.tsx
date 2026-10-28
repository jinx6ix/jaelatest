import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <section className="jt-pagehead">
      <div className="jt-wrap">
        <h1>404</h1>
        <p>This page could not be found. It may have moved, or the offer may have ended.</p>
        <p>
          <Link className="jt-btn jt-btn--brand" href="/">
            Go to the home page
          </Link>{' '}
          <Link className="jt-btn jt-btn--line" href="/en/tours">
            Browse safaris
          </Link>
        </p>
      </div>
    </section>
  )
}
