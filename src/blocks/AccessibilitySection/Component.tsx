import React from 'react'
import type { AccessibilitySection as AccessibilitySectionProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { Accessibility } from 'lucide-react'

export const AccessibilitySectionBlock: React.FC<AccessibilitySectionProps> = ({ content }) => {
  return (
    <div className="container my-12 bg-muted p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Accessibility className="mr-2" /> Accessibility
      </h2>
      <div className="prose max-w-none text-muted-foreground">
        <RichText data={content} />
      </div>
    </div>
  )
}
