import type { Payload } from 'payload'

export const seedHomePage = async (payload: Payload) => {
  payload.logger.info('Seeding detailed Home Page based on design/home.html...')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      _status: 'published',
      hero: {
        title: 'Safaris across East Africa, planned by people who live here',
        subtitle: 'Kenya-based · Safari, adventure & transport',
        description: 'Guided and tailor-made tours in Kenya, Tanzania, Uganda and Rwanda, including accessible safaris and safari vehicle hire.',
        // Note: The search form is a UI component in the frontend,
        // but we can add metadata if needed.
      },
      layout: [
        {
          blockType: 'categoryTiles',
          title: 'Choose your kind of safari',
          categories: [
            { title: 'Classic safaris', description: 'Kenya circuits', url: '/en/tours/classic', image: null as any },
            { title: 'Budget safaris', description: 'Shared and camping', url: '/en/tours/budget', image: null as any },
            { title: 'Accessible safaris', description: 'Wheelchair friendly', url: '/en/tours/accessible', image: null as any },
            { title: 'Gorilla trekking', description: 'Uganda and Rwanda', url: '/en/tours/gorilla', image: null as any },
            { title: 'Cultural tours', description: 'People and places', url: '/en/tours/cultural', image: null as any },
            { title: 'Vehicle hire', description: 'Land Cruisers and vans', url: '/en/vehicles', image: null as any },
          ],
        },
        {
          blockType: 'titleBlock',
          title: 'Popular safaris',
        },
        {
          blockType: 'featuredTours',
          title: 'Popular safaris',
          tours: [],
        },
        {
          blockType: 'featuresSafety',
          title: 'Why travel with JaeTravel',
          items: [
            { title: 'Local expertise', description: 'Nairobi-based planners who know the parks, roads and seasons.' },
            { title: 'Accessible travel', description: 'Adapted vehicles and vetted accessible lodges.' },
            { title: 'Tailor-made or guided', description: 'Luxury, mid-range or budget, fixed or custom.' },
            { title: 'Safety-equipped fleet', description: 'First aid, toolkit and fire extinguisher in every vehicle.' },
          ],
        },
        {
          blockType: 'destinationTiles',
          title: 'Where we take you',
          destinations: [
            { title: 'Kenya safaris', description: 'Key parks', url: '/en/destinations/kenya', image: null as any },
            { title: 'Tanzania safaris', description: 'Key parks', url: '/en/destinations/tanzania', image: null as any },
            { title: 'Uganda safaris', description: 'Key parks', url: '/en/destinations/uganda', image: null as any },
            { title: 'Rwanda safaris', description: 'Key parks', url: '/en/destinations/rwanda', image: null as any },
          ],
        },
        {
          blockType: 'cta',
          title: 'Build your own itinerary',
          description: 'Pick destinations, hotels and budget, then get a quotation. Plus: download it as a PDF.',
          ctaText: 'Start building',
        },
        {
          blockType: 'titleBlock',
          title: 'Safari vehicle hire',
        },
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: {
                root: {
                  type: 'root',
                  children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Land Cruisers, extended cruisers, rooftop campers, accessible vehicles and airport transfers.' }] }],
                },
              },
            },
          ],
        },
        {
          blockType: 'bookingCard',
          mode: 'vehicle',
          vehicle: null,
          ctaText: 'View details',
        },
        {
          blockType: 'reviewsBlock',
          title: 'What travellers say',
        },
        {
          blockType: 'howItWorks',
          title: 'How it works',
          steps: [
            { title: 'Tell us your plans', description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Choose a tour or describe your trip.' }] }] },
            { title: 'Get a quote', description: [{ type: 'paragraph', children: [{ type: 'text', text: 'A planner replies within 24 hours.' }] }] },
            { title: 'Travel with confidence', description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Deposit, then we handle the rest.' }] }] },
          ] as any,
        },
        {
          blockType: 'socialFeed',
          title: 'From our journal and socials',
          posts: [],
        },
        {
          blockType: 'cta',
          title: 'Ready to plan your safari?',
          description: 'Tell us your dates and group size. We reply within 24 hours.',
          ctaText: 'Get a quote',
        },
      ],
    } as any,
  })

  payload.logger.info('Detailed Home Page seeded successfully based on design.')
}
