import React from 'react'
import type { StickyTabs as StickyTabsProps } from '@/payload-types'

export const StickyTabsBlock: React.FC<StickyTabsProps> = ({ tabs }) => {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border py-4">
      <div className="container flex gap-4 overflow-x-auto">
        {(tabs || []).map(({ title, id }, i) => (
          <button
            key={id || i}
            className="px-4 py-2 rounded-full hover:bg-muted transition"
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  )
}
