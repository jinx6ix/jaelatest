import type { Payload } from 'payload'
import { defaultTranslations } from '../../i18n/keys'

export async function seedV2Foundation(payload: Payload) {
  try {
    console.log('Seeding V2 foundation data (Seasons, Countries, FxRates, Routes, Translations)...')

    // 1. Seasons
    const seasonsData = [
      { name: 'Peak', startDate: '07-01', endDate: '10-31' },
      { name: 'High', startDate: '11-01', endDate: '02-28' },
      { name: 'Low', startDate: '03-01', endDate: '06-30' },
      { name: 'Festive', startDate: '12-20', endDate: '01-05' },
    ]

    for (const season of seasonsData) {
      await payload.create({
        collection: 'seasons',
        data: season as any,
        req: { user: { email: 'seed@jaetravel.co.ke', collection: 'users', id: '1' } as any },
      }).catch(() => {})
    }

    // 2. Countries (Popular first)
    const countriesData = [
      { name: 'Kenya', iso2: 'KE', dialCode: '+254', popular: true, sortOrder: 1 },
      { name: 'Tanzania', iso2: 'TZ', dialCode: '+255', popular: true, sortOrder: 2 },
      { name: 'Uganda', iso2: 'UG', dialCode: '+256', popular: true, sortOrder: 3 },
      { name: 'Rwanda', iso2: 'RW', dialCode: '+250', popular: true, sortOrder: 4 },
      { name: 'United Kingdom', iso2: 'GB', dialCode: '+44', popular: true, sortOrder: 5 },
      { name: 'United States', iso2: 'US', dialCode: '+1', popular: true, sortOrder: 6 },
      { name: 'Germany', iso2: 'DE', dialCode: '+49', popular: true, sortOrder: 7 },
      { name: 'France', iso2: 'FR', dialCode: '+33', popular: false, sortOrder: 10 },
      { name: 'Italy', iso2: 'IT', dialCode: '+39', popular: false, sortOrder: 11 },
    ]

    for (const c of countriesData) {
      await payload.create({
        collection: 'countries',
        data: c as any,
      }).catch(() => {})
    }

    // 3. FxRates
    await payload.create({
      collection: 'fx-rates',
      data: {
        date: new Date().toISOString(),
        base: 'USD',
        rates: { EUR: 0.92, GBP: 0.79, KES: 129.5, USD: 1 },
      },
    }).catch(() => {})

    // 4. Global: Routes
    await payload.updateGlobal({
      slug: 'routes',
      data: {
        routes: [
          { collectionName: 'tours', variant: 'standard', prefix: 'tours', breadcrumbLabel: 'Safaris' },
          { collectionName: 'tours', variant: 'budget', prefix: 'budget-tours', breadcrumbLabel: 'Budget safaris' },
          { collectionName: 'tours', variant: 'accessible', prefix: 'disability-tours', breadcrumbLabel: 'Accessible safaris' },
          { collectionName: 'offers', variant: 'n/a', prefix: 'offers', breadcrumbLabel: 'Offers' },
          { collectionName: 'joint-departures', variant: 'n/a', prefix: 'joint-safaris', breadcrumbLabel: 'Group departures' },
          { collectionName: 'vehicles', variant: 'n/a', prefix: 'vehicle-hire', breadcrumbLabel: 'Vehicle hire' },
        ],
      } as any,
    })

    // 5. Global: Translations
    const translationItems = Object.entries(defaultTranslations).map(([key, value]) => ({
      key,
      value,
    }))

    await payload.updateGlobal({
      slug: 'translations',
      data: {
        items: translationItems,
      } as any,
    })

    // 6. Global: Theme
    await payload.updateGlobal({
      slug: 'theme',
      data: {
        colors: {
          brand: '#FF7302',
          onBrand: '#201E1F',
          accentText: '#B34A00',
          sun: '#FFDD00',
          ink: '#201E1F',
          ground: '#FFFFFF',
          tint: '#FFF2C2',
          line: '#E6D9CB',
          muted: '#56585B',
          soft: '#BDB7AE',
          night: '#201E1F',
          success: '#2E7D4F',
          danger: '#B3261E',
          whatsapp: '#25D366',
        },
        radius: {
          pill: '999px',
          card: '16px',
          panel: '20px',
          form: '18px',
        },
        font: 'montserrat-figtree',
      } as any,
    })

    // 7. Templates
    const templates = [
      { name: 'Standard Tour Template', variant: 'standard' },
      { name: 'Budget Tour Template', variant: 'budget' },
      { name: 'Accessible Tour Template', variant: 'accessible' },
      { name: 'Offer Template', variant: 'offer' },
    ]

    for (const tpl of templates) {
      await payload.create({
        collection: 'templates',
        data: tpl as any,
      }).catch(() => {})
    }

    // 8. Sample Tours
    const tours = [
      {
        title: 'Masai Mara Classic',
        slug: 'masai-mara-classic',
        sample: true,
        durationDays: 4,
        startPoint: 'Nairobi',
        endPoint: 'Nairobi',
        pace: 'Moderate',
        groupSizeMin: 2,
        groupSizeMax: 8,
        summary: 'Experience the breathtaking wildebeest migration and Big Five in the legendary Masai Mara.',
        pricing: {
          mode: 'manual',
          currency: 'USD',
          matrix: [
            { season: 'Low', p2: 980, p4: 850, p6: 780, p8: 730 },
            { season: 'High', p2: 860, p4: 740, p6: 670, p8: 630 },
            { season: 'Peak', p2: 760, p4: 660, p6: 600, p8: 560 },
          ],
        },
        itinerary: [
          { title: 'Day 1: Nairobi to Masai Mara', body: 'Drive through the Great Rift Valley to Masai Mara.', meals: 'Lunch, Dinner' },
          { title: 'Day 2: Full day game drives', body: 'Explore the Mara reserve in search of the Big Five.', meals: 'Breakfast, Lunch, Dinner' },
          { title: 'Day 3: Mara river exploration', body: 'Witness hippos and crocodiles along the Mara river.', meals: 'Breakfast, Lunch, Dinner' },
          { title: 'Day 4: Masai Mara to Nairobi', body: 'Morning game drive then return to Nairobi.', meals: 'Breakfast, Lunch' },
        ],
        included: [{ item: 'Park entrance fees' }, { item: 'Professional driver guide' }, { item: 'Full board accommodation' }],
        excluded: [{ item: 'International flights' }, { item: 'Tips and gratuities' }],
      },
      {
        title: 'Amboseli & Tsavo Explorer',
        slug: 'amboseli-tsavo-safari',
        sample: true,
        durationDays: 5,
        startPoint: 'Nairobi',
        endPoint: 'Nairobi',
        pace: 'Relaxed',
        groupSizeMin: 2,
        groupSizeMax: 8,
        summary: 'Majestic views of Mount Kilimanjaro and vast elephant herds of Amboseli and Tsavo.',
        pricing: {
          mode: 'manual',
          currency: 'USD',
          matrix: [
            { season: 'Low', p2: 1120, p4: 980, p6: 890, p8: 820 },
            { season: 'High', p2: 990, p4: 860, p6: 780, p8: 720 },
            { season: 'Peak', p2: 890, p4: 780, p6: 710, p8: 650 },
          ],
        },
        itinerary: [
          { title: 'Day 1: Nairobi to Amboseli', body: 'Travel to Amboseli beneath Kilimanjaro.', meals: 'Lunch, Dinner' },
          { title: 'Day 2: Amboseli game drives', body: 'Full day exploring Amboseli marshes.', meals: 'Breakfast, Lunch, Dinner' },
          { title: 'Day 3: Amboseli to Tsavo West', body: 'Visit Mzima Springs and lava flows.', meals: 'Breakfast, Lunch, Dinner' },
          { title: 'Day 4: Tsavo East', body: 'Explore the red elephants of Tsavo East.', meals: 'Breakfast, Lunch, Dinner' },
          { title: 'Day 5: Tsavo to Nairobi', body: 'Return drive to Nairobi.', meals: 'Breakfast, Lunch' },
        ],
        included: [{ item: 'Park fees' }, { item: 'Accommodation' }, { item: 'Game drives' }],
        excluded: [{ item: 'Drinks' }, { item: 'Personal items' }],
      },
    ]

    for (const tour of tours) {
      await payload.create({
        collection: 'tours',
        data: tour as any,
      }).catch(() => {})
    }

    console.log('V2 foundation seeding completed successfully.')
  } catch (err) {
    console.error('Error seeding V2 foundation:', err)
  }
}
