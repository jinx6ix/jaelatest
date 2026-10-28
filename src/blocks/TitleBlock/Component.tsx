import React from 'react'
import type { TitleBlock as TitleBlockProps } from '@/payload-types'

export const TitleBlock: React.FC<TitleBlockProps> = ({ title, summary }) => {
  return (
    <div className="container my-12 text-center">
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      {summary && <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{summary}</p>}
    </div>
  )
}
