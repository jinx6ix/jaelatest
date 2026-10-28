import React from 'react'
import RichText from '@/components/RichText'
type WhyCheaperProps = any

export const WhyCheaperBlock: React.FC<WhyCheaperProps> = ({ content }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-6">Why book with us?</h2>
      <div className="bg-card p-8 rounded-lg border border-border prose prose-slate max-w-none">
        <RichText data={content} />
      </div>
    </div>
  )
}
