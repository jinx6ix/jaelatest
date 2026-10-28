import React from 'react'
import type { GroupDiscountTable as GroupDiscountTableProps } from '@/payload-types'

export const GroupDiscountTableBlock: React.FC<GroupDiscountTableProps> = ({ discounts }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">Group Discounts</h2>
      <div className="card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-4 text-left">Group Size</th>
              <th className="p-4 text-left">Discount</th>
            </tr>
          </thead>
          <tbody>
            {(discounts || []).map((row, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-4">{row.minPeople} - {row.maxPeople} people</td>
                <td className="p-4 font-bold text-primary">{row.discount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
