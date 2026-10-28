import type { Payload } from 'payload'

export const seedAboutPage = async (payload: Payload) => {
  payload.logger.info('Seeding About Page...')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'About JaeTravel',
      slug: 'about',
      _status: 'published',
      hero: {
        title: 'Your Kenya-based tour operator for safari, adventure and transport',
        subtitle: 'About JaeTravel Expeditions',
        description: 'Planners, driver-guides and a safety-equipped fleet, based in Nairobi and covering Kenya, Tanzania, Uganda and Rwanda.',
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
          blockType: 'content', // Simple content block for "Our story"
          columns: [
            {
              size: 'full',
              richText: {
                root: {
                  type: 'root',
                  children: [
                    { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Our story' }] },
                    { type: 'paragraph', children: [{ type: 'text', text: '[Who started JaeTravel, why, and what makes the company different. Keep it specific and true: where you are based, who guides, what you care about.]' }] },
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
