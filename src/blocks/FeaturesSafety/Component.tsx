import React from 'react'
import RichText from '@/components/RichText'
import type { FeaturesSafety as FeaturesSafetyProps } from '@/payload-types'
import { ShieldCheck } from 'lucide-react'

export const FeaturesSafetyBlock: React.FC<FeaturesSafetyProps> = ({ items }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">Safety & Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(items || []).map((item, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border border-border flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <div className="prose prose-sm prose-slate max-w-none text-muted-foreground">
                <RichText data={item.description as any} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
