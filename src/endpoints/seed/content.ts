/**
 * Sample content for the seed. Everything here is placeholder text to replace in the admin.
 * Prices are US dollars per person for 2 travellers in the Low season (other tiers and seasons are derived in index.ts).
 */
export type TourSeed = {
  title: string
  variant: 'standard' | 'budget' | 'accessible' | 'migration'
  destination: string
  days: number
  base: number
  featured?: boolean
  image: string
  gallery: string[]
  summary: string
  highlights: string[]
  start: string
  end: string
  pace: 'easy' | 'moderate' | 'active'
  itinerary: [string, string][]
  included: string[]
  excluded: string[]
  whyCheaper?: string
  accessibility?: { summary: string; features: string[]; vehicle?: string }
  related?: string[]
}

const COMMON_EXCLUDED = ['International and domestic flights', 'Visas and travel insurance', 'Drinks and meals not listed', 'Optional activities', 'Tips for your guide and lodge staff']

export const DESTINATIONS = [
  { name: 'Masai Mara', country: 'KE', image: 'mara-sunset', description: 'Open plains, big cats and, in season, the Great Migration.' },
  { name: 'Amboseli', country: 'KE', image: 'amboseli-elephants', description: 'Large elephant herds with Mount Kilimanjaro in the background.' },
  { name: 'Lakes Nakuru and Naivasha', country: 'KE', image: 'nakuru-giraffes', description: 'Rift Valley lakes, giraffes, rhinos and birdlife close to Nairobi.' },
  { name: 'Samburu', country: 'KE', image: 'samburu-reticulated', description: 'Dry northern country with species you will not see in the south.' },
  { name: 'Mount Kenya', country: 'KE', image: 'mount-kenya', description: 'Forest, moorland and the second highest peak in Africa.' },
  { name: 'Kenya Coast', country: 'KE', image: 'coast-dhow', description: 'Warm sea, white sand and dhow trips for the end of a safari.' },
]

export const VEHICLES = [
  { name: 'Safari Land Cruiser', type: 'land-cruiser', seats: 6, image: 'vehicle-landcruiser', accessible: false, summary: 'A pop-up roof 4x4 with a window seat for every guest.', features: ['Pop-up roof for photography', 'Window seat for every guest', 'Charging points', 'Cool box and drinking water'], specs: [['Seats', '6 guests plus driver-guide'], ['Roof', 'Pop-up'], ['Drive', '4x4']], rates: [['Per day with driver-guide (sample)', 21000, 'day']] },
  { name: 'Extended Land Cruiser', type: 'extended-land-cruiser', seats: 8, image: 'vehicle-landcruiser', accessible: false, summary: 'More room for families and small groups.', features: ['Extra row of seats', 'Pop-up roof', 'Luggage space'], specs: [['Seats', '8 guests plus driver-guide'], ['Roof', 'Pop-up']], rates: [['Per day with driver-guide (sample)', 25000, 'day']] },
  { name: 'Safari Van', type: 'safari-van', seats: 7, image: 'vehicle-van', accessible: false, summary: 'A comfortable pop-up roof van for great value group trips.', features: ['Pop-up roof', 'Air conditioning', 'Window seats'], specs: [['Seats', '7 guests plus driver-guide']], rates: [['Per day with driver-guide (sample)', 16000, 'day']] },
  { name: 'Accessible Safari Vehicle', type: 'accessible', seats: 4, image: 'vehicle-accessible', accessible: true, summary: 'A safari vehicle adapted for wheelchair users, with a lift or ramp.', features: ['Lift or ramp for wheelchair access', 'Wheelchair securing points', 'Driver-guide trained to assist'], specs: [['Seats', 'Sample: 4 guests plus 1 wheelchair space'], ['Access', 'Lift or ramp (confirm details with us)']], rates: [['Per day with driver-guide (sample)', 30000, 'day']] },
]

export const HOTELS = [
  { name: 'Riverside Tented Camp', location: 'Masai Mara', stars: 4, stepFree: false },
  { name: 'Savannah View Lodge', location: 'Masai Mara', stars: 4, stepFree: true },
  { name: 'Kilimanjaro View Lodge', location: 'Amboseli', stars: 3, stepFree: true },
  { name: 'Lakeside Campsite', location: 'Lake Naivasha', stars: 2, stepFree: false },
  { name: 'Rift Valley Lodge', location: 'Lake Nakuru', stars: 3, stepFree: true },
]

const MARA_DAYS: [string, string][] = [
  ['Nairobi to the Masai Mara', 'After pick-up in Nairobi you drive to the Mara, with a stop for lunch on the way. Settle in and head out for a first game drive in the late afternoon light.'],
  ['A full day in the reserve', 'Two game drives with time at the lodge in the middle of the day. Your driver-guide follows the wildlife, not the clock, so you can stay with a sighting as long as you like.'],
  ['Plains and local culture', 'An early drive when the cats are most active, then an optional visit to a Maasai community to learn how people live alongside the wildlife.'],
  ['Return to Nairobi', 'Breakfast, a last short drive and the road back to Nairobi for your drop-off at the airport or your hotel.'],
]

export const TOURS: TourSeed[] = [
  {
    title: 'Masai Mara Classic Safari', variant: 'standard', destination: 'Masai Mara', days: 4, base: 760, featured: true, image: 'mara-sunset', gallery: ['lions-savanna', 'balloons-mara', 'migration-river'],
    summary: 'Four days in the Masai Mara with a private 4x4, a driver-guide, game drives every day and comfortable lodge stays.',
    highlights: ['Big cat territory with lions, cheetah and leopard', 'Private 4x4 with a pop-up roof, so you set the pace', 'Optional balloon flight over the plains', 'Lift-equipped vehicle and step-free rooms on request'],
    start: 'Nairobi', end: 'Nairobi', pace: 'easy', itinerary: MARA_DAYS,
    included: ['Pick-up and drop-off in Nairobi', '3 nights’ accommodation, full board', 'Private 4x4 with a pop-up roof', 'Professional driver-guide', 'Reserve entry fees', 'Bottled water on game drives'], excluded: ['Balloon safari (optional extra)', ...COMMON_EXCLUDED],
    related: ['Amboseli and Tsavo Safari', 'Great Migration Mara River Safari'],
  },
  {
    title: 'Amboseli and Tsavo Safari', variant: 'standard', destination: 'Amboseli', days: 5, base: 960, featured: true, image: 'amboseli-elephants', gallery: ['mount-kenya', 'samburu-reticulated'],
    summary: 'Elephants with Kilimanjaro behind them in Amboseli, then the wide red country of Tsavo.',
    highlights: ['Large elephant herds in Amboseli', 'Views of Mount Kilimanjaro on clear mornings', 'Quiet Tsavo with far fewer vehicles', 'Private vehicle and driver-guide throughout'],
    start: 'Nairobi', end: 'Nairobi', pace: 'easy',
    itinerary: [
      ['Nairobi to Amboseli', 'Drive south to Amboseli National Park, arriving in time for an afternoon game drive among the elephant herds.'],
      ['Amboseli', 'A sunrise drive for the best chance of seeing Kilimanjaro, a break at the lodge, then another drive in the afternoon.'],
      ['Amboseli to Tsavo', 'Cross to Tsavo with a game drive on the way. The landscape changes from open plains to red earth and baobabs.'],
      ['Tsavo', 'A full day exploring Tsavo with your driver-guide, including a picnic lunch in the bush.'],
      ['Return to Nairobi', 'A relaxed morning drive, then the journey back to Nairobi.'],
    ],
    included: ['Pick-up and drop-off in Nairobi', '4 nights’ accommodation, full board', 'Private 4x4 with a pop-up roof', 'Professional driver-guide', 'Park entry fees'], excluded: COMMON_EXCLUDED, related: ['Accessible Amboseli Safari', 'Masai Mara Classic Safari'],
  },
  {
    title: 'Samburu Wildlife Safari', variant: 'standard', destination: 'Samburu', days: 6, base: 1180, image: 'samburu-reticulated', gallery: ['mount-kenya'],
    summary: 'Northern Kenya’s dry country, with wildlife that is different from the south, and a long, unhurried route.',
    highlights: ['Species found mainly in the north', 'Riverside game viewing', 'Fewer visitors, more space', 'Time in the Mount Kenya foothills'],
    start: 'Nairobi', end: 'Nairobi', pace: 'moderate',
    itinerary: [
      ['Nairobi to Mount Kenya foothills', 'A scenic drive north with a lunch stop and an easy evening at the lodge.'],
      ['To Samburu', 'Continue north into Samburu with a game drive on arrival.'],
      ['Samburu', 'Full day of game drives along the river.'],
      ['Samburu', 'Morning and afternoon drives, with the middle of the day at camp.'],
      ['Samburu to the foothills', 'A last morning drive, then the road south.'],
      ['Return to Nairobi', 'Breakfast and the drive back to Nairobi.'],
    ],
    included: ['Pick-up and drop-off in Nairobi', '5 nights’ accommodation, full board', 'Private 4x4', 'Professional driver-guide', 'Park entry fees'], excluded: COMMON_EXCLUDED,
  },
  {
    title: 'Nakuru and Naivasha Camping Safari', variant: 'budget', destination: 'Lakes Nakuru and Naivasha', days: 3, base: 420, featured: true, image: 'camp-night', gallery: ['nakuru-giraffes', 'mount-kenya'],
    summary: 'A three-day camping safari to the Rift Valley lakes with a shared vehicle and honest prices.',
    highlights: ['Giraffes, rhinos and flamingos at Lake Nakuru', 'Boat ride on Lake Naivasha', 'Camping under the stars', 'Easy distances from Nairobi'],
    start: 'Nairobi', end: 'Nairobi', pace: 'easy',
    itinerary: [
      ['Nairobi to Lake Naivasha', 'Drive to Naivasha, set up camp and enjoy a boat ride on the lake in the afternoon.'],
      ['Lake Nakuru', 'A full day of game drives at Lake Nakuru National Park, with a picnic lunch.'],
      ['Return to Nairobi', 'Breakfast at camp and the drive back to Nairobi.'],
    ],
    included: ['Pick-up and drop-off in Nairobi', '2 nights camping with tents and bedding', 'Shared safari vehicle', 'Driver-guide', 'Meals as listed', 'Park entry fees'], excluded: COMMON_EXCLUDED,
    whyCheaper: 'You travel in a shared vehicle, camp instead of staying in a lodge and eat simple camp meals. The routes, guides and park time are the same as on our other safaris.',
    related: ['Budget Masai Mara Camping Safari'],
  },
  {
    title: 'Budget Masai Mara Camping Safari', variant: 'budget', destination: 'Masai Mara', days: 4, base: 560, image: 'mara-sunset', gallery: ['lions-savanna', 'migration-river'],
    summary: 'The Masai Mara on a budget: camping, a shared vehicle and full days in the reserve.',
    highlights: ['Full game drives in the Masai Mara', 'Camping close to the reserve', 'Shared vehicle to keep costs down', 'Experienced driver-guide'],
    start: 'Nairobi', end: 'Nairobi', pace: 'moderate', itinerary: MARA_DAYS,
    included: ['Pick-up and drop-off in Nairobi', '3 nights camping', 'Shared 4x4 safari vehicle', 'Driver-guide', 'Reserve entry fees', 'Meals as listed'], excluded: COMMON_EXCLUDED,
    whyCheaper: 'Camping instead of lodges and a shared vehicle are what bring the price down. You still get full days in the reserve with an experienced guide.',
    related: ['Masai Mara Classic Safari'],
  },
  {
    title: 'Great Migration Mara River Safari', variant: 'migration', destination: 'Masai Mara', days: 5, base: 1350, featured: true, image: 'migration-river', gallery: ['mara-sunset', 'lions-savanna'],
    summary: 'Time your Masai Mara safari with the wildebeest herds and the Mara River crossings.',
    highlights: ['Large herds on the plains', 'Time at river crossing points', 'Extra days to wait for the action', 'Experienced migration guides'],
    start: 'Nairobi', end: 'Nairobi', pace: 'moderate',
    itinerary: [
      ['Nairobi to the Masai Mara', 'Drive to the Mara and take a first game drive in the afternoon.'],
      ['Plains and herds', 'Follow the herds across the plains with your guide.'],
      ['The Mara River', 'A full day at the river crossing points. Crossings cannot be promised, but your guide knows where and when to wait.'],
      ['More time with the herds', 'Another day on the move, with a picnic lunch.'],
      ['Return to Nairobi', 'Breakfast, a last drive and the road back to Nairobi.'],
    ],
    included: ['Pick-up and drop-off in Nairobi', '4 nights’ accommodation, full board', 'Private 4x4 with a pop-up roof', 'Migration-experienced driver-guide', 'Reserve entry fees'], excluded: COMMON_EXCLUDED,
    related: ['Migration Camping Safari', 'Masai Mara Classic Safari'],
  },
  {
    title: 'Migration Camping Safari', variant: 'migration', destination: 'Masai Mara', days: 4, base: 980, image: 'migration-river', gallery: ['camp-night', 'mara-sunset'],
    summary: 'Follow the herds from a camp close to the action, for a more affordable migration safari.',
    highlights: ['Camp close to the migration route', 'Shared vehicle to keep costs down', 'Full days following the herds', 'Evenings by the campfire'],
    start: 'Nairobi', end: 'Nairobi', pace: 'moderate', itinerary: MARA_DAYS,
    included: ['Pick-up and drop-off in Nairobi', '3 nights camping', 'Shared 4x4 safari vehicle', 'Driver-guide', 'Reserve entry fees'], excluded: COMMON_EXCLUDED,
    related: ['Great Migration Mara River Safari'],
  },
  {
    title: 'Accessible Masai Mara Safari', variant: 'accessible', destination: 'Masai Mara', days: 4, base: 1120, featured: true, image: 'vehicle-accessible', gallery: ['mara-sunset', 'lions-savanna'],
    summary: 'A Masai Mara safari planned around your access needs, with an adapted vehicle and a guide trained to assist.',
    highlights: ['Adapted safari vehicle with a lift or ramp', 'Step-free rooms where the lodge has them', 'Unhurried days with rest stops built in', 'We confirm every access detail with you before you pay'],
    start: 'Nairobi', end: 'Nairobi', pace: 'easy',
    itinerary: MARA_DAYS.map(([t, b]): [string, string] => [t, b]),
    included: ['Pick-up and drop-off in Nairobi in an adapted vehicle', '3 nights’ accommodation, full board', 'Adapted safari vehicle with a driver-guide', 'Reserve entry fees', 'A pre-trip call to plan your access needs'], excluded: COMMON_EXCLUDED,
    accessibility: { summary: 'Tell us what you need and we plan around it. We confirm the vehicle, the rooms and the pace with you before you book. Roads inside the reserve can be bumpy, so we plan shorter drives and rest stops.', features: ['Vehicle with a lift or ramp (confirmed per booking)', 'Step-free rooms where available', 'Driver-guide trained to assist', 'Flexible pace and rest stops'], vehicle: 'Accessible Safari Vehicle' },
    related: ['Accessible Amboseli Safari', 'Masai Mara Classic Safari'],
  },
  {
    title: 'Accessible Amboseli Safari', variant: 'accessible', destination: 'Amboseli', days: 5, base: 1240, image: 'amboseli-elephants', gallery: ['mount-kenya'],
    summary: 'Amboseli’s elephants and open views, with an adapted vehicle and flexible days.',
    highlights: ['Open terrain with long views', 'Adapted vehicle with a lift or ramp', 'Lodge with step-free access where available', 'Flexible pace'],
    start: 'Nairobi', end: 'Nairobi', pace: 'easy', itinerary: [
      ['Nairobi to Amboseli', 'A comfortable drive south with rest stops, arriving for an easy afternoon game drive.'],
      ['Amboseli', 'Morning and afternoon drives with a long rest at the lodge in the middle.'],
      ['Amboseli', 'Another day with the elephants, at the pace that suits you.'],
      ['Amboseli', 'A final morning drive and time to relax at the lodge.'],
      ['Return to Nairobi', 'Drive back to Nairobi in an adapted vehicle.'],
    ],
    included: ['Pick-up and drop-off in Nairobi in an adapted vehicle', '4 nights’ accommodation, full board', 'Adapted safari vehicle with a driver-guide', 'Park entry fees', 'A pre-trip call to plan your access needs'], excluded: COMMON_EXCLUDED,
    accessibility: { summary: 'We confirm access details for every lodge and vehicle with you before you book.', features: ['Vehicle with a lift or ramp (confirmed per booking)', 'Step-free rooms where available', 'Driver-guide trained to assist'], vehicle: 'Accessible Safari Vehicle' },
    related: ['Accessible Masai Mara Safari'],
  },
]

export const BEST_TIME: [string, string, string][] = [
  ['July to October', 'Dry season, migration herds, busiest', 'Peak'],
  ['November to December', 'Short rains, green and quiet', 'High'],
  ['January to February', 'Dry, good wildlife viewing, fewer vehicles', 'High'],
  ['March to June', 'Long rains, lush landscapes, lowest rates', 'Low'],
]

export const FAQ: Record<string, [string, string][]> = {
  standard: [
    ['When is the best time to go?', 'July to October is the dry season and the busiest. January and February are dry and quieter. March to June brings the long rains and the lowest rates.'],
    ['Can I change my dates after booking?', 'Yes, subject to availability. Tell us as early as you can and we will arrange it.'],
    ['What should I pack?', 'Light layers, a warm top for early mornings, a hat, sunscreen and comfortable shoes. We send a full list after booking.'],
  ],
  budget: [
    ['What does camping involve?', 'Tents and bedding are provided and set up for you. Camps have shared washing facilities. Tell us if you have particular needs.'],
    ['Is the vehicle shared?', 'Yes. Shared vehicles keep the price down. Every guest gets a window seat.'],
    ['Can I upgrade to a lodge?', 'Yes. Ask us and we will price a lodge version of this safari.'],
  ],
  accessible: [
    ['How do you plan around my access needs?', 'We start with a call or message to learn what you need, then confirm the vehicle, rooms and pace with you before you book.'],
    ['Do you provide a vehicle with a lift?', 'We can provide an adapted vehicle with a lift or ramp. We confirm the exact details for your dates.'],
    ['Can a companion or carer travel with me?', 'Yes. Tell us how many people are travelling and we will plan the seating and rooms.'],
  ],
  migration: [
    ['Can you guarantee a river crossing?', 'No one can. Crossings depend on the herds and the weather. We plan extra time at the river and use guides who know where to wait.'],
    ['When is the migration in the Masai Mara?', 'The herds are usually in the Mara from about July to October, but timing changes from year to year.'],
    ['Is a migration safari more expensive?', 'Yes, because it falls in our peak season and lodges book out early. Camping versions cost less.'],
  ],
}

export const POSTS = [
  {
    title: 'When is the best time for a Masai Mara safari',
    image: 'migration-river',
    description: 'A plain guide to the Masai Mara seasons, the Great Migration and how to choose your month.',
    days: -40,
    body: [
      'The Masai Mara can be visited all year, but each month feels different. This guide explains the seasons so you can choose the one that suits you.',
      '## July to October: the dry season',
      'The grass is shorter, the animals gather near water and the Great Migration herds are usually in the Mara. It is the busiest and most expensive time, so book early.',
      '## November to February: quieter and still good',
      'Short rains turn the plains green in November and December. January and February are drier. There are fewer vehicles, and prices are in between.',
      '## March to June: the long rains',
      'Some roads are slow and a few camps close, but the landscape is lush, the light is beautiful and rates are at their lowest.',
      'If you are not sure which month to pick, send us your dates and what matters most to you, and we will suggest the best fit.',
    ],
  },
  {
    title: 'Planning an accessible safari: what to ask before you book',
    image: 'vehicle-accessible',
    description: 'Questions to ask any safari operator about vehicles, rooms and pace, so there are no surprises.',
    days: -20,
    body: [
      'A good safari is possible for many travellers with disabilities, but the details matter. These are the questions we suggest you ask any operator, including us.',
      '## The vehicle',
      'Ask how a wheelchair gets in and out, whether it can be secured, how many guests the vehicle seats with a wheelchair on board and who helps with transfers.',
      '## The rooms and paths',
      'Ask whether rooms and paths are step-free, what the bathrooms are like and how far it is from the room to the dining area.',
      '## The pace',
      'Roads inside parks can be bumpy. Ask about drive times, rest stops and how the day can change if you need a break.',
      'Whatever the answers, ask for them in writing before you pay. We confirm access details for every booking.',
    ],
  },
  {
    title: 'Private or join-in safari: how to choose',
    image: 'camp-night',
    description: 'What changes when you share a vehicle, and who each kind of safari suits best.',
    days: -8,
    body: [
      'Both kinds of safari go to the same places with the same standard of guiding. The difference is who you travel with and how much you pay.',
      '## Private safaris',
      'You set the pace, the dates and the route. The vehicle is yours, so photographers and families often prefer this. It costs more per person for small groups.',
      '## Join-in safaris',
      'You book a single seat on a fixed-date departure and share the vehicle. It costs less and you meet other travellers. The dates and route are set in advance.',
      'If you are travelling alone or on a budget, a join-in departure is a good place to start. For a special occasion or particular needs, we suggest private.',
    ],
  },
]
