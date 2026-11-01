import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import React from 'react'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'JaeTravel Expeditions'
  const subtitle = searchParams.get('subtitle') || 'Safari Tours & Vehicle Hire in Kenya'
  const price = searchParams.get('price')

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#111827',
          padding: '60px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        },
      },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', width: '100%' } },
        React.createElement('span', { style: { fontSize: 24, fontWeight: 700, color: '#E1A03E' } }, 'JAETRAVEL EXPEDITIONS'),
        React.createElement('span', { style: { fontSize: 18, color: '#9CA3AF' } }, 'www.jaetravel.co.ke')
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' } },
        React.createElement('h1', { style: { fontSize: 56, fontWeight: 800, margin: 0, color: '#FFFFFF' } }, title),
        React.createElement('p', { style: { fontSize: 28, color: '#E5E7EB', margin: 0 } }, subtitle)
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', width: '100%' } },
        React.createElement('span', { style: { fontSize: 20, color: '#9CA3AF' } }, 'Nairobi, Kenya'),
        price ? React.createElement('div', { style: { background: '#E1A03E', color: '#111827', padding: '12px 24px', borderRadius: '8px', fontSize: 24, fontWeight: 700 } }, `From $${price} USD`) : null
      )
    ),
    { width: 1200, height: 630 }
  )
}
