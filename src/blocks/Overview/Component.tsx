import React from 'react'
import type { Overview as OverviewProps } from '@/payload-types'
import RichText from '@/components/RichText'

export const OverviewBlock: React.FC<OverviewProps> = ({ content }) => {
  return (
    <div className="container my-12">
      <div className="prose max-w-none text-muted-foreground">
        <RichText data={content} />
      </div>
    </div>
  )
}
