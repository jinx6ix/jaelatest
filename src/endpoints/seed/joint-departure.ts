import type { Payload } from 'payload'

export const seedJointDeparturePage = async (payload: Payload) => {
  payload.logger.info('Seeding Joint Departure Page based on design/joint-departure.html...')

  await payload.create({
    collection: 'pages',
    data: {
      title: '6-day Masai Mara & Amboseli Joint Departure',
      slug: 'joint-departure-6day',
      _status: 'published',
      hero: {
        title: '6-day Masai Mara & Amboseli Group Safari',
        subtitle: 'Joint departure [12 – 17 Nov]. Book your own seat in a shared Land Cruiser.',
        description: 'Guaranteed departure',
        type: 'highImpact',
        richText: {
          root: {
            type: 'root',
            children: [],
          },
        },
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: {
                root: {
                  type: 'root',
                  children: [
                    { type: 'paragraph', children: [{ type: 'text', text: 'Live from bookings. Seat numbers are for group size only, seating rotates [daily].' }] },
                  ],
                },
              },
            },
          ],
        },
        {
          blockType: 'itinerary',
          days: [
            { title: 'Day 1', body: { root: { type: 'root', children: [{ type: 'text', text: 'Nairobi to Masai Mara' }] } }, hotel: null, meals: null },
            { title: 'Day 2', body: { root: { type: 'root', children: [{ type: 'text', text: 'Full day in the Mara' }] } }, hotel: null, meals: null },
            { title: 'Day 3', body: { root: { type: 'root', children: [{ type: 'text', text: 'Mara River and culture' }] } }, hotel: null, meals: null },
            { title: 'Day 4', body: { root: { type: 'root', children: [{ type: 'text', text: 'Transfer to Amboseli' }] } }, hotel: null, meals: null },
            { title: 'Day 5', body: { root: { type: 'root', children: [{ type: 'text', text: 'Amboseli elephants' }] } }, hotel: null, meals: null },
            { title: 'Day 6', body: { root: { type: 'root', children: [{ type: 'text', text: 'Return to Nairobi' }] } }, hotel: null, meals: null },
          ],
        },
        {
          blockType: 'priceTable',
          tableData: [
            { row: [{ cell: 'Accommodation' }, { cell: 'Twin share' }, { cell: 'Single room' }] },
            { row: [{ cell: '[Mid-range lodges]' }, { cell: '$[price]' }, { cell: '$[price]' }] },
            { row: [{ cell: '[Budget camping]' }, { cell: '$[price]' }, { cell: '$[price]' }] },
          ],
        },
        {
          blockType: 'includedExcluded',
          included: [
            { item: '[Seat in 4x4 Land Cruiser]' },
            { item: '[Accommodation, full board]' },
            { item: '[Park fees, driver-guide]' },
          ],
          excluded: [
            { item: '[Flights, visas, insurance]' },
            { item: '[Tips, drinks]' },
          ],
        },
        {
          blockType: 'faqBlock',
          title: 'Questions',
          questions: [
            { question: 'Who will I travel with?', answer: '[Answer.]' },
            { question: 'Can I choose my seat?', answer: '[Answer.]' },
            { question: 'Can I add friends to my booking later?', answer: '[Answer.]' },
            { question: 'What happens at the pick-up?', answer: '[Answer.]' },
          ],
        },
        {
          blockType: 'departureList',
          showUpcoming: true,
        },
        {
          blockType: 'featuresSafety',
          title: 'More departures of this safari',
          items: [
            { title: '26 Nov', description: '[6] days' },
            { title: '03 Dec', description: '[6] days' },
          ],
        },
        {
          blockType: 'cta',
          title: 'Reserve your seat',
          description: 'Select your seats and accommodation below',
          ctaText: 'Reserve [N] seat(s)',
        },
      ],
    } as any,
  })

  payload.logger.info('Joint Departure Page seeded successfully.')
}