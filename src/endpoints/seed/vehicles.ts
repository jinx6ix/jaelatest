import type { Payload } from 'payload'

export const seedVehicleHirePage = async (payload: Payload) => {
  payload.logger.info('Seeding Vehicle Hire Page...')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Vehicle Hire',
      slug: 'vehicles',
      _status: 'published',
      hero: {
        title: 'Safari vehicle hire in Kenya, with expert driver-guides',
        subtitle: 'Vehicle hire · Nairobi, Kenya',
        description: 'Land Cruisers, extended photography cruisers, rooftop campers and wheelchair-accessible vehicles. Safety-equipped, 24/7 airport transfers.',
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
                    { type: 'paragraph', children: [{ type: 'text', text: 'Land Cruisers, extended photography cruisers, rooftop campers and wheelchair-accessible vehicles. Safety-equipped, 24/7 airport transfers.' }] },
                  ],
                },
              },
            },
          ],
        },
      ],
    } as any,
  })
}
