import React from 'react'
import type { SpecsTable as SpecsTableProps } from '@/payload-types'

export const SpecsTableBlock: React.FC<SpecsTableProps> = ({ specs }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">Vehicle Specifications</h2>
      <div className="card overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            {(specs || []).map((spec, i) => (
              <tr key={i} className="border-t border-border first:border-t-0">
                <td className="p-4 font-medium bg-muted/50 w-1/3">{spec.label}</td>
                <td className="p-4">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
