import React from 'react'
import type { CtaBand as CtaBandProps } from '@/payload-types'
import Link from 'next/link'

export const CtaBandBlock: React.FC<CtaBandProps> = ({ title, buttonText, url }) => {
  return (
    <div className="bg-muted p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 my-12 border border-border">
      <h3 className="text-2xl font-bold">{title}</h3>
      <Link href={url} className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold">
        {buttonText}
      </Link>
    </div>
  )
}
