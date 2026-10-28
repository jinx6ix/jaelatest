import React from 'react'
import RichText from '@/components/RichText'
import type { WhatToExpect as WhatToExpectProps } from '@/payload-types'

export const WhatToExpectBlock: React.FC<WhatToExpectProps> = ({ items }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">What to expect</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(items || []).map((item, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <div className="prose prose-slate max-w-none text-muted-foreground">
              <RichText data={item.description} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
