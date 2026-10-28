import React from 'react'
import type { FaqBlock as FaqBlockProps } from '@/payload-types'

export const FaqBlock: React.FC<FaqBlockProps> = ({ title, questions }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="space-y-4">
        {(questions || []).map(({ question, answer, id }, i) => (
          <div key={id || i} className="bg-card p-6 rounded-lg border border-border">
            <h4 className="text-lg font-bold mb-2">{question}</h4>
            <p className="text-muted-foreground">{answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
