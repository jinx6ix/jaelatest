import { siteBlocks } from '@/blocks/site/configs'
import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { HotelsBlock } from '../../blocks/HotelsBlock/config'
import { IncludedExcluded } from '../../blocks/IncludedExcluded/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { OfferBanner } from '../../blocks/OfferBanner/config'
import { VideoBlock } from '../../blocks/VideoBlock/config'
import { BestTimeBlock } from '../../blocks/BestTime/config'
import { FaqBlock } from '../../blocks/FaqBlock/config'
import { LinkHubsBlock } from '../../blocks/LinkHubs/config'
import { TitleBlock } from '../../blocks/TitleBlock/config'
import { Gallery } from '../../blocks/Gallery/config'
import { FactChips } from '../../blocks/FactChips/config'
import { StickyTabs } from '../../blocks/StickyTabs/config'
import { Itinerary } from '../../blocks/Itinerary/config'
import { Overview } from '../../blocks/Overview/config'
import { AccessibilitySection } from '../../blocks/AccessibilitySection/config'
import { ReviewsBlock } from '../../blocks/ReviewsBlock/config'
import { SimilarItems } from '../../blocks/SimilarItems/config'
import { BookingCard } from '../../blocks/BookingCard/config'
import { DepartureList } from '../../blocks/DepartureList/config'
import { AuthorBoxBlock } from '../../blocks/AuthorBox/config'
import { GroupDiscountTableBlock } from '../../blocks/GroupDiscountTable/config'
import { HowItWorksBlock } from '../../blocks/HowItWorks/config'
import { NewsletterBlock } from '../../blocks/Newsletter/config'
import { TermsFAQBlock } from '../../blocks/TermsFaq/config'
import { CtaBandBlock } from '../../blocks/CtaBand/config'
import { FeaturesSafetyBlock } from '../../blocks/FeaturesSafety/config'
import { WhatToExpectBlock } from '../../blocks/WhatToExpect/config'
import { SpecsTableBlock } from '../../blocks/SpecsTable/config'
import { ToursUsingVehicleBlock } from '../../blocks/ToursUsingVehicle/config'
import { SeatMapBlock } from '../../blocks/SeatMap/config'
import { PriceTableBlock } from '../../blocks/PriceTable/config'
import { PriceMatrixBlock } from '../../blocks/PriceMatrix/config'
import { PolicyBlockComponent } from '../../blocks/PolicyBlock/config'
import { CategoryTilesBlock } from '../../blocks/CategoryTiles/config'
import { FeaturedToursBlock } from '../../blocks/FeaturedTours/config'
import { DestinationTilesBlock } from '../../blocks/DestinationTiles/config'
import { SocialFeedBlock } from '../../blocks/SocialFeed/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [...siteBlocks, CallToAction, Content, MediaBlock, Archive, FormBlock, HotelsBlock, IncludedExcluded, VideoBlock, BestTimeBlock, FaqBlock, LinkHubsBlock, TitleBlock, Gallery, FactChips, StickyTabs, Itinerary, Overview, AccessibilitySection, ReviewsBlock, BookingCard, SimilarItems, DepartureList, OfferBanner, AuthorBoxBlock, GroupDiscountTableBlock, HowItWorksBlock, NewsletterBlock, TermsFAQBlock, CtaBandBlock, FeaturesSafetyBlock, WhatToExpectBlock, SpecsTableBlock, ToursUsingVehicleBlock, SeatMapBlock, PriceTableBlock, PriceMatrixBlock, PolicyBlockComponent, CategoryTilesBlock, FeaturedToursBlock, DestinationTilesBlock, SocialFeedBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
