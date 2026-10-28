import React from 'react'
import RichText from '@/components/RichText'
import type { HowItWorks as HowItWorksProps } from '@/payload-types'

export const HowItWorksBlock: React.FC<HowItWorksProps> = ({ steps }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">How it works</h2>
      <div className="space-y-6">
        {(steps || []).map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              {i + 1}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <div className="prose prose-slate max-w-none text-muted-foreground">
                <RichText data={step.description as any} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
