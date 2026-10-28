import React from 'react'
import RichText from '@/components/RichText'
import type { PolicyBlock as PolicyBlockProps } from '@/payload-types'

export const PolicyBlockComponent: React.FC<PolicyBlockProps> = ({ title, content }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="bg-card p-8 rounded-lg border border-border prose prose-slate max-w-none">
        <RichText data={content} />
      </div>
    </div>
  )
}
