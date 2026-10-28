import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AuthorBoxBlock } from '@/blocks/AuthorBox/Component'
import { GroupDiscountTableBlock } from '@/blocks/GroupDiscountTable/Component'
import { HowItWorksBlock } from '@/blocks/HowItWorks/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { TermsFAQBlock } from '@/blocks/TermsFaq/Component'
import { CtaBandBlock } from '@/blocks/CtaBand/Component'
import { AccessibilitySectionBlock } from '@/blocks/AccessibilitySection/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BestTimeBlock } from '@/blocks/BestTime/Component'
import { BookingCardBlock } from '@/blocks/BookingCard/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { DepartureListBlock } from '@/blocks/DepartureList/Component'
import { FactChipsBlock } from '@/blocks/FactChips/Component'
import { FaqBlock } from '@/blocks/FaqBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'
import { HotelsBlock } from '@/blocks/HotelsBlock/Component'
import { IncludedExcludedBlock } from '@/blocks/IncludedExcluded/Component'
import { ItineraryBlock } from '@/blocks/Itinerary/Component'
import { LinkHubsBlock } from '@/blocks/LinkHubs/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { OfferBannerBlock } from '@/blocks/OfferBanner/Component'
import { OverviewBlock } from '@/blocks/Overview/Component'
import { ReviewsBlock } from '@/blocks/ReviewsBlock/Component'
import { SimilarItemsBlock } from '@/blocks/SimilarItems/Component'
import { StickyTabsBlock } from '@/blocks/StickyTabs/Component'
import { TitleBlock } from '@/blocks/TitleBlock/Component'
import { FeaturesSafetyBlock } from '@/blocks/FeaturesSafety/Component'
import { WhatToExpectBlock } from '@/blocks/WhatToExpect/Component'
import { SpecsTableBlock } from '@/blocks/SpecsTable/Component'
import { ToursUsingVehicleBlock } from '@/blocks/ToursUsingVehicle/Component'
import { SeatMapBlock } from '@/blocks/SeatMap/Component'
import { PriceTableBlock } from '@/blocks/PriceTable/Component'
import { PolicyBlockComponent } from '@/blocks/PolicyBlock/Component'
import { VideoBlock } from '@/blocks/VideoBlock/Component'
import { WhyCheaperBlock } from '@/blocks/WhyCheaper/Component'
import { CategoryTilesBlock } from '@/blocks/CategoryTiles/Component'
import { FeaturedToursBlock } from '@/blocks/FeaturedTours/Component'
import { DestinationTilesBlock } from '@/blocks/DestinationTiles/Component'
import { SocialFeedBlock } from '@/blocks/SocialFeed/Component'

const blockComponents = {
  accessibilitySection: AccessibilitySectionBlock,
  archive: ArchiveBlock,
  bestTimeBlock: BestTimeBlock,
  bookingCard: BookingCardBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  departureList: DepartureListBlock,
  factChips: FactChipsBlock,
  faqBlock: FaqBlock,
  formBlock: FormBlock,
  gallery: GalleryBlock,
  hotelsBlock: HotelsBlock,
  includedExcluded: IncludedExcludedBlock,
  itinerary: ItineraryBlock,
  linkHubsBlock: LinkHubsBlock,
  mediaBlock: MediaBlock,
  offerBanner: OfferBannerBlock,
  overview: OverviewBlock,
  reviewsBlock: ReviewsBlock,
  similarItems: SimilarItemsBlock,
  stickyTabs: StickyTabsBlock,
  titleBlock: TitleBlock,
  videoBlock: VideoBlock,
  whyCheaper: WhyCheaperBlock,
  whatToExpect: WhatToExpectBlock,
  specsTable: SpecsTableBlock,
  featuresSafety: FeaturesSafetyBlock,
  toursUsingVehicle: ToursUsingVehicleBlock,
  seatMap: SeatMapBlock,
  priceTable: PriceTableBlock,
  policyBlock: PolicyBlockComponent,
  authorBox: AuthorBoxBlock,
  groupDiscountTable: GroupDiscountTableBlock,
  howItWorks: HowItWorksBlock,
  newsletter: NewsletterBlock,
  termsFaq: TermsFAQBlock,
  ctaBand: CtaBandBlock,
  categoryTiles: CategoryTilesBlock,
  featuredTours: FeaturedToursBlock,
  destinationTiles: DestinationTilesBlock,
  socialFeed: SocialFeedBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = (blockComponents as any)[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
