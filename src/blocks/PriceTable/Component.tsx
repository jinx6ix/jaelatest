import React from 'react'
import type { PriceTable as PriceTableProps } from '@/payload-types'

export const PriceTableBlock: React.FC<PriceTableProps> = ({ tableData }) => {
  return (
    <div className="container my-12">
      <h2 className="text-3xl font-bold mb-8">Pricing</h2>
      <div className="card overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <tbody>
            {(tableData || []).map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border first:border-t-0">
                {(row.row || []).map((cell, cellIndex) => (
                  <td key={cellIndex} className={`p-4 ${cellIndex === 0 ? 'font-bold bg-muted/50' : ''}`}>
                    {cell.cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
