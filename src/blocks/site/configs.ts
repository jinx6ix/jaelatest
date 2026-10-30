import type { Block, Field } from 'payload'
import { navLinkFields } from '@/fields/navLink'

const link = (name = 'link', label?: string, optional = false): Field => ({ name, type: 'group', label, fields: navLinkFields({ optional }) })

export const HomeHero: Block = {
  slug: 'homeHero',
  interfaceName: 'HomeHeroBlock',
  labels: { singular: 'Hero slider', plural: 'Hero sliders' },
  fields: [
    { name: 'autoplaySeconds', type: 'number', defaultValue: 7, min: 0, admin: { description: '0 turns autoplay off.' } },
    { name: 'transition', type: 'select', defaultValue: 'depth-turn', options: [{ label: '3D Depth Turn', value: 'depth-turn' }, { label: 'Cube', value: 'cube' }, { label: 'Fade', value: 'fade' }] },
    { name: 'tilt', type: 'checkbox', defaultValue: true, admin: { description: 'Enable mouse/finger 3D tilt parallax' } },
    { name: 'idleFloat', type: 'checkbox', defaultValue: true, admin: { description: 'Enable slow idle float animation' } },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'kind', type: 'select', required: true, defaultValue: 'image', options: [{ label: 'Image', value: 'image' }, { label: 'YouTube video', value: 'youtube' }] },
        { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { description: 'The picture, or the poster shown before and instead of the video.' } },
        { name: 'youtubeUrl', type: 'text', admin: { description: 'Paste the YouTube link. It plays muted and loops behind the text.', condition: (_, s) => s?.kind === 'youtube' } },
        { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'Gold line above headline, e.g. "JAETRAVEL EXPEDITIONS · KENYA"' } },
        { name: 'headline', type: 'text', required: true, localized: true, admin: { description: 'Fallback headline if headline lines are empty' } },
        {
          name: 'headlineLines',
          type: 'array',
          maxRows: 3,
          localized: true,
          admin: { description: 'Headline split into lines for 3D flip-up reveal (e.g. line 1: "EYES ON", line 2: "THE HORIZON")' },
          fields: [{ name: 'text', type: 'text', required: true, localized: true }],
        },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'tagline', type: 'text', localized: true, admin: { description: 'Capital sentence used in mobile portrait layout' } },
        {
          name: 'chips',
          type: 'array',
          maxRows: 4,
          localized: true,
          admin: { description: 'Bullet points with gold dots between them for mobile layout (e.g. "Game drives")' },
          fields: [{ name: 'text', type: 'text', required: true, localized: true }],
        },
        { name: 'showContact', type: 'checkbox', defaultValue: true, admin: { description: 'Show contact details bar at bottom of slide' } },
        { name: 'focalPoint', type: 'select', defaultValue: 'right', options: [{ label: 'Right', value: 'right' }, { label: 'Left', value: 'left' }, { label: 'Centre', value: 'centre' }] },
        { name: 'cutout', type: 'upload', relationTo: 'media', admin: { description: 'Optional transparent PNG cutout of the subject for extra-deep 3D effect' } },
        { name: 'scrim', type: 'number', min: 0, max: 100, defaultValue: 70, admin: { description: 'Dark gradient scrim strength (0-100)' } },
        { name: 'depth', type: 'select', defaultValue: 'soft', options: [{ label: 'Soft', value: 'soft' }, { label: 'Strong', value: 'strong' }, { label: 'None', value: 'none' }] },
        { name: 'caption', type: 'text', localized: true, admin: { description: 'Small label, for example the park name.' } },
        link('cta', 'Main button'),
        link('secondaryCta', 'Second button (optional)', true),
        { name: 'durationSeconds', type: 'number', min: 3, admin: { description: 'Overrides the autoplay time for this slide.' } },
      ],
    },
  ],
}

export const TripFinder: Block = {
  slug: 'tripFinder',
  interfaceName: 'TripFinderBlock',
  labels: { singular: 'Trip finder', plural: 'Trip finders' },
  fields: [{ name: 'note', type: 'text', admin: { description: 'Nothing to configure: destinations come from the Destinations collection.' } }],
}

export const WaysToTravel: Block = {
  slug: 'waysToTravel',
  interfaceName: 'WaysToTravelBlock',
  labels: { singular: 'Ways to travel', plural: 'Ways to travel' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    {
      name: 'tiles',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'tone', type: 'select', defaultValue: 'brand', options: ['sun', 'brand', 'ink'] },
        { name: 'icon', type: 'select', defaultValue: 'compass', options: ['wheelchair', 'wallet', 'compass', 'herd', 'users', 'gift'] },
        link('link'),
      ],
    },
  ],
}

export const ToursRail: Block = {
  slug: 'toursRail',
  interfaceName: 'ToursRailBlock',
  labels: { singular: 'Tour cards', plural: 'Tour cards' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Featured tours', value: 'featured' },
        { label: 'By tour type', value: 'variant' },
        { label: 'Hand picked', value: 'manual' },
      ],
    },
    { name: 'variant', type: 'select', options: ['standard', 'budget', 'accessible', 'migration'], admin: { condition: (_, s) => s?.source === 'variant' } },
    { name: 'tours', type: 'relationship', relationTo: 'tours', hasMany: true, admin: { condition: (_, s) => s?.source === 'manual' } },
    { name: 'limit', type: 'number', defaultValue: 4, min: 1, max: 12 },
    link('viewAll', 'View all link (optional)', true),
  ],
}

export const DeparturesBand: Block = {
  slug: 'departuresBand',
  interfaceName: 'DeparturesBandBlock',
  labels: { singular: 'Join-in departures', plural: 'Join-in departures' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    { name: 'limit', type: 'number', defaultValue: 4, min: 1, max: 10 },
  ],
}

export const OffersRail: Block = {
  slug: 'offersRail',
  interfaceName: 'OffersRailBlock',
  labels: { singular: 'Offer cards', plural: 'Offer cards' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 9 },
    link('viewAll', 'View all link (optional)', true),
  ],
}

export const DestinationsRail: Block = {
  slug: 'destinationsRail',
  interfaceName: 'DestinationsRailBlock',
  labels: { singular: 'Destinations', plural: 'Destinations' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
  ],
}

export const ValueProps: Block = {
  slug: 'valueProps',
  interfaceName: 'ValuePropsBlock',
  labels: { singular: 'Why us', plural: 'Why us' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CtaBannerBlock',
  labels: { singular: 'Call to action band', plural: 'Call to action bands' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
    link('cta', 'Button'),
  ],
}

export const BlogRail: Block = {
  slug: 'blogRail',
  interfaceName: 'BlogRailBlock',
  labels: { singular: 'Latest posts', plural: 'Latest posts' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 9 },
  ],
}

export const PageHeader: Block = {
  slug: 'pageHeader',
  interfaceName: 'PageHeaderBlock',
  labels: { singular: 'Page header', plural: 'Page headers' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const RichSection: Block = {
  slug: 'richSection',
  interfaceName: 'RichSectionBlock',
  labels: { singular: 'Text section', plural: 'Text sections' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageSide', type: 'select', defaultValue: 'right', options: ['left', 'right'] },
  ],
}

export const StatsStrip: Block = {
  slug: 'statsStrip',
  interfaceName: 'StatsStripBlock',
  labels: { singular: 'Numbers strip', plural: 'Numbers strips' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
}

export const FaqSection: Block = {
  slug: 'faqSection',
  interfaceName: 'FaqSectionBlock',
  labels: { singular: 'Questions and answers', plural: 'Questions and answers' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}

export const ContactSection: Block = {
  slug: 'contactSection',
  interfaceName: 'ContactSectionBlock',
  labels: { singular: 'Contact section', plural: 'Contact sections' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
  ],
}

export const VehicleGrid: Block = {
  slug: 'vehicleGrid',
  interfaceName: 'VehicleGridBlock',
  labels: { singular: 'Vehicle list', plural: 'Vehicle lists' },
  fields: [{ name: 'title', type: 'text', localized: true }],
}

export const MediaGallery: Block = {
  slug: 'mediaGallery',
  interfaceName: 'MediaGalleryBlock',
  labels: { singular: 'Photo and video gallery', plural: 'Photo and video galleries' },
  fields: [{ name: 'title', type: 'text', localized: true }],
}

export const siteBlocks: Block[] = [
  HomeHero,
  TripFinder,
  WaysToTravel,
  ToursRail,
  DeparturesBand,
  OffersRail,
  DestinationsRail,
  ValueProps,
  CtaBanner,
  BlogRail,
  PageHeader,
  RichSection,
  StatsStrip,
  FaqSection,
  ContactSection,
  VehicleGrid,
  MediaGallery,
]
