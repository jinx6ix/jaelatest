import React from 'react'
import RichText from '@/components/RichText'
import type { TermsFaq as TermsFAQProps } from '@/payload-types'

export const TermsFAQBlock: React.FC<TermsFAQProps> = ({ content }) => {
  return (
    <div className="container my-12">
      <div className="prose prose-slate max-w-none">
        <RichText data={content} />
      </div>
    </div>
  )
}
