import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tours } from './collections/Tours'
import { Vehicles } from './collections/Vehicles'
import { Seasons } from './collections/Seasons'
import { Offers } from './collections/Offers'
import { Hotels } from './collections/Hotels'
import { JointDepartures } from './collections/JointDepartures'
import { Destinations } from './collections/Destinations'
import { Templates } from './collections/Templates'
import { GalleryItems } from './collections/GalleryItems'
import { Inquiries } from './collections/Inquiries'
import { Clients } from './collections/Clients'
import { Reviews } from './collections/Reviews'
import { FxRates } from './collections/FxRates'
import { Countries } from './collections/Countries'
import { Routes } from './globals/Routes'
import { Translations } from './globals/Translations'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './globals/SiteSettings'
import { Company } from './globals/Company'
import { Theme } from './globals/Theme'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
  }),
  collections: [Pages, Posts, Media, Categories, Users, Tours, Vehicles, Seasons, Offers, Hotels, JointDepartures, Destinations, Templates, GalleryItems, Inquiries, Clients, Reviews, FxRates, Countries],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, Company, Theme, Routes, Translations],
  localization: {
    locales: ['en', 'de', 'fr', 'it', 'hi', 'zh', 'ar'],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
