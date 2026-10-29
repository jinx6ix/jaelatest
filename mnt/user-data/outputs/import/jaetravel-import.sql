-- =====================================================================================
-- JaeTravel: import of tours.ts, products-data.ts, vehicles-data.ts and destinations-data.ts
-- Target: the Payload v2 schema (PostgreSQL) from jaetravel-v2.zip
--
-- HOW TO RUN (on an empty database that already has the Payload tables, i.e. after `pnpm payload migrate`):
--     psql "$DATABASE_URL" -f jaetravel-import.sql
-- It is safe to run again: anything that already exists (same slug or image URL) is skipped, never overwritten.
-- It runs inside one transaction: if anything fails, nothing is saved.
-- =====================================================================================
BEGIN;

-- 1. Prerequisites: seasons and tour templates (only created when missing) ----------------------------
DO $do$
DECLARE s int; tid int; v text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM seasons) THEN
    INSERT INTO seasons (start_month, start_day, end_month, end_day, sort_order) VALUES (3,1,6,30,1) RETURNING id INTO s;
    INSERT INTO seasons_locales (name, _locale, _parent_id) VALUES ('Low season', 'en', s);
    INSERT INTO seasons (start_month, start_day, end_month, end_day, sort_order) VALUES (11,1,2,29,2) RETURNING id INTO s;
    INSERT INTO seasons_locales (name, _locale, _parent_id) VALUES ('High season', 'en', s);
    INSERT INTO seasons (start_month, start_day, end_month, end_day, sort_order) VALUES (7,1,10,31,3) RETURNING id INTO s;
    INSERT INTO seasons_locales (name, _locale, _parent_id) VALUES ('Peak season', 'en', s);
  END IF;
  FOREACH v IN ARRAY ARRAY['standard','budget','accessible','migration'] LOOP
    IF NOT EXISTS (SELECT 1 FROM templates WHERE variant = v::enum_templates_variant) THEN
      INSERT INTO templates (name, variant) VALUES (initcap(v) || ' tour', v::enum_templates_variant) RETURNING id INTO tid;
      INSERT INTO templates_sections (_order, _parent_id, id, key, enabled)
        SELECT k.ord, tid, md5(tid::text || v || 'sec' || k.key), k.key::enum_templates_sections_key, true
        FROM unnest(CASE v
          WHEN 'budget' THEN ARRAY['facts','highlights','whyCheaper','tabs','bestTime','faq','similar']
          WHEN 'accessible' THEN ARRAY['facts','highlights','accessibility','tabs','bestTime','faq','similar']
          ELSE ARRAY['facts','highlights','offerBanner','tabs','bestTime','faq','similar'] END) WITH ORDINALITY AS k(key, ord);
      INSERT INTO templates_tabs (_order, _parent_id, id, key, enabled)
        SELECT k.ord, tid, md5(tid::text || v || 'tab' || k.key), k.key::enum_templates_tabs_key, true
        FROM unnest(ARRAY['itinerary','inclusions','exclusions','booking','gallery','videos']) WITH ORDINALITY AS k(key, ord);
    END IF;
  END LOOP;
END $do$;

-- 2. Images -------------------------------------------------------------------------------------------
-- Images keep the address they had on the old site (for example /masai-mara-migration.jpg), so copy the
-- files from the old project's public folder into this project's public folder (see the README note).
-- Five images are hosted on ik.imagekit.io and are used from there as they are.

WITH src(url, filename, mime, alt) AS (VALUES
  ($j$/masai-mara-migration.jpg$j$, $j$masai-mara-migration.jpg$j$, $j$image/jpeg$j$, $j$Masai Mara Luxury Safari$j$),
  ($j$/Amboseli-National-Park-Elephantsssss.jpg$j$, $j$Amboseli-National-Park-Elephantsssss.jpg$j$, $j$image/jpeg$j$, $j$Amboseli Safari Adventure$j$),
  ($j$/Serengeti-National-Park-Africa-Kenya-Safaris2.jpg$j$, $j$Serengeti-National-Park-Africa-Kenya-Safaris2.jpg$j$, $j$image/jpeg$j$, $j$Serengeti Migration Safari$j$),
  ($j$/Ngorongoro-Crater.jpg$j$, $j$Ngorongoro-Crater.jpg$j$, $j$image/jpeg$j$, $j$Ngorongoro Crater Safari$j$),
  ($j$/bwindi-forest-uganda-gorilla-safaris.jpg$j$, $j$bwindi-forest-uganda-gorilla-safaris.jpg$j$, $j$image/jpeg$j$, $j$Bwindi Gorilla Trekking$j$),
  ($j$/Volcanoes-National-Park-Rwanda-Natural-World-Kenya-Safaris.jpg$j$, $j$Volcanoes-National-Park-Rwanda-Natural-World-Kenya-Safaris.jpg$j$, $j$image/jpeg$j$, $j$Rwanda Gorilla Safari$j$),
  ($j$/magestic-maasai-serengeti.jpg$j$, $j$magestic-maasai-serengeti.jpg$j$, $j$image/jpeg$j$, $j$Masai Mara Safari Adventure$j$),
  ($j$/amboseli-elephants-00007.jpg$j$, $j$amboseli-elephants-00007.jpg$j$, $j$image/jpeg$j$, $j$Amboseli Elephant Safari$j$),
  ($j$/Samburu_National_Reserve%2C_Kenya-26December2012.jpg$j$, $j$Samburu_National_Reserve,_Kenya-26December2012.jpg$j$, $j$image/jpeg$j$, $j$Samburu Game Reserve$j$),
  ($j$/lake-nakuru-flamingos-in-red-sunset-590x390.jpg$j$, $j$lake-nakuru-flamingos-in-red-sunset-590x390.jpg$j$, $j$image/jpeg$j$, $j$Lake Nakuru Flamingo Tour$j$),
  ($j$/tsavo-west-national-park-chyulu-gate.jpg.webp$j$, $j$tsavo-west-national-park-chyulu-gate.jpg.webp$j$, $j$image/webp$j$, $j$Tsavo East & West Safari$j$),
  ($j$/Mombasa-beach-2-1960x800.webp$j$, $j$Mombasa-beach-2-1960x800.webp$j$, $j$image/webp$j$, $j$Mombasa Beach & Safari$j$),
  ($j$/mt-kenya.jpg$j$, $j$mt-kenya.jpg$j$, $j$image/jpeg$j$, $j$Mount Kenya Climbing$j$),
  ($j$/laikipia-kenya-photography-safari.jpg$j$, $j$laikipia-kenya-photography-safari.jpg$j$, $j$image/jpeg$j$, $j$Laikipia Conservancy$j$),
  ($j$/Hells-Gate-National-Park.jpg$j$, $j$Hells-Gate-National-Park.jpg$j$, $j$image/jpeg$j$, $j$Hell's Gate Adventure$j$),
  ($j$/Aberdare.jpg$j$, $j$Aberdare.jpg$j$, $j$image/jpeg$j$, $j$Aberdare National Park$j$),
  ($j$/Kenia-Mombasa-Diani-Beach-Leopard-Beach-Resort-strand-long-beach-LBR_1.jpg$j$, $j$Kenia-Mombasa-Diani-Beach-Leopard-Beach-Resort-strand-long-beach-LBR_1.jpg$j$, $j$image/jpeg$j$, $j$Diani Beach Safari Combo$j$),
  ($j$/serengeti-day-trip.jpeg$j$, $j$serengeti-day-trip.jpeg$j$, $j$image/jpeg$j$, $j$Serengeti Wildlife Safari$j$),
  ($j$/kilimanjaro-moutain-climbing.jpg$j$, $j$kilimanjaro-moutain-climbing.jpg$j$, $j$image/jpeg$j$, $j$Kilimanjaro Climbing$j$),
  ($j$/boabab-tarangire-national-park.jpg$j$, $j$boabab-tarangire-national-park.jpg$j$, $j$image/jpeg$j$, $j$Tarangire Elephant Safari$j$),
  ($j$/Lake%20Manyara%20banner.jpg$j$, $j$Lake Manyara banner.jpg$j$, $j$image/jpeg$j$, $j$Lake Manyara Tree Climbing Lions$j$),
  ($j$/zanzibar-stone-town-view-min-800x600.jpg$j$, $j$zanzibar-stone-town-view-min-800x600.jpg$j$, $j$image/jpeg$j$, $j$Zanzibar Spice Island$j$),
  ($j$/ruaha-national-park-featured.jpg$j$, $j$ruaha-national-park-featured.jpg$j$, $j$image/jpeg$j$, $j$Ruaha National Park$j$),
  ($j$/SELOUS-GAME-RESERVE.jpg$j$, $j$SELOUS-GAME-RESERVE.jpg$j$, $j$image/jpeg$j$, $j$Selous Game Reserve$j$),
  ($j$/Mikumi2017.jpg$j$, $j$Mikumi2017.jpg$j$, $j$image/jpeg$j$, $j$Mikumi National Park$j$),
  ($j$/Cultural-Heritage-Centre-Arusha-Tanzania.jpg$j$, $j$Cultural-Heritage-Centre-Arusha-Tanzania.jpg$j$, $j$image/jpeg$j$, $j$Arusha Cultural Tour$j$),
  ($j$/Katavi-National-Park-600x400.png$j$, $j$Katavi-National-Park-600x400.png$j$, $j$image/png$j$, $j$Katavi National Park$j$),
  ($j$/Chimp-Group-Mahale-Mountain-JEP_8612.jpg$j$, $j$Chimp-Group-Mahale-Mountain-JEP_8612.jpg$j$, $j$image/jpeg$j$, $j$Mahale Chimpanzee Trek$j$),
  ($j$/Pemba-Island-15.jpg$j$, $j$Pemba-Island-15.jpg$j$, $j$image/jpeg$j$, $j$Pemba Island Diving$j$),
  ($j$/31719088_tourists-on-a-typical-narrow-street-in-stone-town-zanzibar-e1713023620250.jpg$j$, $j$31719088_tourists-on-a-typical-narrow-street-in-stone-town-zanzibar-e1713023620250.jpg$j$, $j$image/jpeg$j$, $j$Stone Town Heritage Tour$j$),
  ($j$/Game-Drive-north-of-Serengeti-National-Park.jpg$j$, $j$Game-Drive-north-of-Serengeti-National-Park.jpg$j$, $j$image/jpeg$j$, $j$Northern Circuit Safari$j$),
  ($j$/gorilla-trekking-experience-13.jpg$j$, $j$gorilla-trekking-experience-13.jpg$j$, $j$image/jpeg$j$, $j$Rwanda Gorilla Trekking Experience$j$),
  ($j$/nyungwe-forests.jpg$j$, $j$nyungwe-forests.jpg$j$, $j$image/jpeg$j$, $j$Nyungwe Forest Canopy Walk$j$),
  ($j$/Lake-Kivu-Islands.jpg$j$, $j$Lake-Kivu-Islands.jpg$j$, $j$image/jpeg$j$, $j$Lake Kivu Relaxation$j$),
  ($j$/Akagera-national-park-1-750x450.jpg$j$, $j$Akagera-national-park-1-750x450.jpg$j$, $j$image/jpeg$j$, $j$Akagera National Park$j$),
  ($j$/kigali-photo-600x300.jpg$j$, $j$kigali-photo-600x300.jpg$j$, $j$image/jpeg$j$, $j$Kigali City Tour$j$),
  ($j$/golden-monkey-trekking.jpg$j$, $j$golden-monkey-trekking.jpg$j$, $j$image/jpeg$j$, $j$Golden Monkey Tracking$j$),
  ($j$/Magical-encounters-with-the-mountain-gorillas-of-Bwindi.jpg$j$, $j$Magical-encounters-with-the-mountain-gorillas-of-Bwindi.jpg$j$, $j$image/jpeg$j$, $j$Bwindi Gorilla Trekking$j$),
  ($j$/Queen-Elizabeth-National-Park.jpg$j$, $j$Queen-Elizabeth-National-Park.jpg$j$, $j$image/jpeg$j$, $j$Queen Elizabeth Safari$j$),
  ($j$/murchison-falls.webp$j$, $j$murchison-falls.webp$j$, $j$image/webp$j$, $j$Murchison Falls Adventure$j$),
  ($j$/kibale-national-park-chimpanzees-uganda-590x390.jpg$j$, $j$kibale-national-park-chimpanzees-uganda-590x390.jpg$j$, $j$image/jpeg$j$, $j$Kibale Chimpanzee Tracking$j$),
  ($j$/lake-mburo-national-park.jpg$j$, $j$lake-mburo-national-park.jpg$j$, $j$image/jpeg$j$, $j$Lake Mburo National Park$j$),
  ($j$/Rwenzori-Mountains-03_1600p.jpg$j$, $j$Rwenzori-Mountains-03_1600p.jpg$j$, $j$image/jpeg$j$, $j$Rwenzori Mountains Hiking$j$),
  ($j$/6-days-gorilla-tracking-and-rafting-jinja.jpg$j$, $j$6-days-gorilla-tracking-and-rafting-jinja.jpg$j$, $j$image/jpeg$j$, $j$Jinja White Water Rafting$j$),
  ($j$/lake_bunyonyi__uganda-the-pearl-of-africa.webp$j$, $j$lake_bunyonyi__uganda-the-pearl-of-africa.webp$j$, $j$image/webp$j$, $j$Lake Bunyonyi Relaxation$j$),
  ($j$/Travel-to-Ssese-islands.jpg$j$, $j$Travel-to-Ssese-islands.jpg$j$, $j$image/jpeg$j$, $j$Ssese Islands Beach Holiday$j$),
  ($j$/Lake-Naivasha-National-Park-750x450.jpg$j$, $j$Lake-Naivasha-National-Park-750x450.jpg$j$, $j$image/jpeg$j$, $j$Lake Naivasha Boat Safari$j$),
  ($j$/wheelchair-accessible-tanzania-safari.webp$j$, $j$wheelchair-accessible-tanzania-safari.webp$j$, $j$image/webp$j$, $j$Accessible Kenya Safari Experience$j$),
  ($j$/Tineke-in-Kenya.png$j$, $j$Tineke-in-Kenya.png$j$, $j$image/png$j$, $j$4-Day Accessible Masai Mara Experience$j$),
  ($j$/WhatsApp-Image-2025-01-15-at-12.06.45-PM.webp$j$, $j$WhatsApp-Image-2025-01-15-at-12.06.45-PM.webp$j$, $j$image/webp$j$, $j$Tanzania Accessible Safari Adventure$j$),
  ($j$/WhatsApp%20Image%202025-09-02%20at%2011.43.25%20AM.jpeg$j$, $j$WhatsApp Image 2025-09-02 at 11.43.25 AM.jpeg$j$, $j$image/jpeg$j$, $j$Rwanda Accessible Gorilla Experience$j$),
  ($j$/ngorongoro-header-3.jpg$j$, $j$ngorongoro-header-3.jpg$j$, $j$image/jpeg$j$, $j$East Africa Grand Accessible Safari$j$),
  ($j$/HandicappedConvertedRamp.webp$j$, $j$HandicappedConvertedRamp.webp$j$, $j$image/webp$j$, $j$Wheelchair Accessible Safari Vehicle$j$),
  ($j$/AccessibleGorillaSafari.webp$j$, $j$AccessibleGorillaSafari.webp$j$, $j$image/webp$j$, $j$Rwanda Accessible Gorilla Safari$j$),
  ($j$/carnivore-restaurant.jpg$j$, $j$carnivore-restaurant.jpg$j$, $j$image/jpeg$j$, $j$Carnivore Experience$j$),
  ($j$/Viaje-a-Kenia-Masai-Mara-32.jpg$j$, $j$Viaje-a-Kenia-Masai-Mara-32.jpg$j$, $j$image/jpeg$j$, $j$Safari Madoa Doa$j$),
  ($j$/images%20(9).jpg$j$, $j$images (9).jpg$j$, $j$image/jpeg$j$, $j$Best of Zanzibar$j$),
  ($j$/images%20(8).jpg$j$, $j$images (8).jpg$j$, $j$image/jpeg$j$, $j$Classic Sky Safari 2$j$),
  ($j$/caption.jpg$j$, $j$caption.jpg$j$, $j$image/jpeg$j$, $j$Nairobi National Park Tour$j$),
  ($j$/images%20(7).jpg$j$, $j$images (7).jpg$j$, $j$image/jpeg$j$, $j$Visit a Thousand Hills Distilleries$j$),
  ($j$/nyamirambo-women-s-center.jpg$j$, $j$nyamirambo-women-s-center.jpg$j$, $j$image/jpeg$j$, $j$This is Africa Nyamirambo Women's Center$j$),
  ($j$/images%20(6).jpg$j$, $j$images (6).jpg$j$, $j$image/jpeg$j$, $j$Relaxation at the Beach$j$),
  ($j$/images%20(5).jpg$j$, $j$images (5).jpg$j$, $j$image/jpeg$j$, $j$Safari Dwika$j$),
  ($j$/images%20(4).jpg$j$, $j$images (4).jpg$j$, $j$image/jpeg$j$, $j$Lake Nakuru Rhino Sanctuary Experience$j$),
  ($j$/Big-5.jpg$j$, $j$Big-5.jpg$j$, $j$image/jpeg$j$, $j$7-Day Big Five Masai Mara$j$),
  ($j$/african-lions-uganda-1024x683.webp$j$, $j$african-lions-uganda-1024x683.webp$j$, $j$image/webp$j$, $j$5-Day Amboseli Elephant Focus$j$),
  ($j$/Inverdoorn-54.jpg$j$, $j$Inverdoorn-54.jpg$j$, $j$image/jpeg$j$, $j$6-Day Tsavo Big Five Adventure$j$),
  ($j$/images%20(10).jpg$j$, $j$images (10).jpg$j$, $j$image/jpeg$j$, $j$5-Day Accessible Uganda Primate Safari$j$),
  ($j$/bbc661354c745efe824cad3249204c2159b382a4700756bedb8b9ac407c5662d.avif$j$, $j$bbc661354c745efe824cad3249204c2159b382a4700756bedb8b9ac407c5662d.avif$j$, $j$image/avif$j$, $j$From Nairobi: Maasai Mara 1-Day Safari: Lunch & Pickup$j$),
  ($j$/4-Days-Masai-Mara-Wildebeest-safari.jpg$j$, $j$4-Days-Masai-Mara-Wildebeest-safari.jpg$j$, $j$image/jpeg$j$, $j$Best of Kenya & Tanzania - The Ultimate Migration Experience$j$),
  ($j$/images.jpeg$j$, $j$images.jpeg$j$, $j$image/jpeg$j$, $j$Safari Simba: Amboseli & Tsavo Wilderness Expedition$j$),
  ($j$/images%20(1).jpeg$j$, $j$images (1).jpeg$j$, $j$image/jpeg$j$, $j$Safari Twiga: Nairobi's Wildlife & Conservation Experience$j$),
  ($j$/gorilla-trekking-difficulty.jpg$j$, $j$gorilla-trekking-difficulty.jpg$j$, $j$image/jpeg$j$, $j$Golden Monkey & Gorilla Trekking: Rwanda's Primate Paradise$j$),
  ($j$/safari-vehicle-extended-roof-for-photography.jpg$j$, $j$safari-vehicle-extended-roof-for-photography.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof-Top Camping: Under African Stars$j$),
  ($j$/zanzibar-accessible-beach-01.jpg$j$, $j$zanzibar-accessible-beach-01.jpg$j$, $j$image/jpeg$j$, $j$Zanzibar Accessible Getaway: Inclusive Beach Resort & Spice Island Discovery$j$),
  ($j$/wheelchair-safari-east-africa-07.jpg$j$, $j$wheelchair-safari-east-africa-07.jpg$j$, $j$image/jpeg$j$, $j$Best of Kenya & Tanzania Accessible Safari: Maasai Mara to Serengeti$j$),
  ($j$/1b436e43-e979-4d81-93e1-972fbee500dd.jpg$j$, $j$1b436e43-e979-4d81-93e1-972fbee500dd.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/42376dae-b77d-4c57-bfb9-9168f3095936.jpg$j$, $j$42376dae-b77d-4c57-bfb9-9168f3095936.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/a72177d7-cdb1-405c-9c8e-0f6def7d3912.jpg$j$, $j$a72177d7-cdb1-405c-9c8e-0f6def7d3912.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/bc797b77-1554-4a2f-9b17-6112454c25bd.jpg$j$, $j$bc797b77-1554-4a2f-9b17-6112454c25bd.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/39c2510c-fb4c-4246-95c6-c2df54fb0e94.jpg$j$, $j$39c2510c-fb4c-4246-95c6-c2df54fb0e94.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/ef39caf7-09ec-41e2-8811-20cf0b6b15d3%20(1).jpg$j$, $j$ef39caf7-09ec-41e2-8811-20cf0b6b15d3 (1).jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/62dfdb69-5ed3-4b33-968b-941f6e196039.jpg$j$, $j$62dfdb69-5ed3-4b33-968b-941f6e196039.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/4d1504e9-91ea-42a6-a58c-2e4e052121ad.jpg$j$, $j$4d1504e9-91ea-42a6-a58c-2e4e052121ad.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/20f1264b-98e2-41ea-8086-5dbada80fea4.jpg$j$, $j$20f1264b-98e2-41ea-8086-5dbada80fea4.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/b1e70b68-960e-44f3-98cf-9ac3aabef553.jpg$j$, $j$b1e70b68-960e-44f3-98cf-9ac3aabef553.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/f69a5a21-195f-4546-9f02-09f566cf2d5e.jpg$j$, $j$f69a5a21-195f-4546-9f02-09f566cf2d5e.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/07a5842c-181c-4bf7-97a7-dc4b39de5416.jpg$j$, $j$07a5842c-181c-4bf7-97a7-dc4b39de5416.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/e9b18823-92f1-4957-ba6c-8316f04a18af.jpg$j$, $j$e9b18823-92f1-4957-ba6c-8316f04a18af.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$/a42f5d7f-b585-4bcc-9ddf-683e11e37fcb.jpg$j$, $j$a42f5d7f-b585-4bcc-9ddf-683e11e37fcb.jpg$j$, $j$image/jpeg$j$, $j$Toyota Landcruiser 4x4 Safari Vehicle$j$),
  ($j$https://ik.imagekit.io/jinx/travel/5-1536x776%20(1).png?updatedAt=1750087067905$j$, $j$imagekit-5-1536x776 (1).png$j$, $j$image/png$j$, $j$Toyota Prado Luxury SUV$j$),
  ($j$/toyota-prado-interior.jpg$j$, $j$toyota-prado-interior.jpg$j$, $j$image/jpeg$j$, $j$Toyota Prado Luxury SUV$j$),
  ($j$/toyota-prado-dashboard-gps.jpg$j$, $j$toyota-prado-dashboard-gps.jpg$j$, $j$image/jpeg$j$, $j$Toyota Prado Luxury SUV$j$),
  ($j$/toyota-prado-seats-comfort.jpg$j$, $j$toyota-prado-seats-comfort.jpg$j$, $j$image/jpeg$j$, $j$Toyota Prado Luxury SUV$j$),
  ($j$/toyota-prado-exterior-sunset.jpg$j$, $j$toyota-prado-exterior-sunset.jpg$j$, $j$image/jpeg$j$, $j$Toyota Prado Luxury SUV$j$),
  ($j$/toyota-prado-cargo-space.jpg$j$, $j$toyota-prado-cargo-space.jpg$j$, $j$image/jpeg$j$, $j$Toyota Prado Luxury SUV$j$),
  ($j$/toyota-prado-off-road.jpg$j$, $j$toyota-prado-off-road.jpg$j$, $j$image/jpeg$j$, $j$Toyota Prado Luxury SUV$j$),
  ($j$https://ik.imagekit.io/jinx/travel/4-1536x776%20(1).png?updatedAt=1750087065024$j$, $j$imagekit-4-1536x776 (1).png$j$, $j$image/png$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$/roof-top-tent-open-at-sunset.jpg$j$, $j$roof-top-tent-open-at-sunset.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$/camping-vehicle-interior-kitchenette.jpg$j$, $j$camping-vehicle-interior-kitchenette.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$/roof-tent-interior-bedding.jpg$j$, $j$roof-tent-interior-bedding.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$/camping-setup-complete.jpg$j$, $j$camping-setup-complete.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$/solar-panel-installation.jpg$j$, $j$solar-panel-installation.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$/kitchen-equipment-detail.jpg$j$, $j$kitchen-equipment-detail.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$/camping-vehicle-night-lighting.jpg$j$, $j$camping-vehicle-night-lighting.jpg$j$, $j$image/jpeg$j$, $j$Luxury Roof Top Camping Safari Vehicle$j$),
  ($j$https://ik.imagekit.io/jinx/travel/WhatsApp%20Image%202025-07-07%20at%2018.28.17_94668579.jpg?updatedAt=1751902480309$j$, $j$imagekit-WhatsApp Image 2025-07-07 at 18.28.17_94668579.jpg$j$, $j$image/jpeg$j$, $j$Professional Photography Safari Vehicle$j$),
  ($j$/db958401-6169-4947-a0f0-bbca4bfc716e.jpg$j$, $j$db958401-6169-4947-a0f0-bbca4bfc716e.jpg$j$, $j$image/jpeg$j$, $j$Professional Photography Safari Vehicle$j$),
  ($j$/f8730438-2fbd-4dcb-a628-d1980d6be96d.jpg$j$, $j$f8730438-2fbd-4dcb-a628-d1980d6be96d.jpg$j$, $j$image/jpeg$j$, $j$Professional Photography Safari Vehicle$j$),
  ($j$https://ik.imagekit.io/jinx/travel/WhatsApp%20Image%202025-07-07%20at%2018.28.17_2e082e13.jpg?updatedAt=1751902480189$j$, $j$imagekit-WhatsApp Image 2025-07-07 at 18.28.17_2e082e13.jpg$j$, $j$image/jpeg$j$, $j$Professional Photography Safari Vehicle$j$),
  ($j$/photography-vehicle-camera-mounts.jpg$j$, $j$photography-vehicle-camera-mounts.jpg$j$, $j$image/jpeg$j$, $j$Professional Photography Safari Vehicle$j$),
  ($j$/professional-photographer-in-action.jpg$j$, $j$professional-photographer-in-action.jpg$j$, $j$image/jpeg$j$, $j$Professional Photography Safari Vehicle$j$),
  ($j$/equipment-storage-compartments.jpg$j$, $j$equipment-storage-compartments.jpg$j$, $j$image/jpeg$j$, $j$Professional Photography Safari Vehicle$j$),
  ($j$https://ik.imagekit.io/jinx/travel/WhatsApp%20Image%202025-09-02%20at%2011.43.25%20AM.jpeg?updatedAt=1756810077606$j$, $j$imagekit-WhatsApp Image 2025-09-02 at 11.43.25 AM.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/21.jpeg$j$, $j$21.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/11.jpeg$j$, $j$11.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/14.jpeg$j$, $j$14.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/16.jpeg$j$, $j$16.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/20.jpeg$j$, $j$20.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/23.jpeg$j$, $j$23.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/27.jpeg$j$, $j$27.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/30.jpeg$j$, $j$30.jpeg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/accessible-vehicle-interior.jpg$j$, $j$accessible-vehicle-interior.jpg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/hydraulic-ramp-operation.jpg$j$, $j$hydraulic-ramp-operation.jpg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/wheelchair-secure-system.jpg$j$, $j$wheelchair-secure-system.jpg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/accessible-safari-viewing.jpg$j$, $j$accessible-safari-viewing.jpg$j$, $j$image/jpeg$j$, $j$Wheelchair Accessible Safari Landcruiser$j$),
  ($j$/2424ad9a-143e-4d19-a86e-3082e845c6ea.jpg$j$, $j$2424ad9a-143e-4d19-a86e-3082e845c6ea.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/6aa2209d-03d4-4345-bb36-c0d0dacad380.jpg$j$, $j$6aa2209d-03d4-4345-bb36-c0d0dacad380.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/79bf4c9c-22d8-4bdd-bef6-76a88e0628f3.jpg$j$, $j$79bf4c9c-22d8-4bdd-bef6-76a88e0628f3.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/18c27b2c-2140-471c-a1cf-1b58df255c0c.jpg$j$, $j$18c27b2c-2140-471c-a1cf-1b58df255c0c.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/b7e62c35-9f1e-4140-ab4a-fcfe18e7eea1.jpg$j$, $j$b7e62c35-9f1e-4140-ab4a-fcfe18e7eea1.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/2047d157-e31a-4f9e-8771-afd37abe204a.jpg$j$, $j$2047d157-e31a-4f9e-8771-afd37abe204a.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/van-storage-capacity-showcase.jpg$j$, $j$van-storage-capacity-showcase.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/minivan-road-trip-scene.jpg$j$, $j$minivan-road-trip-scene.jpg$j$, $j$image/jpeg$j$, $j$Family Safari Minivan with Pop-up Roof$j$),
  ($j$/kenya-safari-landscape.jpg$j$, $j$kenya-safari-landscape.jpg$j$, $j$image/jpeg$j$, $j$Kenya safari landscape$j$),
  ($j$/tanzania-serengeti.jpg$j$, $j$tanzania-serengeti.jpg$j$, $j$image/jpeg$j$, $j$Tanzania safari landscape$j$),
  ($j$/rwanda-mountain-gorillas.jpg$j$, $j$rwanda-mountain-gorillas.jpg$j$, $j$image/jpeg$j$, $j$Rwanda safari landscape$j$),
  ($j$/uganda-wildlife.jpg$j$, $j$uganda-wildlife.jpg$j$, $j$image/jpeg$j$, $j$Uganda safari landscape$j$)
),
new_rows AS (
  INSERT INTO media (url, thumbnail_u_r_l, filename, mime_type)
  SELECT url, url, filename, mime FROM src
  WHERE NOT EXISTS (SELECT 1 FROM media m WHERE m.url = src.url)
  RETURNING id, url
)
INSERT INTO media_locales (alt, _locale, _parent_id)
SELECT src.alt, 'en', new_rows.id FROM new_rows JOIN src ON src.url = new_rows.url;


-- 3. Destinations (the four country pages, plus one for multi-country tours) --------------------------
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM destinations WHERE slug = $j$kenya$j$) THEN
    INSERT INTO destinations (slug, generate_slug, country, image_id) VALUES ($j$kenya$j$, false, $j$KE$j$, (SELECT id FROM media WHERE url = $j$/kenya-safari-landscape.jpg$j$ ORDER BY id LIMIT 1)) RETURNING id INTO v;
    INSERT INTO destinations_locales (name, description, _locale, _parent_id) VALUES ($j$Kenya$j$, $j$Home to the iconic Masai Mara, stunning coastlines, and diverse wildlife, Kenya offers the quintessential African safari experience.

Kenya is the birthplace of the safari and remains one of Africa's premier wildlife destinations. From the Masai Mara Great Migration to Mount Kenya and the coastal beaches, Kenya offers unmatched diversity.$j$, 'en', v);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM destinations WHERE slug = $j$tanzania$j$) THEN
    INSERT INTO destinations (slug, generate_slug, country, image_id) VALUES ($j$tanzania$j$, false, $j$TZ$j$, (SELECT id FROM media WHERE url = $j$/tanzania-serengeti.jpg$j$ ORDER BY id LIMIT 1)) RETURNING id INTO v;
    INSERT INTO destinations_locales (name, description, _locale, _parent_id) VALUES ($j$Tanzania$j$, $j$Experience the Serengeti plains, Ngorongoro Crater wildlife, and Zanzibar's tropical paradise.

Tanzania is home to the Serengeti migration, Ngorongoro Crater, Mount Kilimanjaro, and Zanzibar’s beaches, making it one of Africa’s top safari destinations.$j$, 'en', v);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM destinations WHERE slug = $j$rwanda$j$) THEN
    INSERT INTO destinations (slug, generate_slug, country, image_id) VALUES ($j$rwanda$j$, false, $j$RW$j$, (SELECT id FROM media WHERE url = $j$/rwanda-mountain-gorillas.jpg$j$ ORDER BY id LIMIT 1)) RETURNING id INTO v;
    INSERT INTO destinations_locales (name, description, _locale, _parent_id) VALUES ($j$Rwanda$j$, $j$The land of a thousand hills offers intimate gorilla trekking and stunning landscapes.

Rwanda is known for mountain gorilla trekking in Volcanoes National Park, clean cities, and strong conservation efforts.$j$, 'en', v);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM destinations WHERE slug = $j$uganda$j$) THEN
    INSERT INTO destinations (slug, generate_slug, country, image_id) VALUES ($j$uganda$j$, false, $j$UG$j$, (SELECT id FROM media WHERE url = $j$/uganda-wildlife.jpg$j$ ORDER BY id LIMIT 1)) RETURNING id INTO v;
    INSERT INTO destinations_locales (name, description, _locale, _parent_id) VALUES ($j$Uganda$j$, $j$The Pearl of Africa offers gorilla trekking, wildlife, and adventure activities.

Uganda is rich in biodiversity, from Bwindi gorillas to Queen Elizabeth lions and Nile River adventures in Jinja.$j$, 'en', v);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM destinations WHERE slug = $j$multi-country$j$) THEN
    INSERT INTO destinations (slug, generate_slug, country, image_id) VALUES ($j$multi-country$j$, false, $j$other$j$, NULL) RETURNING id INTO v;
    INSERT INTO destinations_locales (name, description, _locale, _parent_id) VALUES ($j$East Africa (multi-country)$j$, $j$Safaris that cross two or more countries in East Africa.$j$, 'en', v);
  END IF;
END $do$;

-- 4. Vehicles -------------------------------------------------------------------------------------------
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = $j$toyota-landcruiser$j$) THEN
    INSERT INTO vehicles (slug, generate_slug, published, sample, type, seats, hero_image_id, accessible)
      VALUES ($j$toyota-landcruiser$j$, false, true, false, $j$land-cruiser$j$, 7, (SELECT id FROM media WHERE url = $j$/1b436e43-e979-4d81-93e1-972fbee500dd.jpg$j$ ORDER BY id LIMIT 1), false) RETURNING id INTO v;
    INSERT INTO vehicles_locales (name, summary, description, _locale, _parent_id) VALUES ($j$Toyota Landcruiser 4x4 Safari Vehicle$j$, $j$Experience the ultimate East African safari adventure with our rugged Toyota Landcruiser hire$j$, $j$Experience the ultimate East African safari adventure with our rugged Toyota Landcruiser hire. This legendary 4WD vehicle rental combines exceptional off-road capabilities with proven reliability, making it the perfect choice for navigating Kenya's challenging terrain, Tanzania's vast savannas, Rwanda's volcanic hills, and Uganda's diverse landscapes. Specially equipped for safari vehicle rental with a pop-up roof for optimal wildlife viewing, this Landcruiser hire ensures you won't miss a single moment of your game drives. Our meticulously maintained fleet offers the perfect balance of durability and comfort for your East African expedition.

Ideal for: Perfect for extended game drives, rough terrain exploration, and multi-day safari expeditions across East Africa's national parks and reserves$j$, 'en', v);
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (1, v, $j$19e3499203a3f73896b2027f$j$, (SELECT id FROM media WHERE url = $j$/1b436e43-e979-4d81-93e1-972fbee500dd.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (2, v, $j$99ec3e0a041563c27693734a$j$, (SELECT id FROM media WHERE url = $j$/42376dae-b77d-4c57-bfb9-9168f3095936.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (3, v, $j$5dfb179352c386a103037b40$j$, (SELECT id FROM media WHERE url = $j$/a72177d7-cdb1-405c-9c8e-0f6def7d3912.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (4, v, $j$743598e8aa1a779ad5d69963$j$, (SELECT id FROM media WHERE url = $j$/bc797b77-1554-4a2f-9b17-6112454c25bd.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (5, v, $j$6da04e8f9e154a09a59b44b8$j$, (SELECT id FROM media WHERE url = $j$/39c2510c-fb4c-4246-95c6-c2df54fb0e94.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (6, v, $j$28574ed4120c07a6e6eb6c04$j$, (SELECT id FROM media WHERE url = $j$/ef39caf7-09ec-41e2-8811-20cf0b6b15d3%20(1).jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (7, v, $j$7a341680351a60231ac318f5$j$, (SELECT id FROM media WHERE url = $j$/62dfdb69-5ed3-4b33-968b-941f6e196039.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (8, v, $j$86b3e5705477790eccd72698$j$, (SELECT id FROM media WHERE url = $j$/4d1504e9-91ea-42a6-a58c-2e4e052121ad.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (9, v, $j$6bf0f908a5e2d856952b0a0e$j$, (SELECT id FROM media WHERE url = $j$/20f1264b-98e2-41ea-8086-5dbada80fea4.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (10, v, $j$f44efb6c607d79904ed0dd23$j$, (SELECT id FROM media WHERE url = $j$/b1e70b68-960e-44f3-98cf-9ac3aabef553.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (11, v, $j$b12e3a7365fba92174b762b2$j$, (SELECT id FROM media WHERE url = $j$/f69a5a21-195f-4546-9f02-09f566cf2d5e.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (12, v, $j$28463fab5684bb8b51c76baa$j$, (SELECT id FROM media WHERE url = $j$/07a5842c-181c-4bf7-97a7-dc4b39de5416.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (13, v, $j$ff3b9755b839d306877e8c48$j$, (SELECT id FROM media WHERE url = $j$/e9b18823-92f1-4957-ba6c-8316f04a18af.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (14, v, $j$215484d257894f06a390b3e7$j$, (SELECT id FROM media WHERE url = $j$/a42f5d7f-b585-4bcc-9ddf-683e11e37fcb.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (1, v, $j$accd5d77c1947d7e725f2551$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Full-time 4WD system for challenging terrain$j$, 'en', $j$accd5d77c1947d7e725f2551$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (2, v, $j$679175eb4d98a9de7905acb8$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Pop-up roof with 360-degree viewing platform$j$, 'en', $j$679175eb4d98a9de7905acb8$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (3, v, $j$6d2f53ed6eb63cea405a89bb$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Multiple USB charging ports for all devices$j$, 'en', $j$6d2f53ed6eb63cea405a89bb$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (4, v, $j$0ddaf5cf0948ccc20c94da04$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Insulated cooler box for refreshments$j$, 'en', $j$0ddaf5cf0948ccc20c94da04$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (5, v, $j$3028203b6bd8ad9b59e9ae9a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Comprehensive first aid kit and safety equipment$j$, 'en', $j$3028203b6bd8ad9b59e9ae9a$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (6, v, $j$bf1cad2c30771839ef25137c$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Full-size spare tire with tools$j$, 'en', $j$bf1cad2c30771839ef25137c$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (7, v, $j$8a65c366b541ec48164ac2ff$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Powerful air conditioning system$j$, 'en', $j$8a65c366b541ec48164ac2ff$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (8, v, $j$1ce4be2252197f2f5d48938a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Heavy-duty suspension for comfort$j$, 'en', $j$1ce4be2252197f2f5d48938a$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (9, v, $j$df14edfb3299295d40504638$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Fog lights and off-road lighting$j$, 'en', $j$df14edfb3299295d40504638$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (10, v, $j$84af9290268e24c298f7c8e3$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Window mesh for ventilation and insect protection$j$, 'en', $j$84af9290268e24c298f7c8e3$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (1, v, $j$f6f01f3dc8343ecd144a79ee$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Brand$j$, $j$Toyota$j$, 'en', $j$f6f01f3dc8343ecd144a79ee$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (2, v, $j$1c0d64bff0afc1b910e3662d$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Model$j$, $j$Land Cruiser 4x4$j$, 'en', $j$1c0d64bff0afc1b910e3662d$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (3, v, $j$87277f696f3ac25054f2e70a$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Year$j$, $j$2022$j$, 'en', $j$87277f696f3ac25054f2e70a$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (4, v, $j$31ef9fb4257de344718f8617$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Colour$j$, $j$White$j$, 'en', $j$31ef9fb4257de344718f8617$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (5, v, $j$4c0491e9d30be043acf0e43b$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Capacity$j$, $j$7 passengers with ample legroom$j$, 'en', $j$4c0491e9d30be043acf0e43b$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (6, v, $j$a68244c83e8f7f7eddaaf846$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Engine$j$, $j$4.5L 1HZ Turbo Diesel Engine$j$, 'en', $j$a68244c83e8f7f7eddaaf846$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (7, v, $j$2da43ff670dcfe6ad64e2b15$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Transmission$j$, $j$5-Speed Manual Transmission$j$, 'en', $j$2da43ff670dcfe6ad64e2b15$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (8, v, $j$958d2e2dd1a75753dfa3f1e8$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel type$j$, $j$Diesel$j$, 'en', $j$958d2e2dd1a75753dfa3f1e8$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (9, v, $j$8b52fb84bafe158a649599f6$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Drive type$j$, $j$4WD$j$, 'en', $j$8b52fb84bafe158a649599f6$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (10, v, $j$827ac6d0be08ece90d01726d$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Luggage$j$, $j$Large capacity roof rack and rear storage for all safari gear$j$, 'en', $j$827ac6d0be08ece90d01726d$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (11, v, $j$64aec3ebd673b767d5c2b117$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel efficiency$j$, $j$Approximately 14L/100km in mixed conditions$j$, 'en', $j$64aec3ebd673b767d5c2b117$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (12, v, $j$b422861ded02ca6d50f9127f$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Seats$j$, $j$7$j$, 'en', $j$b422861ded02ca6d50f9127f$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (13, v, $j$d8fbe517372f4fa75dda754d$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Doors$j$, $j$5$j$, 'en', $j$d8fbe517372f4fa75dda754d$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (1, v, $j$efcb1c00efdb2b0c86319534$j$, 20000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Vehicle hire$j$, $j$day$j$, 'en', $j$efcb1c00efdb2b0c86319534$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (2, v, $j$8b530ec04ee19d072b3c8f7d$j$, 8000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Professional Safari Driver/Guide$j$, $j$day$j$, 'en', $j$8b530ec04ee19d072b3c8f7d$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (3, v, $j$5af4864426341836c1156c5f$j$, 5000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Camping Equipment Package$j$, $j$day$j$, 'en', $j$5af4864426341836c1156c5f$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (4, v, $j$0f2c09a94b0665cab1d4d826$j$, 3000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Satellite Phone$j$, $j$day$j$, 'en', $j$0f2c09a94b0665cab1d4d826$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (5, v, $j$a5d6c5b6d711186a52d0a022$j$, 1000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Child Safety Seat$j$, $j$day$j$, 'en', $j$a5d6c5b6d711186a52d0a022$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (6, v, $j$73dd53e727e5e0f5d6f734e8$j$, 4000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Additional Driver$j$, $j$day$j$, 'en', $j$73dd53e727e5e0f5d6f734e8$j$);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = $j$toyota-prado$j$) THEN
    INSERT INTO vehicles (slug, generate_slug, published, sample, type, seats, hero_image_id, accessible)
      VALUES ($j$toyota-prado$j$, false, true, false, $j$land-cruiser$j$, 5, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/5-1536x776%20(1).png?updatedAt=1750087067905$j$ ORDER BY id LIMIT 1), false) RETURNING id INTO v;
    INSERT INTO vehicles_locales (name, summary, description, _locale, _parent_id) VALUES ($j$Toyota Prado Luxury SUV$j$, $j$Discover the perfect blend of luxury and capability with our Toyota Prado rental service$j$, $j$Discover the perfect blend of luxury and capability with our Toyota Prado rental service. This premium SUV offers exceptional comfort for family safaris while maintaining the rugged reliability needed for East Africa's diverse terrain. With advanced 4WD capabilities, plush interior appointments, and modern amenities, our Toyota Prado provides a superior travel experience whether you're exploring city attractions or venturing into national parks. Experience the ultimate in comfortable touring with this versatile and dependable SUV hire.

Ideal for: Excellent for family safaris, luxury touring, business travel, and comfortable exploration of both urban and rural destinations across East Africa$j$, 'en', v);
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (1, v, $j$d79a80053ecda92d26aadc52$j$, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/5-1536x776%20(1).png?updatedAt=1750087067905$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (2, v, $j$5aae39eaaa3030ed42976ff2$j$, (SELECT id FROM media WHERE url = $j$/toyota-prado-interior.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (3, v, $j$5d231bd944702aea6585469c$j$, (SELECT id FROM media WHERE url = $j$/toyota-prado-dashboard-gps.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (4, v, $j$96d580bf5ebc2ed8ec547ab4$j$, (SELECT id FROM media WHERE url = $j$/toyota-prado-seats-comfort.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (5, v, $j$12cc1208bf78dd7fca02c6d7$j$, (SELECT id FROM media WHERE url = $j$/toyota-prado-exterior-sunset.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (6, v, $j$6b4a89c588791ad00f9be235$j$, (SELECT id FROM media WHERE url = $j$/toyota-prado-cargo-space.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (7, v, $j$72106e0d0d98fdec5bb40a40$j$, (SELECT id FROM media WHERE url = $j$/toyota-prado-off-road.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (1, v, $j$7502c7892831b497b3472c5a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Full-time 4WD with multiple terrain modes$j$, 'en', $j$7502c7892831b497b3472c5a$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (2, v, $j$cdaec0cfc42f7f47f60d4c28$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Dual-zone automatic climate control$j$, 'en', $j$cdaec0cfc42f7f47f60d4c28$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (3, v, $j$cebfc573c1442d8c14a3f868$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Integrated GPS navigation with offline maps$j$, 'en', $j$cebfc573c1442d8c14a3f868$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (4, v, $j$812adffb55635a32ee30d005$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Bluetooth connectivity and premium audio$j$, 'en', $j$812adffb55635a32ee30d005$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (5, v, $j$c214a5744386b909e821d6db$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Advanced safety features including multiple airbags$j$, 'en', $j$c214a5744386b909e821d6db$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (6, v, $j$5888178b6e1eb57e6296a426$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$High-speed USB charging ports throughout$j$, 'en', $j$5888178b6e1eb57e6296a426$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (7, v, $j$fe9790981b81eb1368d5048c$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Leather upholstery and heated seats$j$, 'en', $j$fe9790981b81eb1368d5048c$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (8, v, $j$e6c234a4498914a814730ca1$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Sunroof for additional light and views$j$, 'en', $j$e6c234a4498914a814730ca1$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (9, v, $j$0f698b43c91c270e3ad499f4$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Parking sensors and rearview camera$j$, 'en', $j$0f698b43c91c270e3ad499f4$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (10, v, $j$d742b0e143b0a5da9dc13b4b$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Keyless entry and push-button start$j$, 'en', $j$d742b0e143b0a5da9dc13b4b$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (1, v, $j$ad017afa9f0c82b4498f2c56$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Brand$j$, $j$Toyota$j$, 'en', $j$ad017afa9f0c82b4498f2c56$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (2, v, $j$aad703eea1d8af43349d3ee1$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Model$j$, $j$Prado$j$, 'en', $j$aad703eea1d8af43349d3ee1$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (3, v, $j$4ba760760dfea48bddd6c699$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Year$j$, $j$2023$j$, 'en', $j$4ba760760dfea48bddd6c699$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (4, v, $j$cf66bda8c142682cf0f76d15$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Colour$j$, $j$Silver$j$, 'en', $j$cf66bda8c142682cf0f76d15$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (5, v, $j$7dfec935906ef944cf5946d9$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Capacity$j$, $j$5 passengers in premium comfort$j$, 'en', $j$7dfec935906ef944cf5946d9$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (6, v, $j$1fc4dac4cad97c31dd9c2bdd$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Engine$j$, $j$3.0L Turbo Diesel Engine with 250hp$j$, 'en', $j$1fc4dac4cad97c31dd9c2bdd$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (7, v, $j$3108bf8a1e3247438ceb9bdd$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Transmission$j$, $j$6-Speed Automatic Transmission$j$, 'en', $j$3108bf8a1e3247438ceb9bdd$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (8, v, $j$edad3008292b96d93bb8aaa7$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel type$j$, $j$Diesel$j$, 'en', $j$edad3008292b96d93bb8aaa7$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (9, v, $j$424917f4551f7bababf9d134$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Drive type$j$, $j$4WD$j$, 'en', $j$424917f4551f7bababf9d134$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (10, v, $j$052d8d6ab19579fb782cec20$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Luggage$j$, $j$Medium capacity with 60/40 split folding rear seats$j$, 'en', $j$052d8d6ab19579fb782cec20$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (11, v, $j$96fdea02fd93cbcc5be0d8c5$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel efficiency$j$, $j$Approximately 11L/100km highway driving$j$, 'en', $j$96fdea02fd93cbcc5be0d8c5$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (12, v, $j$4b941cb00a6538b9ff42b952$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Seats$j$, $j$5$j$, 'en', $j$4b941cb00a6538b9ff42b952$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (13, v, $j$e4dd67a26769ca480d837deb$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Doors$j$, $j$5$j$, 'en', $j$e4dd67a26769ca480d837deb$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (1, v, $j$66accca1c2ae10a884f1804a$j$, 20000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Vehicle hire$j$, $j$day$j$, 'en', $j$66accca1c2ae10a884f1804a$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (2, v, $j$98f7e2ac79d2f5ce3cc7080f$j$, 1500); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Mobile Wi-Fi Hotspot$j$, $j$day$j$, 'en', $j$98f7e2ac79d2f5ce3cc7080f$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (3, v, $j$db88bd10f8cfb7a122c1b22c$j$, 2500); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Premium Insurance Coverage$j$, $j$day$j$, 'en', $j$db88bd10f8cfb7a122c1b22c$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (4, v, $j$f46d1373698a90f0f9dbf2f2$j$, 1500); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Premium Child Safety Seat$j$, $j$day$j$, 'en', $j$f46d1373698a90f0f9dbf2f2$j$);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = $j$luxury-roof-top-camping$j$) THEN
    INSERT INTO vehicles (slug, generate_slug, published, sample, type, seats, hero_image_id, accessible)
      VALUES ($j$luxury-roof-top-camping$j$, false, true, false, $j$rooftop-camper$j$, 4, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/4-1536x776%20(1).png?updatedAt=1750087065024$j$ ORDER BY id LIMIT 1), false) RETURNING id INTO v;
    INSERT INTO vehicles_locales (name, summary, description, _locale, _parent_id) VALUES ($j$Luxury Roof Top Camping Safari Vehicle$j$, $j$Elevate your safari experience with our luxury roof top camping vehicle—the ultimate overland adventure solution for East Africa$j$, $j$Elevate your safari experience with our luxury roof top camping vehicle—the ultimate overland adventure solution for East Africa. This specially converted camping safari car allows you to sleep safely above the ground while enjoying unparalleled views of the African wilderness. Complete with premium camping equipment, solar power systems, and kitchen facilities, this vehicle transforms into a mobile boutique hotel. Experience the magic of sleeping under the stars while maintaining comfort and security in remote locations across Kenya, Tanzania, Rwanda, and Uganda.

Ideal for: Perfect for adventurous camping safaris, overland expeditions, self-drive adventures, and immersive wilderness experiences across East Africa$j$, 'en', v);
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (1, v, $j$cf9d3645910ee437826618e3$j$, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/4-1536x776%20(1).png?updatedAt=1750087065024$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (2, v, $j$ae565d4e5727413a604a2444$j$, (SELECT id FROM media WHERE url = $j$/roof-top-tent-open-at-sunset.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (3, v, $j$d6b50db51d291f2facdc4e7e$j$, (SELECT id FROM media WHERE url = $j$/camping-vehicle-interior-kitchenette.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (4, v, $j$df43b8b13eb67d5ad12b8bac$j$, (SELECT id FROM media WHERE url = $j$/roof-tent-interior-bedding.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (5, v, $j$1c83fc609b13292e2132cbc8$j$, (SELECT id FROM media WHERE url = $j$/camping-setup-complete.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (6, v, $j$a5c7017314a938cff5f7e4aa$j$, (SELECT id FROM media WHERE url = $j$/solar-panel-installation.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (7, v, $j$af162897bdb11b050c5f24db$j$, (SELECT id FROM media WHERE url = $j$/kitchen-equipment-detail.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (8, v, $j$26544de81fd22ae7b99fe274$j$, (SELECT id FROM media WHERE url = $j$/camping-vehicle-night-lighting.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (1, v, $j$b7bbb6112b0c2dcb233c15d9$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Premium hard-shell roof tent with mattress$j$, 'en', $j$b7bbb6112b0c2dcb233c15d9$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (2, v, $j$25841358b49421b14f230364$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Complete camping gear including chairs and table$j$, 'en', $j$25841358b49421b14f230364$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (3, v, $j$d6a139f56df112b137a0075a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Solar power system with battery storage$j$, 'en', $j$d6a139f56df112b137a0075a$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (4, v, $j$938cccfe7b53d9acbc244451$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Compact kitchenette with gas stove$j$, 'en', $j$938cccfe7b53d9acbc244451$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (5, v, $j$db6ddca4de2a4ac474e7a5c9$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$High-quality bedding and sleeping bags$j$, 'en', $j$db6ddca4de2a4ac474e7a5c9$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (6, v, $j$746d3d0156ca62ca1fc173aa$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Professional cooking equipment and utensils$j$, 'en', $j$746d3d0156ca62ca1fc173aa$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (7, v, $j$e3073353520941e1cb5c10f2$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Outdoor shower attachment with privacy tent$j$, 'en', $j$e3073353520941e1cb5c10f2$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (8, v, $j$9ad5dd01f1c82379499f7a7d$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Water filtration and storage system$j$, 'en', $j$9ad5dd01f1c82379499f7a7d$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (9, v, $j$163b4bc3abfb7c0081767546$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$LED lighting system for camp area$j$, 'en', $j$163b4bc3abfb7c0081767546$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (10, v, $j$926c04b7d25967ccd00c892a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Secure storage for camping equipment$j$, 'en', $j$926c04b7d25967ccd00c892a$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (1, v, $j$2fe8f3ab8acd531afc0293a4$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Brand$j$, $j$Toyota$j$, 'en', $j$2fe8f3ab8acd531afc0293a4$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (2, v, $j$8449d21e216ed3c44afb3fa6$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Model$j$, $j$Land Cruiser Roof Top Camping Edition$j$, 'en', $j$8449d21e216ed3c44afb3fa6$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (3, v, $j$e493cf78ca70ca2407744d95$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Year$j$, $j$2022$j$, 'en', $j$e493cf78ca70ca2407744d95$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (4, v, $j$fd65ace7fa71adf50880572f$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Colour$j$, $j$White$j$, 'en', $j$fd65ace7fa71adf50880572f$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (5, v, $j$0856d89a72502c4169cc1f33$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Capacity$j$, $j$4 passengers with rooftop sleeping for 2-3$j$, 'en', $j$0856d89a72502c4169cc1f33$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (6, v, $j$0cb4a69240ab36c5c5104b60$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Engine$j$, $j$4.0L V6 Diesel Engine$j$, 'en', $j$0cb4a69240ab36c5c5104b60$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (7, v, $j$5928d5a71c89cadb8dfddf58$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Transmission$j$, $j$Automatic/Manual options available$j$, 'en', $j$5928d5a71c89cadb8dfddf58$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (8, v, $j$e9d1b5b80cda00468996371c$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel type$j$, $j$Diesel$j$, 'en', $j$e9d1b5b80cda00468996371c$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (9, v, $j$3438f544f68be75fbac8e462$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Drive type$j$, $j$4WD$j$, 'en', $j$3438f544f68be75fbac8e462$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (10, v, $j$ea7c8fe93828daf0b872ed10$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Luggage$j$, $j$Dedicated storage for all camping equipment included$j$, 'en', $j$ea7c8fe93828daf0b872ed10$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (11, v, $j$6176b71597cf77782e9cc158$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel efficiency$j$, $j$Approximately 16L/100km with full load$j$, 'en', $j$6176b71597cf77782e9cc158$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (12, v, $j$fc0fef509c870eb4b915687b$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Seats$j$, $j$4$j$, 'en', $j$fc0fef509c870eb4b915687b$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (13, v, $j$3d316909605bcffb11dee0b3$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Doors$j$, $j$5$j$, 'en', $j$3d316909605bcffb11dee0b3$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (1, v, $j$c4f5d626546cc2e3b18284b4$j$, 20000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Vehicle hire$j$, $j$day$j$, 'en', $j$c4f5d626546cc2e3b18284b4$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (2, v, $j$bc4fa8bff7e4a78488a3ac30$j$, 7000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Experienced Camping Guide$j$, $j$day$j$, 'en', $j$bc4fa8bff7e4a78488a3ac30$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (3, v, $j$71e6b323a642981cb746acb0$j$, 3000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Additional Ground Tent$j$, $j$day$j$, 'en', $j$71e6b323a642981cb746acb0$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (4, v, $j$df326d75207565ca96ccf0e2$j$, 4000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Photography Equipment Package$j$, $j$day$j$, 'en', $j$df326d75207565ca96ccf0e2$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (5, v, $j$aa01feccc2ae0da333a8f72d$j$, 5000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Custom Camping Route Planning$j$, $j$one$j$, 'en', $j$aa01feccc2ae0da333a8f72d$j$);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = $j$photography-converted-vehicle$j$) THEN
    INSERT INTO vehicles (slug, generate_slug, published, sample, type, seats, hero_image_id, accessible)
      VALUES ($j$photography-converted-vehicle$j$, false, true, false, $j$land-cruiser$j$, 6, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/WhatsApp%20Image%202025-07-07%20at%2018.28.17_94668579.jpg?updatedAt=1751902480309$j$ ORDER BY id LIMIT 1), false) RETURNING id INTO v;
    INSERT INTO vehicles_locales (name, summary, description, _locale, _parent_id) VALUES ($j$Professional Photography Safari Vehicle$j$, $j$Capture breathtaking wildlife moments with our specially modified photography safari vehicle, designed exclusively for professional photographers and serious enthusiasts$j$, $j$Capture breathtaking wildlife moments with our specially modified photography safari vehicle, designed exclusively for professional photographers and serious enthusiasts. This camera car rental features an extended roof for unobstructed 360-degree shooting, multiple camera mounting points, and specialized stabilization equipment. Whether you're photographing the Great Migration in Tanzania, mountain gorillas in Rwanda, or big cats in Kenya, our photography-converted vehicle provides the perfect platform for exceptional wildlife imagery with maximum comfort and stability.

Ideal for: Specifically designed for professional wildlife photography, bird watching tours, documentary filming, and serious photography expeditions across East Africa$j$, 'en', v);
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (1, v, $j$05af81911ae7b6dce4f4cabb$j$, (SELECT id FROM media WHERE url = $j$/db958401-6169-4947-a0f0-bbca4bfc716e.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (2, v, $j$4d1842fd6b360034ea049547$j$, (SELECT id FROM media WHERE url = $j$/f8730438-2fbd-4dcb-a628-d1980d6be96d.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (3, v, $j$7f2db578f5abd5e801bec8a0$j$, (SELECT id FROM media WHERE url = $j$/safari-vehicle-extended-roof-for-photography.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (4, v, $j$374186cd78545e120fb16cdc$j$, (SELECT id FROM media WHERE url = $j$/ef39caf7-09ec-41e2-8811-20cf0b6b15d3%20(1).jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (5, v, $j$3ce6e0518029dce0a25c6b9a$j$, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/WhatsApp%20Image%202025-07-07%20at%2018.28.17_2e082e13.jpg?updatedAt=1751902480189$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (6, v, $j$8cdc3419a9893dba7f243520$j$, (SELECT id FROM media WHERE url = $j$/photography-vehicle-camera-mounts.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (7, v, $j$257c6ee62d792c1bab3566a0$j$, (SELECT id FROM media WHERE url = $j$/professional-photographer-in-action.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (8, v, $j$2a2a32d1a62282a3fce64727$j$, (SELECT id FROM media WHERE url = $j$/equipment-storage-compartments.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (1, v, $j$40d4b58c2620975595ae652e$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Multiple articulated camera mounts and clamps$j$, 'en', $j$40d4b58c2620975595ae652e$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (2, v, $j$ebd2895054c807a87f4f3ca9$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Professional-grade bean bags for all windows$j$, 'en', $j$ebd2895054c807a87f4f3ca9$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (3, v, $j$d34f12e65e80aa5aed52ef8f$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Extended roof with 360-degree shooting platform$j$, 'en', $j$d34f12e65e80aa5aed52ef8f$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (4, v, $j$b6cc5b7a09708961266ad984$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$High-capacity charging stations for camera batteries$j$, 'en', $j$b6cc5b7a09708961266ad984$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (5, v, $j$5cde98b8326bb981f7c58ca2$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Climate-controlled equipment storage compartments$j$, 'en', $j$5cde98b8326bb981f7c58ca2$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (6, v, $j$54d4e6e13ece9058f1dfbaf0$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Advanced stabilization equipment for smooth shots$j$, 'en', $j$54d4e6e13ece9058f1dfbaf0$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (7, v, $j$c0dac1c142f438bd18d49d6a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Fold-out side panels for low-angle photography$j$, 'en', $j$c0dac1c142f438bd18d49d6a$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (8, v, $j$05dfa071d33296134cd1cab9$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Dedicated laptop station for immediate editing$j$, 'en', $j$05dfa071d33296134cd1cab9$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (9, v, $j$f91803cc15a46bf1e1133018$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Equipment cleaning station with air blower$j$, 'en', $j$f91803cc15a46bf1e1133018$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (10, v, $j$e6f89da7d77f91945851ee2a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Secure locking system for valuable gear$j$, 'en', $j$e6f89da7d77f91945851ee2a$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (1, v, $j$f896d77a38f11e06637cc26c$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Brand$j$, $j$Toyota$j$, 'en', $j$f896d77a38f11e06637cc26c$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (2, v, $j$9b187183f8689bbd92ffd98b$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Model$j$, $j$Land Cruiser Photography Edition$j$, 'en', $j$9b187183f8689bbd92ffd98b$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (3, v, $j$97a56a7af4ace79cf71cae61$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Year$j$, $j$2023$j$, 'en', $j$97a56a7af4ace79cf71cae61$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (4, v, $j$5b8eaa991d35536d5ca3e417$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Colour$j$, $j$White$j$, 'en', $j$5b8eaa991d35536d5ca3e417$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (5, v, $j$70a5b9b0a3ea530679d34e62$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Capacity$j$, $j$6 passengers with dedicated photographer seating$j$, 'en', $j$70a5b9b0a3ea530679d34e62$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (6, v, $j$e913dd9ce88602dfb53979b5$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Engine$j$, $j$4.2L Turbo Diesel Engine$j$, 'en', $j$e913dd9ce88602dfb53979b5$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (7, v, $j$b642877a9855f8bd8a367bab$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Transmission$j$, $j$5-Speed Manual Transmission$j$, 'en', $j$b642877a9855f8bd8a367bab$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (8, v, $j$52abd72775709d8aea98a427$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel type$j$, $j$Diesel$j$, 'en', $j$52abd72775709d8aea98a427$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (9, v, $j$2687899e5c992f6af4a8d283$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Drive type$j$, $j$4WD$j$, 'en', $j$2687899e5c992f6af4a8d283$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (10, v, $j$cbb720f74ae20b6f23e9c316$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Luggage$j$, $j$Specialized photography gear storage with climate control$j$, 'en', $j$cbb720f74ae20b6f23e9c316$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (11, v, $j$c5fb443aaabc4a05598d2cd8$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel efficiency$j$, $j$Approximately 15L/100km with equipment load$j$, 'en', $j$c5fb443aaabc4a05598d2cd8$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (12, v, $j$bb195e9b3972c3c67bf6ad0f$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Seats$j$, $j$6$j$, 'en', $j$bb195e9b3972c3c67bf6ad0f$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (13, v, $j$1a5db851b137e8d88f085326$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Doors$j$, $j$5$j$, 'en', $j$1a5db851b137e8d88f085326$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (1, v, $j$2d7ae8a2e5dadcd90fe3e0f8$j$, 25000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Vehicle hire$j$, $j$day$j$, 'en', $j$2d7ae8a2e5dadcd90fe3e0f8$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (2, v, $j$bf80b396b3af13d97cccc848$j$, 12000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Professional Photographer Guide$j$, $j$day$j$, 'en', $j$bf80b396b3af13d97cccc848$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (3, v, $j$879f6d4e9e459f0c7f1a629e$j$, 8000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Full-frame Camera & Lens Rental$j$, NULL, 'en', $j$879f6d4e9e459f0c7f1a629e$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (4, v, $j$03a37beb60a88dea6cea308d$j$, 6000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$On-Safari Editing Workshop$j$, $j$day$j$, 'en', $j$03a37beb60a88dea6cea308d$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (5, v, $j$5f439de4617a9242fabc646c$j$, 4000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Daily Image Backup Service$j$, $j$day$j$, 'en', $j$5f439de4617a9242fabc646c$j$);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = $j$wheelchair-accessible-vehicle$j$) THEN
    INSERT INTO vehicles (slug, generate_slug, published, sample, type, seats, hero_image_id, accessible)
      VALUES ($j$wheelchair-accessible-vehicle$j$, false, true, false, $j$accessible$j$, 4, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/WhatsApp%20Image%202025-09-02%20at%2011.43.25%20AM.jpeg?updatedAt=1756810077606$j$ ORDER BY id LIMIT 1), true) RETURNING id INTO v;
    INSERT INTO vehicles_locales (name, summary, description, _locale, _parent_id) VALUES ($j$Wheelchair Accessible Safari Landcruiser$j$, $j$Experience the wonders of East Africa with our fully accessible wheelchair friendly safari vehicle, designed to ensure everyone can enjoy unforgettable safari adventures$j$, $j$Experience the wonders of East Africa with our fully accessible wheelchair friendly safari vehicle, designed to ensure everyone can enjoy unforgettable safari adventures. This disability safari car features a hydraulic lift system, secure wheelchair restraints, and spacious interior configurations. Our specially trained drivers understand accessibility needs and provide assistance throughout your journey. From the plains of Kenya to the hills of Rwanda, our inclusive safari transport makes African wildlife encounters accessible to all travelers regardless of mobility requirements.

Ideal for: Inclusive safari experiences for travelers with mobility challenges, accessible family vacations, disability-friendly tours, and barrier-free wildlife viewing across East Africa$j$, 'en', v);
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (1, v, $j$3077e2fa1f76bf7207947a1b$j$, (SELECT id FROM media WHERE url = $j$https://ik.imagekit.io/jinx/travel/WhatsApp%20Image%202025-09-02%20at%2011.43.25%20AM.jpeg?updatedAt=1756810077606$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (2, v, $j$8a8e01925fa6eb380fdca3f6$j$, (SELECT id FROM media WHERE url = $j$/21.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (3, v, $j$b8e216d2ab47f69b314771e4$j$, (SELECT id FROM media WHERE url = $j$/11.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (4, v, $j$c8d3b6b45549fb1af1d36101$j$, (SELECT id FROM media WHERE url = $j$/14.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (5, v, $j$327bef4c7a6189c7a3b2b337$j$, (SELECT id FROM media WHERE url = $j$/16.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (6, v, $j$9b5a7c980b89ab15ccebcbfc$j$, (SELECT id FROM media WHERE url = $j$/20.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (7, v, $j$22a9ac1ed872804eb029b336$j$, (SELECT id FROM media WHERE url = $j$/23.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (8, v, $j$7c5b49d453673117eaa7d0a6$j$, (SELECT id FROM media WHERE url = $j$/27.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (9, v, $j$265c0bdafa54e81607a72990$j$, (SELECT id FROM media WHERE url = $j$/30.jpeg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (10, v, $j$b89ddb651de764f9dd0ded89$j$, (SELECT id FROM media WHERE url = $j$/accessible-vehicle-interior.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (11, v, $j$a376cb6a1541d26765659fc0$j$, (SELECT id FROM media WHERE url = $j$/hydraulic-ramp-operation.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (12, v, $j$86fed7dcf9b5c771a8624b78$j$, (SELECT id FROM media WHERE url = $j$/wheelchair-secure-system.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (13, v, $j$278ffc00f3a066d970581d5d$j$, (SELECT id FROM media WHERE url = $j$/accessible-safari-viewing.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (1, v, $j$e5902a97a1ba8530a21d7bbd$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Automatic hydraulic wheelchair ramp$j$, 'en', $j$e5902a97a1ba8530a21d7bbd$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (2, v, $j$296d7e6fd99634142e829283$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Dedicated secure wheelchair area with locking system$j$, 'en', $j$296d7e6fd99634142e829283$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (3, v, $j$fc374f5d210fc4de30c3970f$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Wide access doors with minimal thresholds$j$, 'en', $j$fc374f5d210fc4de30c3970f$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (4, v, $j$8aee06e48d9ebf571b0f9528$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Multiple safety harnesses and restraint systems$j$, 'en', $j$8aee06e48d9ebf571b0f9528$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (5, v, $j$a1829fc04404f44d7d60567c$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Accessible environmental controls and communication$j$, 'en', $j$a1829fc04404f44d7d60567c$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (6, v, $j$c8cd325b7c52d7cd974f44dc$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Driver trained in disability assistance and first aid$j$, 'en', $j$c8cd325b7c52d7cd974f44dc$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (7, v, $j$bb1fcfabda0da4db9e60d29f$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Adjustable seating configurations$j$, 'en', $j$bb1fcfabda0da4db9e60d29f$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (8, v, $j$8e09a67e454b2cdbbad59bea$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Accessible storage compartments$j$, 'en', $j$8e09a67e454b2cdbbad59bea$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (9, v, $j$1935e6c2b3a85a912419d7b6$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Emergency evacuation equipment$j$, 'en', $j$1935e6c2b3a85a912419d7b6$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (10, v, $j$a2282b1953983f662283716f$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Communication aids for hearing impaired$j$, 'en', $j$a2282b1953983f662283716f$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (1, v, $j$da04f7c1eaa469c67185615d$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Brand$j$, $j$Toyota$j$, 'en', $j$da04f7c1eaa469c67185615d$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (2, v, $j$151ee45de5e36448103ebf97$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Model$j$, $j$Land Cruiser Accessible Edition$j$, 'en', $j$151ee45de5e36448103ebf97$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (3, v, $j$b063e8549c1e499eab88022a$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Year$j$, $j$2023$j$, 'en', $j$b063e8549c1e499eab88022a$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (4, v, $j$ccc7fd73bcd8ab7d9803cba2$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Colour$j$, $j$White$j$, 'en', $j$ccc7fd73bcd8ab7d9803cba2$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (5, v, $j$0f5cf347b68a99d7ed13feef$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Capacity$j$, $j$4 passengers plus wheelchair space and driver$j$, 'en', $j$0f5cf347b68a99d7ed13feef$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (6, v, $j$eda82234e6dc948c91ffbc78$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Engine$j$, $j$3.5L V6 Petrol Engine$j$, 'en', $j$eda82234e6dc948c91ffbc78$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (7, v, $j$3405cbbb6e942472d2c2f11d$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Transmission$j$, $j$Automatic Transmission$j$, 'en', $j$3405cbbb6e942472d2c2f11d$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (8, v, $j$ee1d6fa3ea662a3144608365$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel type$j$, $j$Petrol/Diesel options available$j$, 'en', $j$ee1d6fa3ea662a3144608365$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (9, v, $j$b3c82b789ee2e48ec52a88d8$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Drive type$j$, $j$4WD$j$, 'en', $j$b3c82b789ee2e48ec52a88d8$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (10, v, $j$e0b458653196fb3f3f31a784$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Luggage$j$, $j$Accessible storage with easy reach compartments$j$, 'en', $j$e0b458653196fb3f3f31a784$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (11, v, $j$c6ebc4ce9ca755e28e58bcbb$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel efficiency$j$, $j$Approximately 13L/100km$j$, 'en', $j$c6ebc4ce9ca755e28e58bcbb$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (12, v, $j$f79218ca75a501a937f4130b$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Seats$j$, $j$5$j$, 'en', $j$f79218ca75a501a937f4130b$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (13, v, $j$c565d7e3a5a5861600fdbc28$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Doors$j$, $j$5$j$, 'en', $j$c565d7e3a5a5861600fdbc28$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (1, v, $j$14f5063587a0e7bc35c3b31d$j$, 30000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Vehicle hire$j$, $j$day$j$, 'en', $j$14f5063587a0e7bc35c3b31d$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (2, v, $j$26cb39201de26b05542f1107$j$, 6000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Trained Caregiver Assistant$j$, $j$day$j$, 'en', $j$26cb39201de26b05542f1107$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (3, v, $j$71434b00773d205405032897$j$, 8000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Sign Language Guide$j$, $j$day$j$, 'en', $j$71434b00773d205405032897$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (4, v, $j$52e2e67acc0f59bc22c5579f$j$, 7500); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Accessibility-Focused Route Planning$j$, $j$one$j$, 'en', $j$52e2e67acc0f59bc22c5579f$j$);
  END IF;
END $do$;
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = $j$family-safari-minivan$j$) THEN
    INSERT INTO vehicles (slug, generate_slug, published, sample, type, seats, hero_image_id, accessible)
      VALUES ($j$family-safari-minivan$j$, false, true, false, $j$safari-van$j$, 7, (SELECT id FROM media WHERE url = $j$/2424ad9a-143e-4d19-a86e-3082e845c6ea.jpg$j$ ORDER BY id LIMIT 1), false) RETURNING id INTO v;
    INSERT INTO vehicles_locales (name, summary, description, _locale, _parent_id) VALUES ($j$Family Safari Minivan with Pop-up Roof$j$, $j$Travel in spacious comfort with our family safari minivan, the ideal group vehicle rental for exploring East Africa$j$, $j$Travel in spacious comfort with our family safari minivan, the ideal group vehicle rental for exploring East Africa. Perfect for family adventures or small group tours, this safari minibus features a pop-up roof for exceptional game viewing and ample interior space for everyone. With modern amenities, excellent fuel efficiency, and versatile seating configurations, our minivan hire provides the perfect balance of practicality and comfort for discovering Kenya's coast, Tanzania's northern circuit, Rwanda's cultural sites, and Uganda's natural wonders.

Ideal for: Family safaris with children, small group tours, budget-conscious travelers, educational trips, and comfortable road trips across East Africa's diverse destinations$j$, 'en', v);
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (1, v, $j$41a844600c7dfa73b08d3934$j$, (SELECT id FROM media WHERE url = $j$/6aa2209d-03d4-4345-bb36-c0d0dacad380.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (2, v, $j$23d2cf660fbaab91218bf8ad$j$, (SELECT id FROM media WHERE url = $j$/79bf4c9c-22d8-4bdd-bef6-76a88e0628f3.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (3, v, $j$82f62cfe2f42075cbdf7755e$j$, (SELECT id FROM media WHERE url = $j$/18c27b2c-2140-471c-a1cf-1b58df255c0c.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (4, v, $j$eaa94ca4ca05bb3d6a76279e$j$, (SELECT id FROM media WHERE url = $j$/b7e62c35-9f1e-4140-ab4a-fcfe18e7eea1.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (5, v, $j$d8e4ffd3830605923f7760d9$j$, (SELECT id FROM media WHERE url = $j$/2047d157-e31a-4f9e-8771-afd37abe204a.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (6, v, $j$4b830812573f73ceda02284e$j$, (SELECT id FROM media WHERE url = $j$/van-storage-capacity-showcase.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_gallery (_order, _parent_id, id, image_id) VALUES (7, v, $j$c8b0ae4de153a998b5176ad4$j$, (SELECT id FROM media WHERE url = $j$/minivan-road-trip-scene.jpg$j$ ORDER BY id LIMIT 1));
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (1, v, $j$0858c755a3d9d28cf8d2b0f3$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Pop-up roof with 360-degree game viewing platform$j$, 'en', $j$0858c755a3d9d28cf8d2b0f3$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (2, v, $j$0eea4c4e4ca3c290dde847b2$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Dual-zone air conditioning throughout cabin$j$, 'en', $j$0eea4c4e4ca3c290dde847b2$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (3, v, $j$4b3b7b501b052b671241b7e6$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Multiple USB charging ports for all rows$j$, 'en', $j$4b3b7b501b052b671241b7e6$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (4, v, $j$eae0a40c82f847df74b860f4$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Comfortable reclining seats with ample legroom$j$, 'en', $j$eae0a40c82f847df74b860f4$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (5, v, $j$dfd91ae630ca55d21f923716$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Large panoramic windows for optimal viewing$j$, 'en', $j$dfd91ae630ca55d21f923716$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (6, v, $j$70adc01d7cdcbdc9f116603e$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Entertainment system with screens and connectivity$j$, 'en', $j$70adc01d7cdcbdc9f116603e$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (7, v, $j$46a4692214aed67e449674c4$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Rear storage compartment with easy access$j$, 'en', $j$46a4692214aed67e449674c4$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (8, v, $j$0a484d0e34decbd76389857a$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Child seat anchor points throughout$j$, 'en', $j$0a484d0e34decbd76389857a$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (9, v, $j$4750551d4a8d4e0f4a48e1d4$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Sunroof for additional light and ventilation$j$, 'en', $j$4750551d4a8d4e0f4a48e1d4$j$);
    INSERT INTO vehicles_features (_order, _parent_id, id) VALUES (10, v, $j$cd0a5ab9e86a37cb4ef10ed6$j$); INSERT INTO vehicles_features_locales (text, _locale, _parent_id) VALUES ($j$Privacy glass for enhanced comfort$j$, 'en', $j$cd0a5ab9e86a37cb4ef10ed6$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (1, v, $j$da3c423d9e6e437a9ce817d9$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Brand$j$, $j$Toyota$j$, 'en', $j$da3c423d9e6e437a9ce817d9$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (2, v, $j$20cb3f9b8671cd186be4be94$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Model$j$, $j$Hiace Safari Edition$j$, 'en', $j$20cb3f9b8671cd186be4be94$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (3, v, $j$f4e697a519334b07f32a997e$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Year$j$, $j$2023$j$, 'en', $j$f4e697a519334b07f32a997e$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (4, v, $j$26d42b2fc7b5c88ebdb495c3$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Colour$j$, $j$White$j$, 'en', $j$26d42b2fc7b5c88ebdb495c3$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (5, v, $j$d50625e2c64cd8ef0798625a$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Capacity$j$, $j$7 passengers plus driver with configurable seating$j$, 'en', $j$d50625e2c64cd8ef0798625a$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (6, v, $j$85bb26926f1144c22262d0cb$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Engine$j$, $j$2.4L 4-Cylinder Turbo Diesel$j$, 'en', $j$85bb26926f1144c22262d0cb$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (7, v, $j$081ae2e6f82252b8ab69a44d$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Transmission$j$, $j$6-Speed Manual Transmission$j$, 'en', $j$081ae2e6f82252b8ab69a44d$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (8, v, $j$8e429a9d46bede383dd2251b$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel type$j$, $j$Diesel$j$, 'en', $j$8e429a9d46bede383dd2251b$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (9, v, $j$d51a8575acce5ad317514593$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Drive type$j$, $j$2WD (RWD)$j$, 'en', $j$d51a8575acce5ad317514593$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (10, v, $j$473bccee7d3bfa24947ba065$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Luggage$j$, $j$Spacious rear storage compartment with roof rack option$j$, 'en', $j$473bccee7d3bfa24947ba065$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (11, v, $j$68b90cf1dca2d5950402c407$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Fuel efficiency$j$, $j$Excellent 12L/100km making it economical for long trips$j$, 'en', $j$68b90cf1dca2d5950402c407$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (12, v, $j$b1d326e25c9b59584dd2397e$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Seats$j$, $j$7$j$, 'en', $j$b1d326e25c9b59584dd2397e$j$);
    INSERT INTO vehicles_specs (_order, _parent_id, id) VALUES (13, v, $j$9a5db1213c3ec91e184ee94b$j$); INSERT INTO vehicles_specs_locales (label, value, _locale, _parent_id) VALUES ($j$Doors$j$, $j$5$j$, 'en', $j$9a5db1213c3ec91e184ee94b$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (1, v, $j$5d0fc4484db00fa829b1bb9f$j$, 20000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Vehicle hire$j$, $j$day$j$, 'en', $j$5d0fc4484db00fa829b1bb9f$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (2, v, $j$c629d4c379d3b9c4533950fb$j$, 1000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Child Safety Seats$j$, $j$day$j$, 'en', $j$c629d4c379d3b9c4533950fb$j$);
    INSERT INTO vehicles_rates (_order, _parent_id, id, price_cents) VALUES (3, v, $j$7ac98b95b3a6c77c2b7f1553$j$, 3000); INSERT INTO vehicles_rates_locales (label, unit, _locale, _parent_id) VALUES ($j$Additional Driver$j$, $j$day$j$, 'en', $j$7ac98b95b3a6c77c2b7f1553$j$);
  END IF;
END $do$;

-- 5. Tours ---------------------------------------------------------------------------------------------
-- Prices: your files hold one price per tour, so every season and group size starts at that price per person.
-- Refine them in the admin (Tours > Pricing) when you have prices by season and group size.
-- tours.ts: masai-mara-luxury-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$masai-mara-luxury-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$masai-mara-luxury-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      3, (SELECT id FROM media WHERE url = $j$/masai-mara-migration.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Masai Mara Luxury Safari$j$, $j$Experience the wildlife of Masai Mara with luxury accommodations and expert guides. Includes game drives and meals.$j$, NULL, $j$Masai Mara Luxury Safari$j$, $j$Book your Masai Mara Luxury Safari with Jae Travel. Enjoy game drives, luxury lodges, and expert guides in Kenya's most iconic park.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 350000, 350000, 350000, 350000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$aa4b95fac9e043dcdc3ef7e2$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$aa4b95fac9e043dcdc3ef7e2$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$3b7452c967875a09a60c1382$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning and evening game drives$j$, $j$Morning and evening game drives.$j$, 'en', $j$3b7452c967875a09a60c1382$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$aa71c5ec9df83040323e7dbb$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Optional hot air balloon ride and departure$j$, $j$Optional hot air balloon ride and departure.$j$, 'en', $j$aa71c5ec9df83040323e7dbb$j$);
  END IF;
END $do$;
-- tours.ts: amboseli-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$amboseli-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$amboseli-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      3, (SELECT id FROM media WHERE url = $j$/Amboseli-National-Park-Elephantsssss.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Amboseli Safari Adventure$j$, $j$Explore Amboseli National Park with guided game drives and spectacular views of Mount Kilimanjaro.$j$, NULL, $j$Amboseli Safari Adventure$j$, $j$Discover Amboseli Safari with breathtaking views of Mount Kilimanjaro. Guided game drives and luxury stays included.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 280000, 280000, 280000, 280000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$c654ed9ee60b6f05a4bf1df7$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$c654ed9ee60b6f05a4bf1df7$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$f3bde19679f6b1ffe0cd235b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning and evening game drives$j$, $j$Morning and evening game drives.$j$, 'en', $j$f3bde19679f6b1ffe0cd235b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$faa011d3a74fbc79639bbf67$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$faa011d3a74fbc79639bbf67$j$);
  END IF;
END $do$;
-- tours.ts: serengeti-migration-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$serengeti-migration-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$serengeti-migration-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$migration$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      4, (SELECT id FROM media WHERE url = $j$/Serengeti-National-Park-Africa-Kenya-Safaris2.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Serengeti Migration Safari$j$, $j$Witness the Great Migration in Serengeti with guided tours and comfortable lodges. Includes daily game drives and meals.$j$, NULL, $j$Serengeti Migration Safari$j$, $j$Experience the Great Migration in Serengeti with expert guides, luxury lodges, and unforgettable wildlife encounters.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 420000, 420000, 420000, 420000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$e6dfe13f392fa804780d1bff$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival in Serengeti$j$, $j$Arrival in Serengeti.$j$, 'en', $j$e6dfe13f392fa804780d1bff$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$ee86aea867e2380342b0d236$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives tracking the migration$j$, $j$Game drives tracking the migration.$j$, 'en', $j$ee86aea867e2380342b0d236$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$c07257bfb81bec48d719a4b0$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives tracking the migration (continued)$j$, $j$Continues from the previous day. Game drives tracking the migration.$j$, 'en', $j$c07257bfb81bec48d719a4b0$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$12bceeda3cbaf32fb9bb9c32$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cultural visit and departure$j$, $j$Cultural visit and departure.$j$, 'en', $j$12bceeda3cbaf32fb9bb9c32$j$);
  END IF;
END $do$;
-- tours.ts: ngorongoro-crater-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$ngorongoro-crater-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$ngorongoro-crater-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      3, (SELECT id FROM media WHERE url = $j$/Ngorongoro-Crater.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Ngorongoro Crater Safari$j$, $j$Explore the Ngorongoro Crater with guided game drives and luxury accommodation. Ideal for families and photographers.$j$, NULL, $j$Ngorongoro Crater Safari$j$, $j$Book your Ngorongoro Crater Safari with Jae Travel. A perfect adventure for families, photographers, and nature lovers.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 280000, 280000, 280000, 280000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$801429d779143b0cd9b06b2b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$801429d779143b0cd9b06b2b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$0b33f5e62ed5b39946d1c55d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full-day game drive in the crater$j$, $j$Full-day game drive in the crater.$j$, 'en', $j$0b33f5e62ed5b39946d1c55d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$34a3240be374651d73ed2291$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$34a3240be374651d73ed2291$j$);
  END IF;
END $do$;
-- tours.ts: bwindi-gorilla-trek
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$bwindi-gorilla-trek$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$bwindi-gorilla-trek$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      3, (SELECT id FROM media WHERE url = $j$/bwindi-forest-uganda-gorilla-safaris.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Bwindi Gorilla Trekking$j$, $j$Trek the dense forests of Bwindi to see mountain gorillas up close with expert guides. Includes park fees and accommodations.$j$, NULL, $j$Bwindi Gorilla Trekking$j$, $j$Embark on a Bwindi Gorilla Trekking safari. See mountain gorillas up close and explore Uganda's lush forests.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 320000, 320000, 320000, 320000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$35d4bee99b418273d325c2a5$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival at lodge$j$, $j$Arrival at lodge.$j$, 'en', $j$35d4bee99b418273d325c2a5$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$42dc32e67ee8ee425d27329b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Gorilla trekking experience$j$, $j$Gorilla trekking experience.$j$, 'en', $j$42dc32e67ee8ee425d27329b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$c36689689da60d2090c7649c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cultural visit and departure$j$, $j$Cultural visit and departure.$j$, 'en', $j$c36689689da60d2090c7649c$j$);
  END IF;
END $do$;
-- tours.ts: volcanoes-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$volcanoes-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$volcanoes-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      3, (SELECT id FROM media WHERE url = $j$/Volcanoes-National-Park-Rwanda-Natural-World-Kenya-Safaris.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Rwanda Gorilla Safari$j$, $j$Explore Volcanoes National Park in Rwanda to trek gorillas and experience local culture.$j$, NULL, $j$Rwanda Gorilla Safari$j$, $j$Book your Rwanda Gorilla Safari in Volcanoes National Park. Trek gorillas, enjoy cultural tours, and luxury accommodations.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 380000, 380000, 380000, 380000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$c5b69d81781ade5cf8dca7de$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$c5b69d81781ade5cf8dca7de$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$861a79936b46ff45879eac30$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Gorilla trekking$j$, $j$Gorilla trekking.$j$, 'en', $j$861a79936b46ff45879eac30$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$7a68f6ed2940299328e12c88$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cultural tour and departure$j$, $j$Cultural tour and departure.$j$, 'en', $j$7a68f6ed2940299328e12c88$j$);
  END IF;
END $do$;
-- tours.ts: masai-mara-safari-adventure
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$masai-mara-safari-adventure$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$masai-mara-safari-adventure$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      5, (SELECT id FROM media WHERE url = $j$/magestic-maasai-serengeti.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Masai Mara Safari Adventure$j$, $j$Experience the great migration and witness the Big Five in Kenya's most iconic national reserve.$j$, NULL, $j$Masai Mara Safari Adventure - 5 Days$j$, $j$Experience the great migration and witness the Big Five in Masai Mara. 5-day safari with expert guides, luxury lodges, and unforgettable wildlife encounters.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 120000, 120000, 120000, 120000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$3b13adfaa8ad0cb3f10a66c0$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$3b13adfaa8ad0cb3f10a66c0$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$92b60001e3bdc36281784a4d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning and evening game drives$j$, $j$Morning and evening game drives.$j$, 'en', $j$92b60001e3bdc36281784a4d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$856959045865f44540bcbe83$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning and evening game drives (continued)$j$, $j$Continues from the previous day. Morning and evening game drives.$j$, 'en', $j$856959045865f44540bcbe83$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$8293f1ca8c6aeca8b80d2abb$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning and evening game drives (continued)$j$, $j$Continues from the previous day. Morning and evening game drives.$j$, 'en', $j$8293f1ca8c6aeca8b80d2abb$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$cbca8ca419ffb64264d238b2$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$cbca8ca419ffb64264d238b2$j$);
  END IF;
END $do$;
-- tours.ts: amboseli-elephant-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$amboseli-elephant-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$amboseli-elephant-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      4, (SELECT id FROM media WHERE url = $j$/amboseli-elephants-00007.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Amboseli Elephant Safari$j$, $j$Get close to elephants with Mount Kilimanjaro backdrop in Amboseli National Park.$j$, NULL, $j$Amboseli Elephant Safari - 4 Days$j$, $j$Get close to elephants with Mount Kilimanjaro backdrop. 4-day Amboseli safari with spectacular views and abundant wildlife.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 98000, 98000, 98000, 98000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$a65ed9911d7501c3181a5d66$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$a65ed9911d7501c3181a5d66$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$12686f452f8fa7d03ed73c4b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and elephant viewing$j$, $j$Game drives and elephant viewing.$j$, 'en', $j$12686f452f8fa7d03ed73c4b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$3b0f60379f3757d4b046e2df$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and elephant viewing (continued)$j$, $j$Continues from the previous day. Game drives and elephant viewing.$j$, 'en', $j$3b0f60379f3757d4b046e2df$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$748ef4c192a26fe0741770e2$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$748ef4c192a26fe0741770e2$j$);
  END IF;
END $do$;
-- tours.ts: samburu-game-reserve
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$samburu-game-reserve$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$samburu-game-reserve$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      3, (SELECT id FROM media WHERE url = $j$/Samburu_National_Reserve%2C_Kenya-26December2012.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Samburu Game Reserve$j$, $j$Discover unique wildlife in the northern frontier.$j$, NULL, $j$Samburu Game Reserve Safari - 3 Days$j$, $j$Discover unique wildlife in the northern frontier of Kenya at Samburu Game Reserve. See rare species like Grevy's zebra and reticulated giraffe.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 75000, 75000, 75000, 75000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$fe76573a7bb5836a7f4f556e$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$fe76573a7bb5836a7f4f556e$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$2a6eb9745209d36b5bb4eb40$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full-day game drives$j$, $j$Full-day game drives.$j$, 'en', $j$2a6eb9745209d36b5bb4eb40$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$16e3876f637e1057384817ff$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$16e3876f637e1057384817ff$j$);
  END IF;
END $do$;
-- tours.ts: lake-nakuru-flamingo-spectacle
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$lake-nakuru-flamingo-spectacle$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$lake-nakuru-flamingo-spectacle$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      2, (SELECT id FROM media WHERE url = $j$/lake-nakuru-flamingos-in-red-sunset-590x390.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Lake Nakuru Flamingo Tour$j$, $j$Witness thousands of flamingos in their natural habitat.$j$, NULL, $j$Lake Nakuru Flamingo Tour - 2 Days$j$, $j$Witness thousands of flamingos in their natural habitat at Lake Nakuru. Perfect for bird watchers and photographers.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 45000, 45000, 45000, 45000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$3824393816c96384e59cd73e$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and afternoon game drive$j$, $j$Arrival and afternoon game drive.$j$, 'en', $j$3824393816c96384e59cd73e$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$cd2d9499fad1597f04ab5f21$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning bird watching and departure$j$, $j$Morning bird watching and departure.$j$, 'en', $j$cd2d9499fad1597f04ab5f21$j$);
  END IF;
END $do$;
-- tours.ts: tsavo-east-west-adventure
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$tsavo-east-west-adventure$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$tsavo-east-west-adventure$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      6, (SELECT id FROM media WHERE url = $j$/tsavo-west-national-park-chyulu-gate.jpg.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Tsavo East & West Safari$j$, $j$Explore Kenya's largest national park.$j$, NULL, $j$Tsavo East & West Safari - 6 Days$j$, $j$Explore Kenya's largest national park with our Tsavo East & West Safari. See red elephants, diverse landscapes, and abundant wildlife.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 135000, 135000, 135000, 135000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$b44be81181989c333a0cef87$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival at Tsavo East$j$, $j$Arrival at Tsavo East.$j$, 'en', $j$b44be81181989c333a0cef87$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$fbe186e77f5999a15a7e8e3b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in Tsavo East$j$, $j$Game drives in Tsavo East.$j$, 'en', $j$fbe186e77f5999a15a7e8e3b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$d8f9e93b4062e47e7c7543fe$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in Tsavo East (continued)$j$, $j$Continues from the previous day. Game drives in Tsavo East.$j$, 'en', $j$d8f9e93b4062e47e7c7543fe$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$ef66d0f4c5d55a3732b51924$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Transfer to Tsavo West and game drives$j$, $j$Transfer to Tsavo West and game drives.$j$, 'en', $j$ef66d0f4c5d55a3732b51924$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$388f4ba235f1e4ee84e98490$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Transfer to Tsavo West and game drives (continued)$j$, $j$Continues from the previous day. Transfer to Tsavo West and game drives.$j$, 'en', $j$388f4ba235f1e4ee84e98490$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$927b2dbde5bf25205b88a236$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$927b2dbde5bf25205b88a236$j$);
  END IF;
END $do$;
-- tours.ts: mombasa-coastal-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$mombasa-coastal-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$mombasa-coastal-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      7, (SELECT id FROM media WHERE url = $j$/Mombasa-beach-2-1960x800.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Mombasa Beach & Safari$j$, $j$Combine safari adventures with beach relaxation.$j$, NULL, $j$Mombasa Beach & Safari - 7 Days$j$, $j$Combine safari adventures with beach relaxation on our Mombasa Beach & Safari package. Perfect blend of wildlife and coastal paradise.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 160000, 160000, 160000, 160000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$7dd50ab44740bb97e53d6097$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Safari in Tsavo East$j$, $j$Safari in Tsavo East.$j$, 'en', $j$7dd50ab44740bb97e53d6097$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$48212d1f182a77d9f442e711$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Safari in Tsavo East (continued)$j$, $j$Continues from the previous day. Safari in Tsavo East.$j$, 'en', $j$48212d1f182a77d9f442e711$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$497fd13c0a5d267512b9b7fc$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Safari in Tsavo East (continued)$j$, $j$Continues from the previous day. Safari in Tsavo East.$j$, 'en', $j$497fd13c0a5d267512b9b7fc$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$28cc2845e3c0dde64c9dc745$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation in Mombasa with optional water sports and cultural tours$j$, $j$Beach relaxation in Mombasa with optional water sports and cultural tours.$j$, 'en', $j$28cc2845e3c0dde64c9dc745$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$b5aee29cd4f7f311aecb6403$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation in Mombasa with optional water sports and cultural tours (continued)$j$, $j$Continues from the previous day. Beach relaxation in Mombasa with optional water sports and cultural tours.$j$, 'en', $j$b5aee29cd4f7f311aecb6403$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$7a8df682dc20ec2efdc849a5$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation in Mombasa with optional water sports and cultural tours (continued)$j$, $j$Continues from the previous day. Beach relaxation in Mombasa with optional water sports and cultural tours.$j$, 'en', $j$7a8df682dc20ec2efdc849a5$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$3dc9150a70f33d8e5252e9ea$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation in Mombasa with optional water sports and cultural tours (continued)$j$, $j$Continues from the previous day. Beach relaxation in Mombasa with optional water sports and cultural tours.$j$, 'en', $j$3dc9150a70f33d8e5252e9ea$j$);
  END IF;
END $do$;
-- tours.ts: mount-kenya-climbing-expedition
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$mount-kenya-climbing-expedition$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$mount-kenya-climbing-expedition$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      5, (SELECT id FROM media WHERE url = $j$/mt-kenya.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Mount Kenya Climbing$j$, $j$Challenge yourself with Africa's second highest peak.$j$, NULL, $j$Mount Kenya Climbing Expedition - 5 Days$j$, $j$Challenge yourself with Africa's second highest peak on our Mount Kenya climbing expedition. Reach Point Lenana with expert guides.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 110000, 110000, 110000, 110000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$f726894a644688ca9704fdc6$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and briefing$j$, $j$Arrival and briefing.$j$, 'en', $j$f726894a644688ca9704fdc6$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$0f2063a0b7e4d124c0174f38$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing expedition to Point Lenana$j$, $j$Climbing expedition to Point Lenana.$j$, 'en', $j$0f2063a0b7e4d124c0174f38$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$a1d6b9320f235daba5411fbc$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing expedition to Point Lenana (continued)$j$, $j$Continues from the previous day. Climbing expedition to Point Lenana.$j$, 'en', $j$a1d6b9320f235daba5411fbc$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$503503cee77ad58b83258d60$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing expedition to Point Lenana (continued)$j$, $j$Continues from the previous day. Climbing expedition to Point Lenana.$j$, 'en', $j$503503cee77ad58b83258d60$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$c3f10828846fe749472993e5$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Descent and departure$j$, $j$Descent and departure.$j$, 'en', $j$c3f10828846fe749472993e5$j$);
  END IF;
END $do$;
-- tours.ts: laikipia-conservancy
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$laikipia-conservancy$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$laikipia-conservancy$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      4, (SELECT id FROM media WHERE url = $j$/laikipia-kenya-photography-safari.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Laikipia Conservancy$j$, $j$Experience conservation in action.$j$, NULL, $j$Laikipia Conservancy Experience - 4 Days$j$, $j$Experience conservation in action at Laikipia Conservancy. Engage with wildlife protection efforts and community development.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 125000, 125000, 125000, 125000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$33a9492abf8b75c780fd792d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and orientation$j$, $j$Arrival and orientation.$j$, 'en', $j$33a9492abf8b75c780fd792d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$cda49f4948d311cef5dbf0b3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives, conservation activities, and community visits$j$, $j$Game drives, conservation activities, and community visits.$j$, 'en', $j$cda49f4948d311cef5dbf0b3$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$a9e1a7d7bfbe47ba1c8388be$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives, conservation activities, and community visits (continued)$j$, $j$Continues from the previous day. Game drives, conservation activities, and community visits.$j$, 'en', $j$a9e1a7d7bfbe47ba1c8388be$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$df2cde07476d73a22e3692d3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$df2cde07476d73a22e3692d3$j$);
  END IF;
END $do$;
-- tours.ts: hell-gate-lake-naivasha-adventure
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$hell-gate-lake-naivasha-adventure$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$hell-gate-lake-naivasha-adventure$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      2, (SELECT id FROM media WHERE url = $j$/Hells-Gate-National-Park.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Hell's Gate Adventure$j$, $j$Bike and hike through dramatic landscapes.$j$, NULL, $j$Hell's Gate Adventure Tour - 2 Days$j$, $j$Bike and hike through dramatic landscapes at Hell's Gate National Park. Unique safari experience with cycling and gorge exploration.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 38000, 38000, 38000, 38000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$0641493783a9aca25529b4d5$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Biking in Hell's Gate and gorge hiking$j$, $j$Biking in Hell's Gate and gorge hiking.$j$, 'en', $j$0641493783a9aca25529b4d5$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$e7728cea973c40edfc90a2ee$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Boat safari on Lake Naivasha and departure$j$, $j$Boat safari on Lake Naivasha and departure.$j$, 'en', $j$e7728cea973c40edfc90a2ee$j$);
  END IF;
END $do$;
-- tours.ts: maasai-cultural-experience
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$maasai-cultural-experience$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$maasai-cultural-experience$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      3, (SELECT id FROM media WHERE url = $j$/magestic-maasai-serengeti.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Maasai Cultural Experience$j$, $j$Immerse yourself in Maasai culture.$j$, NULL, $j$Maasai Cultural Experience - 3 Days$j$, $j$Immerse yourself in Maasai culture with our authentic cultural experience. Learn traditions, participate in ceremonies, and stay in a Maasai village.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 65000, 65000, 65000, 65000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$a7db860915ba9b6b62a8d890$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and welcome ceremony$j$, $j$Arrival and welcome ceremony.$j$, 'en', $j$a7db860915ba9b6b62a8d890$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$d15e6396efa11a093a501cc3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cultural activities, traditional dances, and village tour$j$, $j$Cultural activities, traditional dances, and village tour.$j$, 'en', $j$d15e6396efa11a093a501cc3$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$4608c527476cb631e2b0aaec$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$4608c527476cb631e2b0aaec$j$);
  END IF;
END $do$;
-- tours.ts: aberdare-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$aberdare-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$aberdare-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      3, (SELECT id FROM media WHERE url = $j$/Aberdare.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Aberdare National Park$j$, $j$Mountain forest safari experience.$j$, NULL, $j$Aberdare National Park Safari - 3 Days$j$, $j$Experience a mountain forest safari in Aberdare National Park. See rare bongo antelopes, elephants, and stunning waterfalls.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 72000, 72000, 72000, 72000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$f45fdcb9e5c089ac48b1b1f4$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$f45fdcb9e5c089ac48b1b1f4$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$b77f532ed784e1586bb3e73d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Forest walks and game viewing$j$, $j$Forest walks and game viewing.$j$, 'en', $j$b77f532ed784e1586bb3e73d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$f87a63c304c9f75efa3080e3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$f87a63c304c9f75efa3080e3$j$);
  END IF;
END $do$;
-- tours.ts: diani-beach-safari-combo
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$diani-beach-safari-combo$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$diani-beach-safari-combo$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      8, (SELECT id FROM media WHERE url = $j$/Kenia-Mombasa-Diani-Beach-Leopard-Beach-Resort-strand-long-beach-LBR_1.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Diani Beach Safari Combo$j$, $j$Ultimate Kenya safari and beach experience.$j$, NULL, $j$Diani Beach Safari Combo - 8 Days$j$, $j$Experience the ultimate Kenya safari and beach experience at Diani Beach. Perfect combination of wildlife adventures and tropical paradise.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 180000, 180000, 180000, 180000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$35d5a2a0a40dd08e7b4a9de7$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Safari in Tsavo West$j$, $j$Safari in Tsavo West.$j$, 'en', $j$35d5a2a0a40dd08e7b4a9de7$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$755a2c95a9f6b315d4bb1735$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Safari in Tsavo West (continued)$j$, $j$Continues from the previous day. Safari in Tsavo West.$j$, 'en', $j$755a2c95a9f6b315d4bb1735$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$7b6ebc818e0c369bd53e70ee$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Safari in Tsavo West (continued)$j$, $j$Continues from the previous day. Safari in Tsavo West.$j$, 'en', $j$7b6ebc818e0c369bd53e70ee$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$eddedcde8d4a20d8aac1f705$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Safari in Tsavo West (continued)$j$, $j$Continues from the previous day. Safari in Tsavo West.$j$, 'en', $j$eddedcde8d4a20d8aac1f705$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$ef53f5d653196e2ce3387646$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours$j$, $j$Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours.$j$, 'en', $j$ef53f5d653196e2ce3387646$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$4892e89f1d808ecbf34ba670$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours (continued)$j$, $j$Continues from the previous day. Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours.$j$, 'en', $j$4892e89f1d808ecbf34ba670$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$e7bfbf7a7c3ca265942f1539$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours (continued)$j$, $j$Continues from the previous day. Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours.$j$, 'en', $j$e7bfbf7a7c3ca265942f1539$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (8, v, $j$f8ee75bfc16b9009cf30af1c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours (continued)$j$, $j$Continues from the previous day. Beach relaxation at Diani Beach with snorkeling, diving, and cultural tours.$j$, 'en', $j$f8ee75bfc16b9009cf30af1c$j$);
  END IF;
END $do$;
-- tours.ts: serengeti-wildlife-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$serengeti-wildlife-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$serengeti-wildlife-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      7, (SELECT id FROM media WHERE url = $j$/serengeti-day-trip.jpeg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Serengeti Wildlife Safari$j$, $j$Explore the endless plains of Serengeti and witness incredible wildlife diversity.$j$, NULL, $j$Serengeti Wildlife Safari - 7 Days$j$, $j$Explore the endless plains of Serengeti on a 7-day wildlife safari. Experience incredible biodiversity and stunning landscapes.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 180000, 180000, 180000, 180000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$97e529ee2fd757241de7842b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival in Arusha$j$, $j$Arrival in Arusha.$j$, 'en', $j$97e529ee2fd757241de7842b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$a434284f51117d2a3b98d5ab$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti game drives tracking wildlife$j$, $j$Serengeti game drives tracking wildlife.$j$, 'en', $j$a434284f51117d2a3b98d5ab$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$2f55f5c8f460b1476370f1da$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti game drives tracking wildlife (continued)$j$, $j$Continues from the previous day. Serengeti game drives tracking wildlife.$j$, 'en', $j$2f55f5c8f460b1476370f1da$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$7ebed5c991a0d15a56952a9b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti game drives tracking wildlife (continued)$j$, $j$Continues from the previous day. Serengeti game drives tracking wildlife.$j$, 'en', $j$7ebed5c991a0d15a56952a9b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$40c611560332c07e16bc135a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti game drives tracking wildlife (continued)$j$, $j$Continues from the previous day. Serengeti game drives tracking wildlife.$j$, 'en', $j$40c611560332c07e16bc135a$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$44df372cb7d07d40e1c21a30$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti game drives tracking wildlife (continued)$j$, $j$Continues from the previous day. Serengeti game drives tracking wildlife.$j$, 'en', $j$44df372cb7d07d40e1c21a30$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$5178e2e13c7480b1fee77d3d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure via Arusha$j$, $j$Departure via Arusha.$j$, 'en', $j$5178e2e13c7480b1fee77d3d$j$);
  END IF;
END $do$;
-- tours.ts: ngorongoro-crater-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$ngorongoro-crater-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$ngorongoro-crater-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      3, (SELECT id FROM media WHERE url = $j$/Ngorongoro-Crater.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Ngorongoro Crater Tour$j$, $j$Visit the world's largest intact caldera.$j$, NULL, $j$Ngorongoro Crater Tour - 3 Days$j$, $j$Visit the world's largest intact caldera at Ngorongoro Crater. Witness dense wildlife populations in this natural wonder.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 95000, 95000, 95000, 95000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$fe3e3b85d9e1fc49a3a92f46$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$fe3e3b85d9e1fc49a3a92f46$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$95d933c74084450f403de6c3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full-day crater tour$j$, $j$Full-day crater tour.$j$, 'en', $j$95d933c74084450f403de6c3$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$91f454e3cec2e9ff5a8f7175$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$91f454e3cec2e9ff5a8f7175$j$);
  END IF;
END $do$;
-- tours.ts: kilimanjaro-climbing-expedition
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$kilimanjaro-climbing-expedition$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$kilimanjaro-climbing-expedition$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      9, (SELECT id FROM media WHERE url = $j$/kilimanjaro-moutain-climbing.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Kilimanjaro Climbing$j$, $j$Conquer Africa's highest peak.$j$, NULL, $j$Kilimanjaro Climbing Expedition - 9 Days$j$, $j$Conquer Africa's highest peak on our Mount Kilimanjaro climbing expedition. Reach Uhuru Peak with experienced guides.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 220000, 220000, 220000, 220000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$68e550480b6af5704795ff50$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and briefing$j$, $j$Arrival and briefing.$j$, 'en', $j$68e550480b6af5704795ff50$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$48ebe87c79b6e01c075ec057$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing via Machame Route$j$, $j$Climbing via Machame Route.$j$, 'en', $j$48ebe87c79b6e01c075ec057$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$0b1d7b48117d5dd2813415b2$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing via Machame Route (continued)$j$, $j$Continues from the previous day. Climbing via Machame Route.$j$, 'en', $j$0b1d7b48117d5dd2813415b2$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$8ce2ca7c395807af7a0fec49$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing via Machame Route (continued)$j$, $j$Continues from the previous day. Climbing via Machame Route.$j$, 'en', $j$8ce2ca7c395807af7a0fec49$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$7b9d2c43df14b2e5b5b134f5$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing via Machame Route (continued)$j$, $j$Continues from the previous day. Climbing via Machame Route.$j$, 'en', $j$7b9d2c43df14b2e5b5b134f5$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$5477bc1ea913532aee22135b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing via Machame Route (continued)$j$, $j$Continues from the previous day. Climbing via Machame Route.$j$, 'en', $j$5477bc1ea913532aee22135b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$dbf6c32091665880408f4f62$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Climbing via Machame Route (continued)$j$, $j$Continues from the previous day. Climbing via Machame Route.$j$, 'en', $j$dbf6c32091665880408f4f62$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (8, v, $j$393ab9f2c8b953e6a8c82e94$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Summit day and descent$j$, $j$Summit day and descent.$j$, 'en', $j$393ab9f2c8b953e6a8c82e94$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (9, v, $j$e5dd87a2b70e993aa21458af$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$e5dd87a2b70e993aa21458af$j$);
  END IF;
END $do$;
-- tours.ts: tarangire-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$tarangire-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$tarangire-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      4, (SELECT id FROM media WHERE url = $j$/boabab-tarangire-national-park.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Tarangire Elephant Safari$j$, $j$See large herds of elephants.$j$, NULL, $j$Tarangire Elephant Safari - 4 Days$j$, $j$See large herds of elephants in Tarangire National Park. Famous for its elephant population and ancient baobab trees.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 110000, 110000, 110000, 110000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$512b0d4c6714577e4e6c43a3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$512b0d4c6714577e4e6c43a3$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$ca488624cf5baf89b3f8a1e6$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives focusing on elephants$j$, $j$Game drives focusing on elephants.$j$, 'en', $j$ca488624cf5baf89b3f8a1e6$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$5559a0a11425191acba2342b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives focusing on elephants (continued)$j$, $j$Continues from the previous day. Game drives focusing on elephants.$j$, 'en', $j$5559a0a11425191acba2342b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$167dbbb42d5ca68b1b5e4f62$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$167dbbb42d5ca68b1b5e4f62$j$);
  END IF;
END $do$;
-- tours.ts: lake-manyara-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$lake-manyara-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$lake-manyara-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      2, (SELECT id FROM media WHERE url = $j$/Lake%20Manyara%20banner.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Lake Manyara Tree Climbing Lions$j$, $j$Witness unique tree-climbing lions.$j$, NULL, $j$Lake Manyara Tree Climbing Lions Safari - 2 Days$j$, $j$Witness unique tree-climbing lions in Lake Manyara National Park. Compact park with diverse ecosystems and abundant birdlife.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 58000, 58000, 58000, 58000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$594ddd16bde98cc61e57778d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and afternoon game drive$j$, $j$Arrival and afternoon game drive.$j$, 'en', $j$594ddd16bde98cc61e57778d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$2a2f0db32733bf412cfdfe4c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning game drive and departure$j$, $j$Morning game drive and departure.$j$, 'en', $j$2a2f0db32733bf412cfdfe4c$j$);
  END IF;
END $do$;
-- tours.ts: zanzibar-beach-holiday
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$zanzibar-beach-holiday$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$zanzibar-beach-holiday$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      5, (SELECT id FROM media WHERE url = $j$/zanzibar-stone-town-view-min-800x600.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Zanzibar Spice Island$j$, $j$Explore the spice island paradise.$j$, NULL, $j$Zanzibar Spice Island Holiday - 5 Days$j$, $j$Explore the spice island paradise of Zanzibar. White sand beaches, historic Stone Town, and aromatic spice plantations.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 130000, 130000, 130000, 130000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$2d4b6348c72bbce8d5a11e1c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and Stone Town tour$j$, $j$Arrival and Stone Town tour.$j$, 'en', $j$2d4b6348c72bbce8d5a11e1c$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$fbbff88133aadcb16a41986d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation, spice tours, and water sports$j$, $j$Beach relaxation, spice tours, and water sports.$j$, 'en', $j$fbbff88133aadcb16a41986d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$ba39b91cc62bd5769acd66e6$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation, spice tours, and water sports (continued)$j$, $j$Continues from the previous day. Beach relaxation, spice tours, and water sports.$j$, 'en', $j$ba39b91cc62bd5769acd66e6$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$af56715616bb7a82e747613f$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Beach relaxation, spice tours, and water sports (continued)$j$, $j$Continues from the previous day. Beach relaxation, spice tours, and water sports.$j$, 'en', $j$af56715616bb7a82e747613f$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$f436a63a2f0a1d5c34e8a4be$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$f436a63a2f0a1d5c34e8a4be$j$);
  END IF;
END $do$;
-- tours.ts: ruaha-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$ruaha-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$ruaha-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      6, (SELECT id FROM media WHERE url = $j$/ruaha-national-park-featured.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Ruaha National Park$j$, $j$Tanzania's largest national park.$j$, NULL, $j$Ruaha National Park Safari - 6 Days$j$, $j$Explore Tanzania's largest national park at Ruaha. Remote wilderness with large elephant populations and diverse predators.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 145000, 145000, 145000, 145000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$32d2656a55fca2e77a9d9657$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$32d2656a55fca2e77a9d9657$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$2c42262dd7c390a0148b77b5$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in Ruaha$j$, $j$Game drives in Ruaha.$j$, 'en', $j$2c42262dd7c390a0148b77b5$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$a163cd7405915357b0b921ee$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in Ruaha (continued)$j$, $j$Continues from the previous day. Game drives in Ruaha.$j$, 'en', $j$a163cd7405915357b0b921ee$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$eeddf2e4f1336c839d26232a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in Ruaha (continued)$j$, $j$Continues from the previous day. Game drives in Ruaha.$j$, 'en', $j$eeddf2e4f1336c839d26232a$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$66c26112cdba313878e53591$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in Ruaha (continued)$j$, $j$Continues from the previous day. Game drives in Ruaha.$j$, 'en', $j$66c26112cdba313878e53591$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$10eab96181327d535f9ca9e9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$10eab96181327d535f9ca9e9$j$);
  END IF;
END $do$;
-- tours.ts: selous-game-reserve-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$selous-game-reserve-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$selous-game-reserve-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      5, (SELECT id FROM media WHERE url = $j$/SELOUS-GAME-RESERVE.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Selous Game Reserve$j$, $j$Africa's largest game reserve.$j$, NULL, $j$Selous Game Reserve Safari - 5 Days$j$, $j$Explore Africa's largest game reserve at Selous. Boat safaris on the Rufiji River and walking safaris available.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 135000, 135000, 135000, 135000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$d42a518966df6b2e001029f7$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$d42a518966df6b2e001029f7$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$fa82a7cd37d28dd12c269478$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safaris$j$, $j$Game drives and boat safaris.$j$, 'en', $j$fa82a7cd37d28dd12c269478$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$a1f720e14c7281bf81c9b928$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safaris (continued)$j$, $j$Continues from the previous day. Game drives and boat safaris.$j$, 'en', $j$a1f720e14c7281bf81c9b928$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$a1a478bb4d564dcc041b2a28$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safaris (continued)$j$, $j$Continues from the previous day. Game drives and boat safaris.$j$, 'en', $j$a1a478bb4d564dcc041b2a28$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$0ad50385eaf5c13336e3cf81$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$0ad50385eaf5c13336e3cf81$j$);
  END IF;
END $do$;
-- tours.ts: mikumi-national-park
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$mikumi-national-park$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$mikumi-national-park$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      3, (SELECT id FROM media WHERE url = $j$/Mikumi2017.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Mikumi National Park$j$, $j$Accessible wildlife viewing.$j$, NULL, $j$Mikumi National Park Safari - 3 Days$j$, $j$Enjoy accessible wildlife viewing in Mikumi National Park. Close to Dar es Salaam with abundant wildlife.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 75000, 75000, 75000, 75000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$463749f6736116af6a52bc1b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and afternoon game drive$j$, $j$Arrival and afternoon game drive.$j$, 'en', $j$463749f6736116af6a52bc1b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$14a807950ca54481dc16b9a9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full-day game drive$j$, $j$Full-day game drive.$j$, 'en', $j$14a807950ca54481dc16b9a9$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$c8b1d6f837efb0575f77c07f$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$c8b1d6f837efb0575f77c07f$j$);
  END IF;
END $do$;
-- tours.ts: arusha-cultural-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$arusha-cultural-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$arusha-cultural-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      2, (SELECT id FROM media WHERE url = $j$/Cultural-Heritage-Centre-Arusha-Tanzania.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Arusha Cultural Tour$j$, $j$Experience local Tanzanian culture.$j$, NULL, $j$Arusha Cultural Tour - 2 Days$j$, $j$Experience local Tanzanian culture in Arusha. Visit markets, cultural centers, and traditional Maasai villages.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 42000, 42000, 42000, 42000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$5679e1d17eb535068c5d3f9d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$City tour and cultural center visits$j$, $j$City tour and cultural center visits.$j$, 'en', $j$5679e1d17eb535068c5d3f9d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$07b94d627127d5dd32f5fa35$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Maasai village visit and departure$j$, $j$Maasai village visit and departure.$j$, 'en', $j$07b94d627127d5dd32f5fa35$j$);
  END IF;
END $do$;
-- tours.ts: katavi-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$katavi-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$katavi-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      4, (SELECT id FROM media WHERE url = $j$/Katavi-National-Park-600x400.png$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Katavi National Park$j$, $j$Remote wilderness experience.$j$, NULL, $j$Katavi National Park Safari - 4 Days$j$, $j$Experience remote wilderness in Katavi National Park. One of Tanzania's most untouched safari destinations.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 160000, 160000, 160000, 160000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$bc110a335e7cb23d671f2801$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$bc110a335e7cb23d671f2801$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$9c59ef7110f2c36aebc37d11$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in remote wilderness$j$, $j$Game drives in remote wilderness.$j$, 'en', $j$9c59ef7110f2c36aebc37d11$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$c4190e6cb5121bf2ef3a572d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives in remote wilderness (continued)$j$, $j$Continues from the previous day. Game drives in remote wilderness.$j$, 'en', $j$c4190e6cb5121bf2ef3a572d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$e568823e060e07c4387272a3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$e568823e060e07c4387272a3$j$);
  END IF;
END $do$;
-- tours.ts: mahale-mountains-national-park-chimpanzee-trekking
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$mahale-mountains-national-park-chimpanzee-trekking$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$mahale-mountains-national-park-chimpanzee-trekking$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      6, (SELECT id FROM media WHERE url = $j$/Chimp-Group-Mahale-Mountain-JEP_8612.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Mahale Chimpanzee Trek$j$, $j$Trek with wild chimpanzees.$j$, NULL, $j$Mahale Chimpanzee Trek - 6 Days$j$, $j$Trek with wild chimpanzees in Mahale Mountains National Park. Remote paradise on Lake Tanganyika shores.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 210000, 210000, 210000, 210000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$96af5c2bffaf62307cab5084$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival at Lake Tanganyika$j$, $j$Arrival at Lake Tanganyika.$j$, 'en', $j$96af5c2bffaf62307cab5084$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$a43ed12112bf9e959b0f0188$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Chimpanzee trekking in Mahale Mountains$j$, $j$Chimpanzee trekking in Mahale Mountains.$j$, 'en', $j$a43ed12112bf9e959b0f0188$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$47ccd72467727b8003d8d021$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Chimpanzee trekking in Mahale Mountains (continued)$j$, $j$Continues from the previous day. Chimpanzee trekking in Mahale Mountains.$j$, 'en', $j$47ccd72467727b8003d8d021$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$3a4e492d1cafca8be93a32aa$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Chimpanzee trekking in Mahale Mountains (continued)$j$, $j$Continues from the previous day. Chimpanzee trekking in Mahale Mountains.$j$, 'en', $j$3a4e492d1cafca8be93a32aa$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$516d10a66082413d3e342a71$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Chimpanzee trekking in Mahale Mountains (continued)$j$, $j$Continues from the previous day. Chimpanzee trekking in Mahale Mountains.$j$, 'en', $j$516d10a66082413d3e342a71$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$585bd6017097e7be6b221dab$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$585bd6017097e7be6b221dab$j$);
  END IF;
END $do$;
-- tours.ts: pemba-island-diving
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$pemba-island-diving$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$pemba-island-diving$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      4, (SELECT id FROM media WHERE url = $j$/Pemba-Island-15.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Pemba Island Diving$j$, $j$World-class diving experience.$j$, NULL, $j$Pemba Island Diving - 4 Days$j$, $j$Experience world-class diving in Pemba Island. Pristine coral reefs, diverse marine life, and crystal-clear waters.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 98000, 98000, 98000, 98000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$bf0d2c295b91fafdc37e62dd$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and orientation$j$, $j$Arrival and orientation.$j$, 'en', $j$bf0d2c295b91fafdc37e62dd$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$f016a405278f4e4042eda2a9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Diving expeditions$j$, $j$Diving expeditions.$j$, 'en', $j$f016a405278f4e4042eda2a9$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$f22eef7e779ca2c6665e5901$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Diving expeditions (continued)$j$, $j$Continues from the previous day. Diving expeditions.$j$, 'en', $j$f22eef7e779ca2c6665e5901$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$db48b7513042256885db5694$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$db48b7513042256885db5694$j$);
  END IF;
END $do$;
-- tours.ts: stone-town-heritage-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$stone-town-heritage-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$stone-town-heritage-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      2, (SELECT id FROM media WHERE url = $j$/31719088_tourists-on-a-typical-narrow-street-in-stone-town-zanzibar-e1713023620250.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Stone Town Heritage Tour$j$, $j$Explore UNESCO World Heritage site.$j$, NULL, $j$Stone Town Heritage Tour - 2 Days$j$, $j$Explore UNESCO World Heritage site in Stone Town, Zanzibar. Historic architecture, spice markets, and Swahili culture.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 35000, 35000, 35000, 35000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$a0d0c39477688aade715e8bf$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Guided walking tour of Stone Town$j$, $j$Guided walking tour of Stone Town.$j$, 'en', $j$a0d0c39477688aade715e8bf$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$49a13e55483196c879bc8267$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Spice tour and departure$j$, $j$Spice tour and departure.$j$, 'en', $j$49a13e55483196c879bc8267$j$);
  END IF;
END $do$;
-- tours.ts: northern-circuit-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$northern-circuit-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$northern-circuit-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      10, (SELECT id FROM media WHERE url = $j$/Game-Drive-north-of-Serengeti-National-Park.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Northern Circuit Safari$j$, $j$Complete northern Tanzania experience.$j$, NULL, $j$Northern Circuit Safari - 10 Days$j$, $j$Experience the complete northern Tanzania safari circuit. Visit Serengeti, Ngorongoro, Tarangire, and Lake Manyara.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 280000, 280000, 280000, 280000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$ced830870c8fad87feb1a5a6$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival in Arusha$j$, $j$Arrival in Arusha.$j$, 'en', $j$ced830870c8fad87feb1a5a6$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$f9a7101a090f68a4ec8fef60$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti$j$, $j$Serengeti.$j$, 'en', $j$f9a7101a090f68a4ec8fef60$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$9124075e89561a11233a4a61$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti (continued)$j$, $j$Continues from the previous day. Serengeti.$j$, 'en', $j$9124075e89561a11233a4a61$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$8afd689fb421aa677e5f862c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti (continued)$j$, $j$Continues from the previous day. Serengeti.$j$, 'en', $j$8afd689fb421aa677e5f862c$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$f634e75b7d3c1bc14f406791$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Ngorongoro Crater$j$, $j$Ngorongoro Crater.$j$, 'en', $j$f634e75b7d3c1bc14f406791$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$2a420e286293af9ae644b9e9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Ngorongoro Crater (continued)$j$, $j$Continues from the previous day. Ngorongoro Crater.$j$, 'en', $j$2a420e286293af9ae644b9e9$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$6a72e152fca8f2c300070bd0$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Tarangire$j$, $j$Tarangire.$j$, 'en', $j$6a72e152fca8f2c300070bd0$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (8, v, $j$9940b6980708b618f5cc5f84$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Tarangire (continued)$j$, $j$Continues from the previous day. Tarangire.$j$, 'en', $j$9940b6980708b618f5cc5f84$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (9, v, $j$77ac6a0082ab678f1cfb0c90$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Lake Manyara and departure$j$, $j$Lake Manyara and departure.$j$, 'en', $j$77ac6a0082ab678f1cfb0c90$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (10, v, $j$839f0d5a57922c00f491038a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Lake Manyara and departure (continued)$j$, $j$Continues from the previous day. Lake Manyara and departure.$j$, 'en', $j$839f0d5a57922c00f491038a$j$);
  END IF;
END $do$;
-- tours.ts: gorilla-trekking-experience
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$gorilla-trekking-experience$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$gorilla-trekking-experience$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      3, (SELECT id FROM media WHERE url = $j$/gorilla-trekking-experience-13.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Rwanda Gorilla Trekking Experience$j$, $j$Get up close with mountain gorillas in Volcanoes National Park, Rwanda.$j$, NULL, $j$Rwanda Gorilla Trekking Experience - 3 Days$j$, $j$Get up close with mountain gorillas in Volcanoes National Park. 3-day gorilla trekking experience with expert guides and luxury accommodations.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 250000, 250000, 250000, 250000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$0c7310954af24db693528703$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival in Kigali$j$, $j$Arrival in Kigali.$j$, 'en', $j$0c7310954af24db693528703$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$1f837bd7e1072a068e344c5b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Gorilla trekking$j$, $j$Gorilla trekking.$j$, 'en', $j$1f837bd7e1072a068e344c5b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$9b98baca9f7c8f8f04b88fcf$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cultural tour and departure$j$, $j$Cultural tour and departure.$j$, 'en', $j$9b98baca9f7c8f8f04b88fcf$j$);
  END IF;
END $do$;
-- tours.ts: nyungwe-forest-canopy-walk
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$nyungwe-forest-canopy-walk$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$nyungwe-forest-canopy-walk$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      2, (SELECT id FROM media WHERE url = $j$/nyungwe-forests.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Nyungwe Forest Canopy Walk$j$, $j$Walk among the treetops.$j$, NULL, $j$Nyungwe Forest Canopy Walk - 2 Days$j$, $j$Walk among the treetops in Nyungwe Forest, Rwanda. Experience the canopy walk and track chimpanzees in ancient rainforest.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 45000, 45000, 45000, 45000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$d5ca15857a6b8f7366667b28$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and forest orientation$j$, $j$Arrival and forest orientation.$j$, 'en', $j$d5ca15857a6b8f7366667b28$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$97b66b576e2bcf1bed4791c8$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Canopy walk and chimpanzee tracking$j$, $j$Canopy walk and chimpanzee tracking. Departure.$j$, 'en', $j$97b66b576e2bcf1bed4791c8$j$);
  END IF;
END $do$;
-- tours.ts: lake-kivu-relaxation
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$lake-kivu-relaxation$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$lake-kivu-relaxation$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      3, (SELECT id FROM media WHERE url = $j$/Lake-Kivu-Islands.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Lake Kivu Relaxation$j$, $j$Relax by Africa's great lake.$j$, NULL, $j$Lake Kivu Relaxation - 3 Days$j$, $j$Relax by Africa's great lake at Lake Kivu, Rwanda. Pristine beaches, island hopping, and stunning mountain views.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 38000, 38000, 38000, 38000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$dd49f7746ad72c502f0017cf$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and beach relaxation$j$, $j$Arrival and beach relaxation.$j$, 'en', $j$dd49f7746ad72c502f0017cf$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$dd51744fa2cba75ca44ffec9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Boat tour and island visits$j$, $j$Boat tour and island visits.$j$, 'en', $j$dd51744fa2cba75ca44ffec9$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$81e80efb32369f1e0b8b8133$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$81e80efb32369f1e0b8b8133$j$);
  END IF;
END $do$;
-- tours.ts: akagera-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$akagera-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$akagera-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      2, (SELECT id FROM media WHERE url = $j$/Akagera-national-park-1-750x450.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Akagera National Park$j$, $j$Rwanda's only savanna park.$j$, NULL, $j$Akagera National Park Safari - 2 Days$j$, $j$Explore Rwanda's only savanna park at Akagera National Park. Big Five safari with boat cruises on Lake Ihema.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 52000, 52000, 52000, 52000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$50a7e4715a8af9cd67d71166$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and afternoon game drive$j$, $j$Arrival and afternoon game drive.$j$, 'en', $j$50a7e4715a8af9cd67d71166$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$2c0157d2e70adc25e28d9608$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full-day game drive and boat safari$j$, $j$Full-day game drive and boat safari. Departure.$j$, 'en', $j$2c0157d2e70adc25e28d9608$j$);
  END IF;
END $do$;
-- tours.ts: kigali-city-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$kigali-city-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$kigali-city-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      1, (SELECT id FROM media WHERE url = $j$/kigali-photo-600x300.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Kigali City Tour$j$, $j$Explore the clean city of Kigali.$j$, NULL, $j$Kigali City Tour - 1 Day$j$, $j$Explore the clean city of Kigali, Rwanda. Visit the Genocide Memorial, vibrant markets, and modern cultural centers.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 15000, 15000, 15000, 15000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$3322cfc100793c7c4090d2f6$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full-day city tour including Genocide Memorial, markets, and cultural sites$j$, $j$Full-day city tour including Genocide Memorial, markets, and cultural sites.$j$, 'en', $j$3322cfc100793c7c4090d2f6$j$);
  END IF;
END $do$;
-- tours.ts: golden-monkey-tracking
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$golden-monkey-tracking$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$golden-monkey-tracking$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      2, (SELECT id FROM media WHERE url = $j$/golden-monkey-trekking.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Golden Monkey Tracking$j$, $j$Track rare golden monkeys.$j$, NULL, $j$Golden Monkey Tracking - 2 Days$j$, $j$Track rare golden monkeys in Rwanda. Unique primate experience in Volcanoes National Park's bamboo forests.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 68000, 68000, 68000, 68000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$e3426b95b77a5df78ed77101$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and briefing$j$, $j$Arrival and briefing.$j$, 'en', $j$e3426b95b77a5df78ed77101$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$90ae56b476045e26732cc862$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Golden monkey tracking and cultural visit$j$, $j$Golden monkey tracking and cultural visit. Departure.$j$, 'en', $j$90ae56b476045e26732cc862$j$);
  END IF;
END $do$;
-- tours.ts: bwindi-gorilla-trekking
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$bwindi-gorilla-trekking$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$bwindi-gorilla-trekking$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      4, (SELECT id FROM media WHERE url = $j$/Magical-encounters-with-the-mountain-gorillas-of-Bwindi.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Bwindi Gorilla Trekking$j$, $j$Trek mountain gorillas in Bwindi Impenetrable Forest, Uganda.$j$, NULL, $j$Bwindi Gorilla Trekking - 4 Days$j$, $j$Trek mountain gorillas in Bwindi Impenetrable Forest. 4-day Uganda gorilla trekking with expert guides and comfortable accommodations.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 220000, 220000, 220000, 220000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$9c64c78ac8615edf2917c46d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$9c64c78ac8615edf2917c46d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$46ba83cdf4aa20898b58ab90$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Gorilla trekking$j$, $j$Gorilla trekking.$j$, 'en', $j$46ba83cdf4aa20898b58ab90$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$c3391e620d922a9d3a2fa2bb$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Gorilla trekking (continued)$j$, $j$Continues from the previous day. Gorilla trekking.$j$, 'en', $j$c3391e620d922a9d3a2fa2bb$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$254a22eaf3e156f1c82763de$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$254a22eaf3e156f1c82763de$j$);
  END IF;
END $do$;
-- tours.ts: queen-elizabeth-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$queen-elizabeth-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$queen-elizabeth-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      5, (SELECT id FROM media WHERE url = $j$/Queen-Elizabeth-National-Park.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Queen Elizabeth Safari$j$, $j$Diverse wildlife in scenic landscapes at Queen Elizabeth National Park.$j$, NULL, $j$Queen Elizabeth Safari - 5 Days$j$, $j$Experience diverse wildlife in scenic landscapes at Queen Elizabeth National Park. 5-day safari with game drives and boat cruises.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 115000, 115000, 115000, 115000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$172f8268304959b16de2174f$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival$j$, $j$Arrival.$j$, 'en', $j$172f8268304959b16de2174f$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$9d3e008be72da0008679c20a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safari on Kazinga Channel$j$, $j$Game drives and boat safari on Kazinga Channel.$j$, 'en', $j$9d3e008be72da0008679c20a$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$f3e1dfed08fbc341fdb483b9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safari on Kazinga Channel (continued)$j$, $j$Continues from the previous day. Game drives and boat safari on Kazinga Channel.$j$, 'en', $j$f3e1dfed08fbc341fdb483b9$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$28237e8335e17e12b3663700$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safari on Kazinga Channel (continued)$j$, $j$Continues from the previous day. Game drives and boat safari on Kazinga Channel.$j$, 'en', $j$28237e8335e17e12b3663700$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$2493a9e5af2acf83c038ae0b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$2493a9e5af2acf83c038ae0b$j$);
  END IF;
END $do$;
-- tours.ts: murchison-falls-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$murchison-falls-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$murchison-falls-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      4, (SELECT id FROM media WHERE url = $j$/murchison-falls.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Murchison Falls Adventure$j$, $j$Witness the powerful Murchison Falls.$j$, NULL, $j$Murchison Falls Adventure - 4 Days$j$, $j$Witness the powerful Murchison Falls in Uganda. Game drives, boat safaris, and spectacular waterfall views.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 98000, 98000, 98000, 98000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$65779fe6e0bc4bbc1ab080fe$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$65779fe6e0bc4bbc1ab080fe$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$6d36c51147549c58afd24a66$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safari to the falls$j$, $j$Game drives and boat safari to the falls.$j$, 'en', $j$6d36c51147549c58afd24a66$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$b38c665cd7de63f7cb431d10$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Game drives and boat safari to the falls (continued)$j$, $j$Continues from the previous day. Game drives and boat safari to the falls.$j$, 'en', $j$b38c665cd7de63f7cb431d10$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$60ee29cbb4af04f85930fd69$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$60ee29cbb4af04f85930fd69$j$);
  END IF;
END $do$;
-- tours.ts: kibale-national-park-chimpanzee-trekking
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$kibale-national-park-chimpanzee-trekking$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$kibale-national-park-chimpanzee-trekking$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      3, (SELECT id FROM media WHERE url = $j$/kibale-national-park-chimpanzees-uganda-590x390.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Kibale Chimpanzee Tracking$j$, $j$Track our closest relatives.$j$, NULL, $j$Kibale Chimpanzee Tracking - 3 Days$j$, $j$Track our closest relatives in Kibale National Park, Uganda. Primate capital of the world with 13 primate species.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 75000, 75000, 75000, 75000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$296b4da002183340bdc231b1$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lodge check-in$j$, $j$Arrival and lodge check-in.$j$, 'en', $j$296b4da002183340bdc231b1$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$7f35d2c670e8bcde7ab9bcff$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Chimpanzee tracking$j$, $j$Chimpanzee tracking.$j$, 'en', $j$7f35d2c670e8bcde7ab9bcff$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$cddef6f7295f4ff87a268171$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Bigodi wetland walk and departure$j$, $j$Bigodi wetland walk and departure.$j$, 'en', $j$cddef6f7295f4ff87a268171$j$);
  END IF;
END $do$;
-- tours.ts: lake-mburo-national-park-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$lake-mburo-national-park-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$lake-mburo-national-park-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      2, (SELECT id FROM media WHERE url = $j$/lake-mburo-national-park.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Lake Mburo National Park$j$, $j$Compact park with diverse wildlife.$j$, NULL, $j$Lake Mburo National Park Safari - 2 Days$j$, $j$Explore a compact park with diverse wildlife at Lake Mburo National Park, Uganda. Zebras, impalas, and boat safaris.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 42000, 42000, 42000, 42000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$2db94c6a002f709ef07bd885$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and afternoon game drive$j$, $j$Arrival and afternoon game drive.$j$, 'en', $j$2db94c6a002f709ef07bd885$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$b0fee112f3722f75bb1efb81$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning game drive and boat safari$j$, $j$Morning game drive and boat safari. Departure.$j$, 'en', $j$b0fee112f3722f75bb1efb81$j$);
  END IF;
END $do$;
-- tours.ts: rwenzori-mountains-hiking
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$rwenzori-mountains-hiking$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$rwenzori-mountains-hiking$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      7, (SELECT id FROM media WHERE url = $j$/Rwenzori-Mountains-03_1600p.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Rwenzori Mountains Hiking$j$, $j$Hike the Mountains of the Moon.$j$, NULL, $j$Rwenzori Mountains Hiking - 7 Days$j$, $j$Hike the Mountains of the Moon in Rwenzori Mountains, Uganda. Challenging trek through unique alpine vegetation.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 180000, 180000, 180000, 180000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$afbca5fc52a5ba8ad476b73e$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and briefing$j$, $j$Arrival and briefing.$j$, 'en', $j$afbca5fc52a5ba8ad476b73e$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$1e623e0dd6b433259bbc8a33$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Hiking through various vegetation zones$j$, $j$Hiking through various vegetation zones.$j$, 'en', $j$1e623e0dd6b433259bbc8a33$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$52b78f404720ed0d139472f9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Hiking through various vegetation zones (continued)$j$, $j$Continues from the previous day. Hiking through various vegetation zones.$j$, 'en', $j$52b78f404720ed0d139472f9$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$686a311fe00b1bd4c4890ab2$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Hiking through various vegetation zones (continued)$j$, $j$Continues from the previous day. Hiking through various vegetation zones.$j$, 'en', $j$686a311fe00b1bd4c4890ab2$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$dc8c9cd3f71e1a75aba79198$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Hiking through various vegetation zones (continued)$j$, $j$Continues from the previous day. Hiking through various vegetation zones.$j$, 'en', $j$dc8c9cd3f71e1a75aba79198$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$e8797d673e741176fd7148f1$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Hiking through various vegetation zones (continued)$j$, $j$Continues from the previous day. Hiking through various vegetation zones.$j$, 'en', $j$e8797d673e741176fd7148f1$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$f84bd05d81cc70192770043c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Descent and departure$j$, $j$Descent and departure.$j$, 'en', $j$f84bd05d81cc70192770043c$j$);
  END IF;
END $do$;
-- tours.ts: jinja-adventure-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$jinja-adventure-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$jinja-adventure-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      2, (SELECT id FROM media WHERE url = $j$/6-days-gorilla-tracking-and-rafting-jinja.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Jinja White Water Rafting$j$, $j$Adventure at the source of the Nile.$j$, NULL, $j$Jinja White Water Rafting - 2 Days$j$, $j$Experience adventure at the source of the Nile in Jinja, Uganda. World-class white water rafting and adrenaline activities.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 35000, 35000, 35000, 35000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$7c93221221e8613bd4881c96$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and Nile source visit$j$, $j$Arrival and Nile source visit.$j$, 'en', $j$7c93221221e8613bd4881c96$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$7e5b55586f5dbcc8c08a034a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$White water rafting and departure$j$, $j$White water rafting and departure.$j$, 'en', $j$7e5b55586f5dbcc8c08a034a$j$);
  END IF;
END $do$;
-- tours.ts: lake-bunyonyi-relaxation-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$lake-bunyonyi-relaxation-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$lake-bunyonyi-relaxation-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      3, (SELECT id FROM media WHERE url = $j$/lake_bunyonyi__uganda-the-pearl-of-africa.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Lake Bunyonyi Relaxation$j$, $j$Relax by Uganda's deepest lake.$j$, NULL, $j$Lake Bunyonyi Relaxation - 3 Days$j$, $j$Relax by Uganda's deepest lake at Lake Bunyonyi. Scenic beauty, island hopping, and peaceful atmosphere.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 45000, 45000, 45000, 45000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$99543045b8a39ea7c3758c69$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and lake orientation$j$, $j$Arrival and lake orientation.$j$, 'en', $j$99543045b8a39ea7c3758c69$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$680a1ca74cb05c12cc9f7ddb$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Island hopping and canoeing$j$, $j$Island hopping and canoeing.$j$, 'en', $j$680a1ca74cb05c12cc9f7ddb$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$1fa737e3967a53cad94b3b4d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$1fa737e3967a53cad94b3b4d$j$);
  END IF;
END $do$;
-- tours.ts: ssese-islands-beach-holiday
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$ssese-islands-beach-holiday$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$ssese-islands-beach-holiday$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      4, (SELECT id FROM media WHERE url = $j$/Travel-to-Ssese-islands.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Ssese Islands Beach Holiday$j$, $j$Beach paradise on Lake Victoria.$j$, NULL, $j$Ssese Islands Beach Holiday - 4 Days$j$, $j$Experience beach paradise on Lake Victoria at Ssese Islands, Uganda. Tropical beaches, water sports, and relaxation.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 65000, 65000, 65000, 65000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$e0deeca013cc3e1d4e959ecd$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival and beach relaxation$j$, $j$Arrival and beach relaxation.$j$, 'en', $j$e0deeca013cc3e1d4e959ecd$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$377fe04ead519a1e08527d83$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Water sports and island exploration$j$, $j$Water sports and island exploration.$j$, 'en', $j$377fe04ead519a1e08527d83$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$bd875eb99aa17fd1310ab667$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Water sports and island exploration (continued)$j$, $j$Continues from the previous day. Water sports and island exploration.$j$, 'en', $j$bd875eb99aa17fd1310ab667$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$d29960c0131e5128b62a833c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Departure$j$, $j$Departure.$j$, 'en', $j$d29960c0131e5128b62a833c$j$);
  END IF;
END $do$;
-- tours.ts: lake-naivasha-boat-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$lake-naivasha-boat-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$lake-naivasha-boat-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      1, (SELECT id FROM media WHERE url = $j$/Lake-Naivasha-National-Park-750x450.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Lake Naivasha Boat Safari$j$, $j$Boat safari on freshwater Lake Naivasha with hippos, birds, and Crescent Island walking safari.$j$, NULL, $j$Lake Naivasha Boat Safari - 1 Day$j$, $j$Enjoy a boat safari on freshwater Lake Naivasha with hippos, birds, and Crescent Island walking safari.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 15000, 15000, 15000, 15000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$f56f8bfe2d9bdf298825c393$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Boat safari on Lake Naivasha and walking safari on Crescent Island$j$, $j$Boat safari on Lake Naivasha and walking safari on Crescent Island.$j$, 'en', $j$f56f8bfe2d9bdf298825c393$j$);
  END IF;
END $do$;
-- tours.ts: kenya-disability-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$kenya-disability-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$kenya-disability-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      7, (SELECT id FROM media WHERE url = $j$/wheelchair-accessible-tanzania-safari.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Accessible Kenya Safari Experience$j$, $j$A fully accessible safari experience designed for travelers with mobility challenges, featuring wheelchair-accessible vehicles, accommodations, and tailored wildlife viewing.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 7-day accessible safari experience in Kenya with adapted vehicles and accommodations", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Accessible Kenya Safari Experience for People with Disabilities$j$, $j$A fully accessible safari experience designed for travelers with mobility challenges in Kenya. Wheelchair-accessible vehicles and accommodations.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 245000, 245000, 245000, 245000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: accessible-masai-mara-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$accessible-masai-mara-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$accessible-masai-mara-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      4, (SELECT id FROM media WHERE url = $j$/Tineke-in-Kenya.png$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$4-Day Accessible Masai Mara Experience$j$, $j$A focused accessible safari in the Masai Mara with wheelchair-adapted vehicles, accessible tented camps, and front-row seats to the Great Migration.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 4-day accessible safari in Masai Mara with adapted vehicles", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Accessible Masai Mara Safari for People with Disabilities$j$, $j$A focused accessible safari in the Masai Mara with wheelchair-adapted vehicles and accessible tented camps.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 145000, 145000, 145000, 145000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: tanzania-accessible-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$tanzania-accessible-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$tanzania-accessible-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      8, (SELECT id FROM media WHERE url = $j$/WhatsApp-Image-2025-01-15-at-12.06.45-PM.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Tanzania Accessible Safari Adventure$j$, $j$An inclusive journey through Tanzania's Serengeti and Ngorongoro Crater with adapted safari vehicles, accessible lodges, and unforgettable wildlife encounters.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 8-day accessible safari in Tanzania", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Tanzania Accessible Safari Adventure$j$, $j$An inclusive journey through Tanzania's Serengeti and Ngorongoro Crater with adapted safari vehicles and accessible lodges.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 295000, 295000, 295000, 295000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: rwanda-accessible-gorilla-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$rwanda-accessible-gorilla-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$rwanda-accessible-gorilla-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      5, (SELECT id FROM media WHERE url = $j$/WhatsApp%20Image%202025-09-02%20at%2011.43.25%20AM.jpeg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Rwanda Accessible Gorilla Experience$j$, $j$A rare opportunity to experience Rwanda's mountain gorillas with specially designed accessible trekking routes, adapted viewing platforms, and cultural encounters.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 5-day accessible gorilla experience in Rwanda", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Rwanda Accessible Gorilla Experience$j$, $j$A rare opportunity to experience Rwanda's mountain gorillas with specially designed accessible trekking routes.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 320000, 320000, 320000, 320000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: uganda-accessible-primate-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$uganda-accessible-primate-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$uganda-accessible-primate-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      6, (SELECT id FROM media WHERE url = $j$/kibale-national-park-chimpanzees-uganda-590x390.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Uganda Accessible Primate Safari$j$, $j$An accessible primate-focused safari in Uganda with wheelchair-friendly pathways, adapted chimpanzee and gorilla viewing, and a Kazinga Channel boat safari.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 6-day accessible primate safari in Uganda", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Uganda Accessible Primate Safari$j$, $j$An accessible primate-focused safari in Uganda with wheelchair-friendly pathways and adapted chimpanzee and gorilla viewing.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 220000, 220000, 220000, 220000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: east-africa-grand-accessible-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$east-africa-grand-accessible-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$east-africa-grand-accessible-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$multi-country$j$),
      12, (SELECT id FROM media WHERE url = $j$/ngorongoro-header-3.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$East Africa Grand Accessible Safari$j$, $j$The ultimate East African accessible safari across Kenya and Tanzania, combining Maasai Mara, Serengeti, and Ngorongoro with premium accessible accommodations.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 12-day grand accessible safari across Kenya and Tanzania", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$East Africa Grand Accessible Safari$j$, $j$The ultimate East African accessible safari across Kenya and Tanzania with premium accessible accommodations.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 580000, 580000, 580000, 580000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: wheelchair-accessible-safari-vehicle
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$wheelchair-accessible-safari-vehicle$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$wheelchair-accessible-safari-vehicle$j$, false, false, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      1, (SELECT id FROM media WHERE url = $j$/HandicappedConvertedRamp.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Wheelchair Accessible Safari Vehicle$j$, $j$Experience the wild in comfort and independence with our specially modified Toyota Landcruiser and Safari Minivan — designed for wheelchair users. Each vehicle is customized in our in-house workshop to ensure safe, easy access and smooth travel across Kenya and East Africa.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: Customizable safari transport option — accessible vehicles available for all East African safari itineraries.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Wheelchair Accessible Safari Vehicle$j$, $j$Travel across Kenya and East Africa in comfort with our custom wheelchair-accessible Toyota Landcruiser and Safari Minivan. Built for safety, space, and accessibility.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 220000, 220000, 220000, 220000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: rwanda-accessible-gorilla-safari-2
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$rwanda-accessible-gorilla-safari-2$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$rwanda-accessible-gorilla-safari-2$j$, false, false, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      1, (SELECT id FROM media WHERE url = $j$/AccessibleGorillaSafari.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Rwanda Accessible Gorilla Safari$j$, $j$Embark on an unforgettable gorilla trekking adventure in Rwanda, designed for accessibility. Our specially modified vehicles and trained guides ensure a safe, comfortable, and inclusive experience for wheelchair users in Volcanoes National Park.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: Customizable gorilla trekking tour with accessible transport and support, tailored to your needs in Rwanda’s Volcanoes National Park.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Rwanda Accessible Gorilla Safari$j$, $j$Experience gorilla trekking in Rwanda with our wheelchair-accessible safari vehicles and expert guides, ensuring comfort and safety in Volcanoes National Park.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 350000, 350000, 350000, 350000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: carnivore-experience
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$carnivore-experience$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$carnivore-experience$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      1, (SELECT id FROM media WHERE url = $j$/carnivore-restaurant.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Carnivore Experience$j$, $j$Indulge in a unique dining adventure at the famous Carnivore Restaurant in Nairobi, featuring exotic game meats and vibrant Kenyan hospitality.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: Half-day dining experience in Nairobi", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Carnivore Experience$j$, $j$Enjoy a unique dining adventure at Nairobi's Carnivore Restaurant with exotic game meats and Kenyan hospitality.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 15000, 15000, 15000, 15000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: safari-madoa-doa
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$safari-madoa-doa$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$safari-madoa-doa$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      7, (SELECT id FROM media WHERE url = $j$/Viaje-a-Kenia-Masai-Mara-32.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Safari Madoa Doa$j$, $j$Embark on an exclusive safari adventure through Kenya's premier wildlife reserves, spotting the Big Five in their natural habitat.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 7-day safari across Kenyan reserves", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Safari Madoa Doa$j$, $j$Experience a 7-day exclusive safari in Kenya, spotting the Big Five in premier wildlife reserves.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 320000, 320000, 320000, 320000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: best-of-zanzibar
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$best-of-zanzibar$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$best-of-zanzibar$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      8, (SELECT id FROM media WHERE url = $j$/images%20(9).jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Best of Zanzibar$j$, $j$Discover the tropical paradise of Zanzibar with its pristine beaches, historic Stone Town, and vibrant spice tours.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 8-day cultural and beach tour in Zanzibar", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Best of Zanzibar$j$, $j$Explore Zanzibar's beaches, Stone Town, and spice tours on an 8-day cultural and beach adventure.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 250000, 250000, 250000, 250000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: classic-sky-safari-2
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$classic-sky-safari-2$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$classic-sky-safari-2$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      10, (SELECT id FROM media WHERE url = $j$/images%20(8).jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Classic Sky Safari 2$j$, $j$Soar above East Africa's iconic landscapes on a luxury sky safari, visiting Amboseli, Meru, and the Maasai Mara.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 10-day luxury air safari across Kenya", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Classic Sky Safari 2$j$, $j$Experience a 10-day luxury sky safari over Kenya's Amboseli, Meru, and Maasai Mara.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 650000, 650000, 650000, 650000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: nairobi-national-park-tour
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$nairobi-national-park-tour$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$nairobi-national-park-tour$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      1, (SELECT id FROM media WHERE url = $j$/caption.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Nairobi National Park Tour$j$, $j$Explore Nairobi National Park, a unique wildlife haven near the city, home to rhinos, lions, and stunning savanna views.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: Half-day wildlife tour in Nairobi", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Nairobi National Park Tour$j$, $j$Discover wildlife near Nairobi with a half-day tour of Nairobi National Park, home to rhinos and lions.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 20000, 20000, 20000, 20000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: visit-a-thousand-hills-distilleries
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$visit-a-thousand-hills-distilleries$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$visit-a-thousand-hills-distilleries$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      1, (SELECT id FROM media WHERE url = $j$/images%20(7).jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Visit a Thousand Hills Distilleries$j$, $j$Experience Rwanda's artisanal spirit scene with a tour of Thousand Hills Distilleries, tasting premium local beverages.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: Half-day distillery tour in Rwanda", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Visit a Thousand Hills Distilleries$j$, $j$Tour Rwanda's Thousand Hills Distilleries and taste premium local spirits on a half-day experience.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 10000, 10000, 10000, 10000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: this-is-africa-nyamirambo-womens-center
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$this-is-africa-nyamirambo-womens-center$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$this-is-africa-nyamirambo-womens-center$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      1, (SELECT id FROM media WHERE url = $j$/nyamirambo-women-s-center.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$This is Africa Nyamirambo Women's Center$j$, $j$Immerse yourself in Rwandan culture with a visit to Nyamirambo Women's Center, exploring local crafts and community initiatives.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: Half-day cultural tour in Kigali", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Nyamirambo Women's Center Tour$j$, $j$Explore Rwandan culture and crafts at Nyamirambo Women's Center in Kigali on a half-day tour.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 8000, 8000, 8000, 8000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: relaxation-at-the-beach
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$relaxation-at-the-beach$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$relaxation-at-the-beach$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      5, (SELECT id FROM media WHERE url = $j$/images%20(6).jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Relaxation at the Beach$j$, $j$Unwind on the pristine beaches of East Africa, enjoying sun, sand, and sea in a serene coastal escape.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 5-day beach retreat in East Africa", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Relaxation at the Beach$j$, $j$Unwind on East Africa's pristine beaches with a 5-day coastal retreat.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 120000, 120000, 120000, 120000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: safari-dwika
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$safari-dwika$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$safari-dwika$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      7, (SELECT id FROM media WHERE url = $j$/images%20(5).jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Safari Dwika$j$, $j$Join an adventurous safari through Tanzania's iconic parks, witnessing diverse wildlife and stunning landscapes.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 7-day safari in Tanzania", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Safari Dwika$j$, $j$Experience a 7-day safari adventure through Tanzania's iconic wildlife parks.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 350000, 350000, 350000, 350000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: lake-nakuru-rhino-sanctuary
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$lake-nakuru-rhino-sanctuary$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$lake-nakuru-rhino-sanctuary$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      3, (SELECT id FROM media WHERE url = $j$/images%20(4).jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Lake Nakuru Rhino Sanctuary Experience$j$, $j$Explore the famous Lake Nakuru National Park, a protected sanctuary for black and white rhinos, and witness thousands of flamingos along the soda lake shores.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 3-day rhino tracking and birdwatching in Lake Nakuru", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Lake Nakuru Rhino Safari$j$, $j$Visit Kenya's premier rhino sanctuary at Lake Nakuru. See black and white rhinos, flamingos, and Rothschild giraffes on this 3-day wildlife escape.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 120000, 120000, 120000, 120000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: big-five-masai-mara
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$big-five-masai-mara$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$big-five-masai-mara$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      7, (SELECT id FROM media WHERE url = $j$/Big-5.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$7-Day Big Five Masai Mara$j$, $j$Embark on an extraordinary 7-day safari in the world-famous Masai Mara, home to the highest concentration of Big Five game in Kenya. Experience the drama of the African wilderness and witness lions, elephants, leopards, buffalo, and rhinos in their natural habitat.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 7-day Big Five-focused safari in Masai Mara National Reserve", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$7-Day Masai Mara Big Five Safari$j$, $j$Spot lions, elephants, leopards, buffalo and rhinos on this 7-day Masai Mara safari. Expert guides, premium game drives, and luxury tented camps.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 285000, 285000, 285000, 285000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: big-five-amboseli-elephant
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$big-five-amboseli-elephant$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$big-five-amboseli-elephant$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      5, (SELECT id FROM media WHERE url = $j$/african-lions-uganda-1024x683.webp$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$5-Day Amboseli Elephant Focus$j$, $j$Discover the majestic elephants of Amboseli against the breathtaking backdrop of Mount Kilimanjaro. This 5-day specialized safari focuses on Africa's largest elephant herds, offering unparalleled photography opportunities and intimate encounters with these gentle giants.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 5-day elephant research and photography safari in Amboseli", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Amboseli Elephant Safari$j$, $j$Experience Africa's most spectacular elephant herds against Mount Kilimanjaro. A 5-day photography-focused safari in Amboseli National Park.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 195000, 195000, 195000, 195000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: big-five-tsavo-adventure
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$big-five-tsavo-adventure$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$big-five-tsavo-adventure$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      6, (SELECT id FROM media WHERE url = $j$/Inverdoorn-54.jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$6-Day Tsavo Big Five Adventure$j$, $j$Explore Kenya's largest national park, Tsavo, divided into Tsavo East and Tsavo West. This 6-day adventure takes you through red elephant country, volcanic landscapes, and lush riverine forests in search of the Big Five and Tsavo's famous maneless lions.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 6-day Big Five safari exploring Tsavo East and Tsavo West", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Tsavo Big Five Safari$j$, $j$Cross Tsavo East and West on a 6-day Big Five adventure. See red elephants, Mzima Springs, and the legendary maneless lions of Tsavo.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 245000, 245000, 245000, 245000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: uganda-accessible-primate-safari-2
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$uganda-accessible-primate-safari-2$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$uganda-accessible-primate-safari-2$j$, false, false, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$uganda$j$),
      5, (SELECT id FROM media WHERE url = $j$/images%20(10).jpg$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$5-Day Accessible Uganda Primate Safari$j$, $j$Experience Uganda's incredible primates on this fully accessible safari. Designed for travelers with mobility challenges, this tour offers wheelchair-friendly accommodations, modified vehicles with ramps, and guided tracking of mountain gorillas and chimpanzees in Kibale Forest and Bwindi Impenetrable National Park.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 5-day accessible primate safari tracking gorillas and chimps in Uganda", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Accessible Uganda Primate Safari$j$, $j$Join a wheelchair-accessible safari in Uganda to track mountain gorillas and chimpanzees. Adaptive vehicles, step-free lodges, and inclusive guiding.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 385000, 385000, 385000, 385000 FROM seasons;
  END IF;
END $do$;
-- tours.ts: from-nairobi-maasai-mara-1-day-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$from-nairobi-maasai-mara-1-day-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$from-nairobi-maasai-mara-1-day-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      1, (SELECT id FROM media WHERE url = $j$/bbc661354c745efe824cad3249204c2159b382a4700756bedb8b9ac407c5662d.avif$j$ ORDER BY id LIMIT 1),
      NULL, NULL, NULL) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$From Nairobi: Maasai Mara 1-Day Safari: Lunch & Pickup$j$, $j$Explore the Maasai Mara on a 1-day safari from Nairobi with two game drives and a packed lunch inside the reserve. Optional Maasai village visit available.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Trip outline: 1-day Maasai Mara safari from Nairobi with morning and afternoon game drives, picnic lunch in the reserve, and optional Maasai village visit", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$From Nairobi: Maasai Mara 1-Day Safari$j$, $j$Experience the Maasai Mara in one day from Nairobi: game drives, Big Five spotting, packed lunch in the reserve, optional Maasai cultural visit. Hotel pickup included.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 42000, 42000, 42000, 42000 FROM seasons;
  END IF;
END $do$;
-- products-data.ts: best-of-kenya-tanzania
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$best-of-kenya-tanzania$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$best-of-kenya-tanzania$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$migration$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$multi-country$j$),
      10, (SELECT id FROM media WHERE url = $j$/4-Days-Masai-Mara-Wildebeest-safari.jpg$j$ ORDER BY id LIMIT 1),
      $j$moderate$j$::enum_tours_facts_pace, NULL, 8) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Best of Kenya & Tanzania - The Ultimate Migration Experience$j$, $j$Embark on an epic 10-day safari odyssey across Kenya and Tanzania, where thundering herds of wildebeest and majestic lions await in the legendary Maasai Mara and Serengeti. Experience the greatest wildlife spectacle on earth.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Feel the pulse of the wild on this comprehensive 10-day journey through East Africa's most iconic landscapes. Chase the awe-inspiring Great Migration across the Mara River, where crocodiles await their annual feast. Marvel at Ngorongoro Crater's wildlife haven - a natural amphitheater teeming with over 25,000 large animals. Connect authentically with Maasai warriors who share ancient traditions, and meet the Hadzabe, one of Africa's last remaining hunter-gatherer tribes. From golden savannas to starlit nights around campfires, this premium adventure blends luxury lodges with authentic cultural immersion. Each day brings new wonders: sunrise game drives when predators are most active, picnic lunches under acacia trees, and evenings reflecting on unforgettable sightings. Our carefully curated itinerary ensures you experience the essence of East Africa while supporting sustainable tourism initiatives.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Luxury tented camps and 5-star lodges", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: July to October for migration crossings; January to March for calving season", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Weekly departures every Saturday", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: Minimum age 12 years (family departures available)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: Carbon-offset program, community tourism certified, plastic-free operations", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Moderate (some early starts and bumpy roads)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Maximum 8 travelers for personalized experience", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Best of Kenya & Tanzania: 10-Day Luxury Migration Safari$j$, $j$Experience Africa's greatest wildlife spectacle on our 10-day premium Kenya-Tanzania safari. Witness the Great Migration, track Big Five, and immerse in Maasai culture with expert guides. All-inclusive luxury package.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 650000, 650000, 650000, 650000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$376932aa736df3da3d307e05$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrive at Jomo Kenyatta International Airport, Nairobi$j$, $j$Arrive at Jomo Kenyatta International Airport, Nairobi. VIP meet-and-greet service. Transfer to boutique hotel for orientation and welcome dinner featuring Kenyan cuisine.$j$, 'en', $j$376932aa736df3da3d307e05$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$b4d61ed0bc4ffb44be1e7ddc$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Fly to Maasai Mara$j$, $j$Fly to Maasai Mara. Morning and afternoon game drives focusing on migration herds. Visit to Maasai village for cultural exchange. Sundowner drinks overlooking the plains.$j$, 'en', $j$b4d61ed0bc4ffb44be1e7ddc$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$8c9ddf7127b477f9f3d2dd16$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Fly to Maasai Mara (continued)$j$, $j$Continues from the previous day. Fly to Maasai Mara. Morning and afternoon game drives focusing on migration herds. Visit to Maasai village for cultural exchange. Sundowner drinks overlooking the plains.$j$, 'en', $j$8c9ddf7127b477f9f3d2dd16$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$4e073acb43cbbb95a18cadbe$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cross-border transfer to Serengeti via Isebania border$j$, $j$Cross-border transfer to Serengeti via Isebania border. Afternoon game drive en route to luxury camp. Evening wildlife presentation by resident naturalist.$j$, 'en', $j$4e073acb43cbbb95a18cadbe$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$5f8aa3b1e8c2b7464c7db5cd$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full days in Serengeti with flexible game drives$j$, $j$Full days in Serengeti with flexible game drives. Options include predator tracking, bird watching (over 500 species), and visiting remote regions few tourists see.$j$, 'en', $j$5f8aa3b1e8c2b7464c7db5cd$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$40682069dc5b3f96743dd779$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full days in Serengeti with flexible game drives (continued)$j$, $j$Continues from the previous day. Full days in Serengeti with flexible game drives. Options include predator tracking, bird watching (over 500 species), and visiting remote regions few tourists see.$j$, 'en', $j$40682069dc5b3f96743dd779$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$46e77da8d3432f8bb200172b$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Descend into Ngorongoro Crater for full-day exploration with picnic lunch at Hippo Pool$j$, $j$Descend into Ngorongoro Crater for full-day exploration with picnic lunch at Hippo Pool. Afternoon visit to Olduvai Gorge, 'Cradle of Mankind'.$j$, 'en', $j$46e77da8d3432f8bb200172b$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (8, v, $j$8d74ba65f3a2a0ab37a248e8$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cultural immersion day with Hadzabe tribe learning bush skills and traditional hunting…$j$, $j$Cultural immersion day with Hadzabe tribe learning bush skills and traditional hunting techniques (non-violent demonstration). Evening storytelling around campfire.$j$, 'en', $j$8d74ba65f3a2a0ab37a248e8$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (9, v, $j$378cd911c1eaa3b2410fef67$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Return to Arusha via Lake Manyara (famous for tree-climbing lions)$j$, $j$Return to Arusha via Lake Manyara (famous for tree-climbing lions). Farewell dinner at legendary Arusha Coffee Lodge.$j$, 'en', $j$378cd911c1eaa3b2410fef67$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (10, v, $j$42dc178dd7f3d13899a7cee0$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Transfer to Kilimanjaro International Airport with packed lunch and safari memories to…$j$, $j$Transfer to Kilimanjaro International Airport with packed lunch and safari memories to last a lifetime.$j$, 'en', $j$42dc178dd7f3d13899a7cee0$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$14c151a15bf7ae93942a1b06$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Witness the dramatic Mara River crossings during the Great Migration (July-October)$j$, 'en', $j$14c151a15bf7ae93942a1b06$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$161c8e18d251688d31c0f4d1$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Spot all Big Five animals in their natural habitats with expert trackers$j$, 'en', $j$161c8e18d251688d31c0f4d1$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$890f582758f7b790b029b29c$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Spend a full day exploring Ngorongoro Crater, a UNESCO World Heritage Site$j$, 'en', $j$890f582758f7b790b029b29c$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$bcd954f231fed371de3b673c$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Immersive cultural visit with Maasai community including traditional dance and crafts$j$, 'en', $j$bcd954f231fed371de3b673c$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$bf30a7410bdbf73109c00204$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Night game drive in a private conservancy to spot nocturnal wildlife$j$, 'en', $j$bf30a7410bdbf73109c00204$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$3967e81eec604dd7e36ea215$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Hot air balloon safari over the Serengeti with champagne breakfast (optional)$j$, 'en', $j$3967e81eec604dd7e36ea215$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$74f681cf703c04a9e9e37d8f$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Photography sessions with professional safari photography tips$j$, 'en', $j$74f681cf703c04a9e9e37d8f$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$09032a85a953aa372833de08$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Stay in luxury tented camps with 360-degree views of the wilderness$j$, 'en', $j$09032a85a953aa372833de08$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$b2557137936f58838337bf18$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All accommodation in luxury lodges and tented camps$j$, 'en', $j$b2557137936f58838337bf18$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$5a8b94efbe4ee9012c23b623$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Three meals daily plus snacks and beverages (excluding premium alcohol)$j$, 'en', $j$5a8b94efbe4ee9012c23b623$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$be3900744464692ed22e32ed$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Professional English/French speaking driver-guide with 10+ years experience$j$, 'en', $j$be3900744464692ed22e32ed$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$61a861ace0b0a08ee1fb9043$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private 4x4 Land Cruiser with pop-up roof, fridge, and charging ports$j$, 'en', $j$61a861ace0b0a08ee1fb9043$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$87e35db842fa0005d7f06b76$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All national park fees and conservation levies$j$, 'en', $j$87e35db842fa0005d7f06b76$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$6037791c611212e0000d91b9$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Internal flights Nairobi-Maasai Mara$j$, 'en', $j$6037791c611212e0000d91b9$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$3e64ef8e795f940fd4be0425$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All cultural visit fees and community donations$j$, 'en', $j$3e64ef8e795f940fd4be0425$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$308129ec357b2c6f3c19d4df$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Complimentary binoculars and wildlife reference books$j$, 'en', $j$308129ec357b2c6f3c19d4df$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (9, v, $j$fab7186bc69b2f54cc8708d5$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Emergency medical evacuation coverage$j$, 'en', $j$fab7186bc69b2f54cc8708d5$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (10, v, $j$4ba693151a09c0be5382ffae$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$24/7 in-country support from our operations team$j$, 'en', $j$4ba693151a09c0be5382ffae$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$9bf20a74f2289df7f4a82b37$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International flights to/from East Africa$j$, 'en', $j$9bf20a74f2289df7f4a82b37$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$2c2fe47705661d7ce41c7662$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Comprehensive travel insurance (mandatory)$j$, 'en', $j$2c2fe47705661d7ce41c7662$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$4f3bb130e90d6ab38ebc9025$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Kenya and Tanzania visa fees (approx. $100 total)$j$, 'en', $j$4f3bb130e90d6ab38ebc9025$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$659c0e7c381bee4158fdcf42$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Optional hot air balloon safari ($550 per person)$j$, 'en', $j$659c0e7c381bee4158fdcf42$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$83ae3db6030539b0c025c7c2$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Premium alcoholic beverages and imported wines$j$, 'en', $j$83ae3db6030539b0c025c7c2$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$503b5f470150ef83b45d8673$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal purchases and gratuities (recommended $20-$30 per day)$j$, 'en', $j$503b5f470150ef83b45d8673$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (7, v, $j$f659bf2d32be1db1ed788832$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$COVID-19 testing if required (we assist with arrangements)$j$, 'en', $j$f659bf2d32be1db1ed788832$j$);
  END IF;
END $do$;
-- products-data.ts: safari-simba
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$safari-simba$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$safari-simba$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      7, (SELECT id FROM media WHERE url = $j$/images.jpeg$j$ ORDER BY id LIMIT 1),
      $j$easy$j$::enum_tours_facts_pace, NULL, 6) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Safari Simba: Amboseli & Tsavo Wilderness Expedition$j$, $j$Roar into adventure with Safari Simba, a 7-day journey where Kenya's Amboseli and Tsavo National Parks unveil massive elephant herds grazing beneath Kilimanjaro's snow-capped peak and lions prowling through vast red-earth landscapes.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "This carefully crafted 7-day thrill ride immerses you in two of Kenya's most diverse ecosystems. Begin in Amboseli, where over 1,500 elephants roam freely against the breathtaking backdrop of Africa's highest peak - Mount Kilimanjaro. Photograph iconic scenes of elephants with Kilimanjaro's summit glowing in sunrise light. Then venture into Tsavo's untamed wilderness, divided into East and West sections totaling over 20,000 square kilometers. Here, the 'red elephants' of Tsavo (colored by iron-rich dust) mingle with prides of lions, elusive leopards, and massive herds of buffalo. Stay in eco-conscious lodges designed to blend with the environment, each offering unique perspectives on the wilderness. Your expert guide will share insights into predator-prey dynamics, conservation success stories, and geological wonders like Mzima Springs and Shetani Lava Flows. This safari balances intense wildlife viewing with relaxing moments to absorb Africa's majestic beauty.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Eco-lodges with solar power and water conservation", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: Year-round; best wildlife viewing June-October & January-February", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Twice monthly on 1st and 15th", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: Minimum age 8 years", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: Supports Tsavo Trust anti-poaching, uses solar-powered lodges", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Easy to Moderate", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Maximum 6 travelers for optimal vehicle window seats", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Safari Simba: 7-Day Amboseli & Tsavo Wildlife Expedition$j$, $j$Join our 7-day Safari Simba expedition featuring Amboseli's elephants with Kilimanjaro views and Tsavo's legendary lions. Eco-friendly lodges, expert guides, and unforgettable wildlife encounters.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 420000, 420000, 420000, 420000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$d77294bf6087f2b4f8acd6a4$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Nairobi arrival$j$, $j$Nairobi arrival. Briefing and overnight at Hemingways Nairobi with rooftop views of the city.$j$, 'en', $j$d77294bf6087f2b4f8acd6a4$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$d1a7c64fd28e6ef03a2d87e0$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Scenic drive to Amboseli via Maasai countryside$j$, $j$Scenic drive to Amboseli via Maasai countryside. Afternoon game drive focusing on elephants with Kilimanjaro backdrop. Sunset drinks at Observation Hill.$j$, 'en', $j$d1a7c64fd28e6ef03a2d87e0$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$260dd5d34e585a1873b75c99$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full day in Amboseli with morning and afternoon game drives$j$, $j$Full day in Amboseli with morning and afternoon game drives. Visit Maasai community project. Optional guided nature walk with armed ranger.$j$, 'en', $j$260dd5d34e585a1873b75c99$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$249587155fa9bead17c12dbc$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Transfer to Tsavo West via Chyulu Hills$j$, $j$Transfer to Tsavo West via Chyulu Hills. Afternoon visit to Mzima Springs and volcanic formations. Evening presentation on Tsavo's famous lions.$j$, 'en', $j$249587155fa9bead17c12dbc$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$78a0305cc4509890dbaa6a56$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Tsavo West exploration including Rhino Sanctuary, Ngulia Rhino Sanctuary, and possibly…$j$, $j$Tsavo West exploration including Rhino Sanctuary, Ngulia Rhino Sanctuary, and possibly leopard sightings. Night game drive in private area.$j$, 'en', $j$78a0305cc4509890dbaa6a56$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$b91d1515c0ec84200f22fb77$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Transfer to Tsavo East for 'red elephant' viewing and Aruba Dam waterhole observation$j$, $j$Transfer to Tsavo East for 'red elephant' viewing and Aruba Dam waterhole observation. Afternoon game drive focusing on predators.$j$, 'en', $j$b91d1515c0ec84200f22fb77$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$1ea8c985b9042e677be328a7$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Final morning game drive before returning to Nairobi with picnic lunch en route$j$, $j$Final morning game drive before returning to Nairobi with picnic lunch en route. Day room available for evening departures.$j$, 'en', $j$1ea8c985b9042e677be328a7$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$95247d3114d5bab64c976e3f$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Iconic Kilimanjaro views with elephant herds at sunrise in Amboseli$j$, 'en', $j$95247d3114d5bab64c976e3f$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$17f2b9e6540fa0c227739c14$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Track the famous 'Man-eaters of Tsavo' descendants in Tsavo West$j$, 'en', $j$17f2b9e6540fa0c227739c14$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$36d9814330ff09b6c81220f2$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Underground viewing hide at Mzima Springs to watch hippos underwater$j$, 'en', $j$36d9814330ff09b6c81220f2$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$fbddc673f019c567538cecd8$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Visit Shetani Lava Flows with geological interpretation$j$, 'en', $j$fbddc673f019c567538cecd8$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$6a22bbf02cc75ee39fa59e6b$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Night game drive in Tsavo's private conservancy$j$, 'en', $j$6a22bbf02cc75ee39fa59e6b$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$083e22dcc1d9bb4fb880609b$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Photography workshop focusing on landscape and wildlife composition$j$, 'en', $j$083e22dcc1d9bb4fb880609b$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$f13050d7b2b0d9ff3f5df515$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Birdwatching for Tsavo's 500+ species including migratory birds$j$, 'en', $j$f13050d7b2b0d9ff3f5df515$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$8047a9292756b04a7973fce0$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Swimming pool relaxation with wilderness views at eco-lodges$j$, 'en', $j$8047a9292756b04a7973fce0$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$9f6cd8aa103e6bbd29ff5f11$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Eco-lodge accommodations with swimming pools$j$, 'en', $j$9f6cd8aa103e6bbd29ff5f11$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$1e65aa5319152eac1a357a35$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All meals from dinner Day 1 to lunch Day 7$j$, 'en', $j$1e65aa5319152eac1a357a35$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$17de9973937bf0f06c7749a6$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private 4x4 safari vehicle with pop-up roof and charging stations$j$, 'en', $j$17de9973937bf0f06c7749a6$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$635530567c3d336f45025db4$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Professional driver-guide with 7+ years Tsavo experience$j$, 'en', $j$635530567c3d336f45025db4$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$c44d6bd83a928fa567baf475$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All park fees and conservation charges$j$, 'en', $j$c44d6bd83a928fa567baf475$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$b3d4bb6caa787e623ae6dc80$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Bottled water and soft drinks in vehicle$j$, 'en', $j$b3d4bb6caa787e623ae6dc80$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$19f1a4f8b3b663ba12352c15$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Night game drive in Tsavo West conservancy$j$, 'en', $j$19f1a4f8b3b663ba12352c15$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$18838b604d73744619b5fd36$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Community visit fees and donations$j$, 'en', $j$18838b604d73744619b5fd36$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (9, v, $j$6726d2cc6a37ab0efad433b7$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Emergency oxygen tank and first aid kit$j$, 'en', $j$6726d2cc6a37ab0efad433b7$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$1f4f070b57f0b84570ea6721$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International flights to Nairobi$j$, 'en', $j$1f4f070b57f0b84570ea6721$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$a2c8da2caf32ccd49cd15316$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Travel insurance with medical evacuation$j$, 'en', $j$a2c8da2caf32ccd49cd15316$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$32479ac7381883e35d9ef11f$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Alcoholic beverages and premium wines$j$, 'en', $j$32479ac7381883e35d9ef11f$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$3bbf39dcdbd9b4b112eaa4da$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Gratuities for guides and lodge staff$j$, 'en', $j$3bbf39dcdbd9b4b112eaa4da$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$94f9c6fe3d8d9ec3af3a066b$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Optional activities like bush walks ($65)$j$, 'en', $j$94f9c6fe3d8d9ec3af3a066b$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$c5266ec1beb148c9fec264f6$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Visa for Kenya (obtainable online)$j$, 'en', $j$c5266ec1beb148c9fec264f6$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (7, v, $j$783112ef4e259bff6526801a$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal shopping and souvenirs$j$, 'en', $j$783112ef4e259bff6526801a$j$);
  END IF;
END $do$;
-- products-data.ts: safari-twiga
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$safari-twiga$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$safari-twiga$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      5, (SELECT id FROM media WHERE url = $j$/images%20(1).jpeg$j$ ORDER BY id LIMIT 1),
      $j$easy$j$::enum_tours_facts_pace, NULL, 10) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Safari Twiga: Nairobi's Wildlife & Conservation Experience$j$, $j$Get up close with graceful Rothschild's giraffes and Kenya's vibrant wildlife on this 5-day conservation-focused journey through Nairobi's urban wilderness and sanctuary havens.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "Designed for families, first-time Africa visitors, and wildlife enthusiasts with limited time, Safari Twiga offers an immersive introduction to Kenya's conservation triumphs. Begin at the world-famous Giraffe Centre, where you can hand-feed endangered Rothschild's giraffes from a raised platform while learning about breeding programs that saved this subspecies from extinction. Continue to Nairobi National Park - the world's only wildlife capital where lions hunt with a skyline backdrop. Visit the David Sheldrick Wildlife Trust to witness the heroic work of elephant keepers fostering orphaned calves. Explore the Karen Blixen Museum and nearby animal sanctuaries. Each experience highlights successful conservation stories while providing intimate wildlife encounters. The pace allows for relaxation and cultural exploration in Nairobi's vibrant arts and dining scene. Perfect for adding a wildlife component to business trips or as an educational family holiday.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Boutique hotels with character", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: Year-round; Nairobi's climate is consistently mild", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Weekly every Monday and Friday", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: All ages welcome (special rates for children)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: 100% of conservation fees go directly to projects", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Easy (all activities vehicle-based)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Maximum 10 travelers", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Safari Twiga: 5-Day Nairobi Wildlife & Conservation Tour$j$, $j$5-day family-friendly Nairobi safari featuring giraffe feeding, elephant orphanage visit, and Nairobi National Park game drives. Perfect introduction to Kenya's wildlife conservation.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 280000, 280000, 280000, 280000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$b9851fd86658965200e61dfd$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival at Nairobi$j$, $j$Arrival at Nairobi. Transfer to Giraffe Manor or equivalent. Evening briefing and welcome cocktail overlooking giraffe paddock.$j$, 'en', $j$b9851fd86658965200e61dfd$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$f0ecc4dfe5ee61e82806119d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning at Giraffe Centre with keeper talk$j$, $j$Morning at Giraffe Centre with keeper talk. Afternoon visit to David Sheldrick Wildlife Trust for 11am public feeding. Lunch at nearby restaurant.$j$, 'en', $j$f0ecc4dfe5ee61e82806119d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$2e077b04cfccaf35e76e2480$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full day Nairobi National Park game drive with picnic lunch at Impala Observation Point$j$, $j$Full day Nairobi National Park game drive with picnic lunch at Impala Observation Point. Afternoon visit to Animal Orphanage.$j$, 'en', $j$2e077b04cfccaf35e76e2480$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$20c635fd10aa10aaa0f8f919$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Cultural day - Karen Blixen Museum, Kazuri Beads, and optional lunch at The Talisman$j$, $j$Cultural day - Karen Blixen Museum, Kazuri Beads, and optional lunch at The Talisman. Evening at Bomas of Kenya for traditional performances.$j$, 'en', $j$20c635fd10aa10aaa0f8f919$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$89298dbd63c8fa2c276a08ff$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Visit Nairobi National Museum and Snake Park$j$, $j$Visit Nairobi National Museum and Snake Park. Transfer to airport for departure with conservation pack including adoption certificate.$j$, 'en', $j$89298dbd63c8fa2c276a08ff$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$998c98b8f84183317008efca$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Kiss a giraffe at the Giraffe Centre's feeding platform$j$, 'en', $j$998c98b8f84183317008efca$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$c10320b27c5e39b19d22aaa7$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Game drive in Nairobi National Park with city skyline photos$j$, 'en', $j$c10320b27c5e39b19d22aaa7$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$85d78a60afe585762307ce57$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Private fostering session at David Sheldrick elephant orphanage$j$, 'en', $j$85d78a60afe585762307ce57$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$2e8f48f50db89e6e9ab446c7$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Visit to Nairobi Animal Orphanage for rescued wildlife$j$, 'en', $j$2e8f48f50db89e6e9ab446c7$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$449b06495a91dcb2afc26fe5$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Karen Blixen Museum tour (Out of Africa author)$j$, 'en', $j$449b06495a91dcb2afc26fe5$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$080e7929d8e10d3e2a3c407f$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Kazuri Beads women's cooperative supporting single mothers$j$, 'en', $j$080e7929d8e10d3e2a3c407f$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$f472bc5bdeb94d08bd94979c$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Nairobi National Museum's extensive natural history collection$j$, 'en', $j$f472bc5bdeb94d08bd94979c$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$8d83cab0570b968225de8e4f$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Bomas of Kenya cultural show with traditional dances$j$, 'en', $j$8d83cab0570b968225de8e4f$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$b47c690656d97aed2e685c5a$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Boutique hotel accommodations (Giraffe Manor if available)$j$, 'en', $j$b47c690656d97aed2e685c5a$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$28288deeba758d73ca2923b5$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All meals as specified in itinerary$j$, 'en', $j$28288deeba758d73ca2923b5$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$a5a2122e5372beb912c8144d$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private vehicle with driver-guide$j$, 'en', $j$a5a2122e5372beb912c8144d$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$a72bf862cc4b9e7e86c05fd2$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All entrance fees and conservation donations$j$, 'en', $j$a72bf862cc4b9e7e86c05fd2$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$3c619e165517f0147a6311f3$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Giraffe and elephant adoption certificates$j$, 'en', $j$3c619e165517f0147a6311f3$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$a743a8c6207843cf61ceb99f$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Bottled water throughout$j$, 'en', $j$a743a8c6207843cf61ceb99f$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$64f1ba2e882ceba767ad1b6a$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Cultural performance tickets$j$, 'en', $j$64f1ba2e882ceba767ad1b6a$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$0b40cc3c636f3a79f045ba1e$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$24-hour concierge service in Nairobi$j$, 'en', $j$0b40cc3c636f3a79f045ba1e$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$7bcc6b96330aa81bea88f2c8$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International flights$j$, 'en', $j$7bcc6b96330aa81bea88f2c8$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$b26c8423e49561c8e2a0fb0b$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Travel insurance$j$, 'en', $j$b26c8423e49561c8e2a0fb0b$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$09802db006f1f8d762bb905b$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Optional activities like helicopter tour$j$, 'en', $j$09802db006f1f8d762bb905b$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$e931b8a3cf90cc30011d0397$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Premium dining outside included meals$j$, 'en', $j$e931b8a3cf90cc30011d0397$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$60465f2b805f833a66bac9e6$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Shopping and personal expenses$j$, 'en', $j$60465f2b805f833a66bac9e6$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$d0b74feffe047dccf668f50d$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Airport departure taxes$j$, 'en', $j$d0b74feffe047dccf668f50d$j$);
  END IF;
END $do$;
-- products-data.ts: golden-monkey-gorilla-trekking-safari
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$golden-monkey-gorilla-trekking-safari$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$golden-monkey-gorilla-trekking-safari$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      6, (SELECT id FROM media WHERE url = $j$/gorilla-trekking-difficulty.jpg$j$ ORDER BY id LIMIT 1),
      $j$moderate$j$::enum_tours_facts_pace, NULL, 6) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Golden Monkey & Gorilla Trekking: Rwanda's Primate Paradise$j$, $j$Trek into Rwanda's misty Volcanoes National Park to meet playful golden monkeys and gaze into the wise eyes of mountain gorillas during this 6-day primate-focused adventure in Africa's most biodiverse forests.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "This transformative 6-day journey takes you deep into the Virunga Mountains, home to approximately one-third of the world's remaining mountain gorillas. Your adventure begins in Kigali, Africa's cleanest and safest capital, before ascending into the volcanic highlands. Each trek is a unique experience - hiking through bamboo forests, giant lobelias, and montane vegetation with expert trackers who've spent years with specific gorilla families. The moment you lock eyes with a silverback gorilla is life-changing. Equally magical are the golden monkeys - endangered, energetic primates that leap through bamboo canopy in troupes of up to 80 individuals. Beyond trekking, you'll learn about Rwanda's remarkable conservation success story, visit community projects benefiting from tourism revenue, and reflect on the nation's history at the powerful Kigali Genocide Memorial. Accommodation in eco-lodges with fireplace-heated rooms complements days spent in cool mountain forests.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Eco-lodges with volcanic views and sustainability certifications", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: June-September and December-February (dry seasons for easier trekking)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Monthly on 5th and 20th (permits limited)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: Minimum 15 years for gorilla trekking", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: 100% of permit fees support conservation and local communities", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Moderate to Challenging (altitude 2,500-3,000m, uneven terrain)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Maximum 6 travelers for personalized trekking", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Rwanda Gorilla & Golden Monkey Trekking: 6-Day Primate Safari$j$, $j$Trek to see mountain gorillas and golden monkeys in Rwanda's Volcanoes National Park. Includes permits, eco-lodges, expert guides. Life-changing primate encounters.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 520000, 520000, 520000, 520000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$4fe1ed9bce9013084d764150$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival Kigali$j$, $j$Arrival Kigali. Genocide Memorial visit (profound but optional). Transfer to Volcanoes National Park area. Lodge orientation and trek briefing.$j$, 'en', $j$4fe1ed9bce9013084d764150$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$2075b4b69ba1e407c5e2510f$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$First gorilla trekking experience (2-6 hours depending on group location)$j$, $j$First gorilla trekking experience (2-6 hours depending on group location). Celebration dinner with fellow trekkers sharing experiences.$j$, 'en', $j$2075b4b69ba1e407c5e2510f$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$79b3e3e7e5e480a9474f9cd4$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Golden monkey trek (easier, 1-3 hours)$j$, $j$Golden monkey trek (easier, 1-3 hours). Afternoon visit to Iby'Iwacu Cultural Village or community projects.$j$, 'en', $j$79b3e3e7e5e480a9474f9cd4$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$4dd8a21b55853263ccf3d667$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Optional second gorilla trek (additional permit required) or Dian Fossey hike$j$, $j$Optional second gorilla trek (additional permit required) or Dian Fossey hike. Evening Rwandan cooking experience.$j$, 'en', $j$4dd8a21b55853263ccf3d667$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$65c165128da46f93cc40e51e$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Return to Kigali via twin lakes with canoe ride$j$, $j$Return to Kigali via twin lakes with canoe ride. Final shopping at Caplaki Craft Village. Farewell dinner at renowned restaurant.$j$, 'en', $j$65c165128da46f93cc40e51e$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$8d6137a142bc260f2e71a83a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Kigali city tour including Kimironko Market and art galleries$j$, $j$Kigali city tour including Kimironko Market and art galleries. Transfer to airport for departure.$j$, 'en', $j$8d6137a142bc260f2e71a83a$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$e83aa0cd88cccc9b5c319f0d$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$One-hour observation of mountain gorilla family in natural habitat$j$, 'en', $j$e83aa0cd88cccc9b5c319f0d$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$b2e293caad143ebd04e71f8f$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Golden monkey trekking through bamboo forests$j$, 'en', $j$b2e293caad143ebd04e71f8f$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$6c6334a16e678396891634a3$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Visit to Ellen DeGeneres Campus of the Dian Fossey Gorilla Fund$j$, 'en', $j$6c6334a16e678396891634a3$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$835b88365de95905320f1e2d$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Hike to Dian Fossey's grave and former research center$j$, 'en', $j$835b88365de95905320f1e2d$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$8f893ff0aeb0878f564d4e84$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Traditional Rwandan cooking class with local family$j$, 'en', $j$8f893ff0aeb0878f564d4e84$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$c7508c0d74d98b4e51d6d04d$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Guided nature walk to spot 200+ bird species including Rwenzori turaco$j$, 'en', $j$c7508c0d74d98b4e51d6d04d$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$d2bceeb56aa17a8a10d764b8$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Cultural evening with Intore dancers and traditional music$j$, 'en', $j$d2bceeb56aa17a8a10d764b8$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$7f61949ee529b9391218fb4b$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Scenic hike to volcanic lakes Burera and Ruhondo$j$, 'en', $j$7f61949ee529b9391218fb4b$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$819cb49a645d2654ead679b8$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$One gorilla trekking permit ($1,500 value)$j$, 'en', $j$819cb49a645d2654ead679b8$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$0c5c701e363964f9fce5e409$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$One golden monkey trekking permit ($100 value)$j$, 'en', $j$0c5c701e363964f9fce5e409$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$f61c19aaf2dfd9c4b180ff0b$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Eco-lodge accommodations with fireplace heating$j$, 'en', $j$f61c19aaf2dfd9c4b180ff0b$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$ce632a318b4e24e0ed1a02c1$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All meals from dinner Day 1 to breakfast Day 6$j$, 'en', $j$ce632a318b4e24e0ed1a02c1$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$786d1ddc87e43a36f29bd921$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Professional English/French speaking guide and trackers$j$, 'en', $j$786d1ddc87e43a36f29bd921$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$3cde57917633b6712ddc6222$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$4x4 transfers throughout itinerary$j$, 'en', $j$3cde57917633b6712ddc6222$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$55b9dad0980b529924adc4b3$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Porter hire for trekking (one per person)$j$, 'en', $j$55b9dad0980b529924adc4b3$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$4447b40fcff9038d17263f0f$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All conservation fees and community contributions$j$, 'en', $j$4447b40fcff9038d17263f0f$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (9, v, $j$d7e3608fe635d4d0ecf8ace4$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Complimentary trekking pole and waterproof backpack$j$, 'en', $j$d7e3608fe635d4d0ecf8ace4$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$36ebe54e762f96d88d1bb9ee$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International flights to Kigali$j$, 'en', $j$36ebe54e762f96d88d1bb9ee$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$58f179ecc195234e2fae15e3$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Rwanda visa ($50, obtainable on arrival for most nationals)$j$, 'en', $j$58f179ecc195234e2fae15e3$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$e98dce623b034980c5f9e241$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Optional second gorilla permit ($1,500)$j$, 'en', $j$e98dce623b034980c5f9e241$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$bf60e1b8f243b0e6f2543a42$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Travel insurance including helicopter evacuation$j$, 'en', $j$bf60e1b8f243b0e6f2543a42$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$dd5814ea5c6cdaf35fb13192$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Alcoholic beverages beyond house selections$j$, 'en', $j$dd5814ea5c6cdaf35fb13192$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$342bf0169f62d3bdcae18b04$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal trekking gear (rentals available)$j$, 'en', $j$342bf0169f62d3bdcae18b04$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (7, v, $j$67e592023f55a43e4a0966fa$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Tips for guides, trackers, and porters$j$, 'en', $j$67e592023f55a43e4a0966fa$j$);
  END IF;
END $do$;
-- products-data.ts: luxury-roof-top-camping
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$luxury-roof-top-camping$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$luxury-roof-top-camping$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$standard$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$kenya$j$),
      4, (SELECT id FROM media WHERE url = $j$/safari-vehicle-extended-roof-for-photography.jpg$j$ ORDER BY id LIMIT 1),
      $j$easy$j$::enum_tours_facts_pace, NULL, 4) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Luxury Roof-Top Camping: Under African Stars$j$, $j$Sleep under a blanket of stars in Kenya's wilderness, where innovative luxury roof-top tents blend adventure with indulgence, gourmet cuisine, and exclusive wildlife access in private conservancies.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "This 4-day glamping experience redefines traditional camping with state-of-the-art roof-top tents mounted on customized 4x4 vehicles. Each evening, your guide transforms the vehicle into a luxurious bedroom with memory foam mattresses, high-quality linen, mosquito nets, and private balcony overlooking the wilderness. As the sun sets, gather around the campfire for sundowner drinks while your private chef prepares a three-course dinner using fresh, local ingredients. Wake to coffee delivered to your tent as dawn breaks over the savanna. The mobility of roof-top camping allows access to remote areas where traditional lodges don't exist, increasing wildlife sightings. Experience the magic of hearing lions roar nearby while safely elevated above ground level. Ideal for couples seeking romance, photographers wanting unique perspectives, or adventurers craving authenticity without sacrificing comfort. Locations vary seasonally between Amboseli, Maasai Mara, and Laikipia plateau.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Custom roof-top tents on 4x4 vehicles", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: Year-round; dry seasons preferable (June-October, January-February)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Weekly on Mondays and Thursdays", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: Minimum 12 years (younger by arrangement)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: Leave-no-trace principles, solar power, support local communities", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Easy (all camp setup handled by staff)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Maximum 4 travelers (2 vehicles)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Luxury Roof-Top Camping Safari: 4-Day Glamping Adventure$j$, $j$Sleep in luxury roof-top tents under African stars. Gourmet meals, private conservancy access, and exclusive wildlife viewing. Ultimate glamping experience for couples and adventurers.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 350000, 350000, 350000, 350000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$d6cb84be02baefce7fd90767$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Nairobi pick-up$j$, $j$Nairobi pick-up. Scenic drive to conservancy. Camp setup lesson. Evening game drive followed by welcome champagne dinner under stars.$j$, 'en', $j$d6cb84be02baefce7fd90767$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$d5b998204b7f127ea4214d0c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Sunrise game drive with bush breakfast$j$, $j$Sunrise game drive with bush breakfast. Afternoon siesta in camp. Evening walking safari and night drive with spotlights.$j$, 'en', $j$d5b998204b7f127ea4214d0c$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$e9b7e38898452a087a5517c4$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full day exploration moving camp to new location based on wildlife movements$j$, $j$Full day exploration moving camp to new location based on wildlife movements. Picnic lunch at scenic viewpoint. Sundowners at special sunset spot.$j$, 'en', $j$e9b7e38898452a087a5517c4$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$b7ce7c145cbee68ec0d56119$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Final morning game drive with farewell brunch$j$, $j$Final morning game drive with farewell brunch. Return to Nairobi with drop-off at airport or hotel by 4pm.$j$, 'en', $j$b7ce7c145cbee68ec0d56119$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$fcc9302b36f24121db41fa33$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Sleep in luxury roof-top tents with 360-degree wilderness views$j$, 'en', $j$fcc9302b36f24121db41fa33$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$09bfd11e3bb78757d465b856$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Private chef preparing gourmet meals over campfire$j$, 'en', $j$09bfd11e3bb78757d465b856$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$ab45a514c5fc2aa70a5d088c$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Exclusive access to wildlife-rich private conservancies$j$, 'en', $j$ab45a514c5fc2aa70a5d088c$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$4b410ad9fd5c3e425198f499$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Night sky safari with astronomer guide and telescope$j$, 'en', $j$4b410ad9fd5c3e425198f499$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$7ed6683af4d231c86acab2c1$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Mobile camping allowing following wildlife migration patterns$j$, 'en', $j$7ed6683af4d231c86acab2c1$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$3e4c3da7ae6faf37e6ee0ffd$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Bush breakfast setup in scenic locations$j$, 'en', $j$3e4c3da7ae6faf37e6ee0ffd$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$eb15270e86fca0b321a8cd24$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Guided bush walks with armed ranger for close encounters$j$, 'en', $j$eb15270e86fca0b321a8cd24$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$cafdea0bd7a91536e137d140$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Solar-powered charging stations and Wi-Fi hotspot$j$, 'en', $j$cafdea0bd7a91536e137d140$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$072eee5dd5007fab09f87dee$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Luxury roof-top tent accommodations with bedding$j$, 'en', $j$072eee5dd5007fab09f87dee$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$872b72747a8ee58ef4a4f862$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All meals - gourmet camp cuisine with paired South African wines$j$, 'en', $j$872b72747a8ee58ef4a4f862$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$f0648d28149165687874edc8$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private 4x4 vehicle with guide and spotter$j$, 'en', $j$f0648d28149165687874edc8$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$c6f8d0b719da33d3f0378e9d$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private conservancy fees (no crowds)$j$, 'en', $j$c6f8d0b719da33d3f0378e9d$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$2f9244b2e8ea91745676d93a$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All camping equipment and hot bush showers$j$, 'en', $j$2f9244b2e8ea91745676d93a$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$e9c18f066aa8894cd5d6c6db$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Chef and camp staff$j$, 'en', $j$e9c18f066aa8894cd5d6c6db$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$250994fdfa0cb9467980ad37$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Bush walks with armed ranger$j$, 'en', $j$250994fdfa0cb9467980ad37$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$e911fbf021b1321d3d8dc033$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Night game drives with specialized equipment$j$, 'en', $j$e911fbf021b1321d3d8dc033$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (9, v, $j$770440287eae332e63d70c61$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Star-gazing session with laser pointer$j$, 'en', $j$770440287eae332e63d70c61$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$18cadcfd65d49e114a019181$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International flights$j$, 'en', $j$18cadcfd65d49e114a019181$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$6cd3687f8b596d5ff8aacf35$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Travel insurance$j$, 'en', $j$6cd3687f8b596d5ff8aacf35$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$5008df101a1bd8e67633eb43$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Premium champagne and spirits (standard included)$j$, 'en', $j$5008df101a1bd8e67633eb43$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$0e7beb8a26dc5698b41e4d89$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal camping gear (provided)$j$, 'en', $j$0e7beb8a26dc5698b41e4d89$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$7e51d916dfcb9550ba537016$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Gratuities for camp team$j$, 'en', $j$7e51d916dfcb9550ba537016$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$fcc3fc9ba461ead1a5cb7014$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Nairobi accommodation before/after$j$, 'en', $j$fcc3fc9ba461ead1a5cb7014$j$);
  END IF;
END $do$;
-- products-data.ts: rwanda-accessible-gorilla-safari-3
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$rwanda-accessible-gorilla-safari-3$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$rwanda-accessible-gorilla-safari-3$j$, false, false, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$rwanda$j$),
      5, (SELECT id FROM media WHERE url = $j$/gorilla-trekking-experience-13.jpg$j$ ORDER BY id LIMIT 1),
      $j$moderate$j$::enum_tours_facts_pace, NULL, 4) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Rwanda Accessible Gorilla Safari: Inclusive Adventure in Volcanoes National Park$j$, $j$Embark on a life-changing accessible gorilla trekking adventure in Rwanda, featuring custom-designed wheelchair vehicles, trained support teams, and tailored experiences ensuring comfort and safety for travelers with mobility challenges.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "This pioneering 5-day accessible safari makes Rwanda's incredible gorilla encounters available to everyone. We've worked with accessibility experts and the Rwanda Development Board to create an experience that maintains adventure while ensuring safety and comfort. Our custom-modified 4x4 vehicles feature wheelchair lifts, secure restraint systems, and adjustable seating. In Volcanoes National Park, trained porters and guides provide personalized assistance along accessible trails to gorilla families located in more accessible terrain. The experience includes comprehensive briefings, adaptive equipment, and flexible pacing. Beyond trekking, enjoy Kigali's wheelchair-accessible attractions including the Genocide Memorial, craft markets with ramps, and specially selected restaurants. Accommodations feature roll-in showers, grab bars, and accessible common areas. This safari represents our commitment to making Africa's wonders accessible to all travelers, with dignity and adventure intact.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Specially selected accessible lodges with required features", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: June-September (dry season for easier terrain)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Monthly departures with advance booking required", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: Minimum 16 years for gorilla trekking", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: Trains and employs people with disabilities in tourism, supports accessible infrastructure development", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Moderate (adapted to individual abilities)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Maximum 4 travelers (including wheelchair users) with 1:2 staff ratio", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Rwanda Accessible Gorilla Safari: Wheelchair-Friendly Trekking$j$, $j$Fully accessible 5-day gorilla trekking safari in Rwanda. Custom vehicles, trained support team, and adapted experiences for travelers with mobility challenges. Inclusive adventure.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 350000, 350000, 350000, 350000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$92bde8d3fc9c72e9216122ce$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival Kigali International Airport with accessibility meet-and-greet$j$, $j$Arrival Kigali International Airport with accessibility meet-and-greet. Transfer in accessible vehicle to Volcanoes area lodge. Accessibility audit of accommodations.$j$, 'en', $j$92bde8d3fc9c72e9216122ce$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$6d655f5f9e2cc56d65372ea0$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Accessible gorilla trekking with full support team$j$, $j$Accessible gorilla trekking with full support team. Flexible duration based on needs. Celebration dinner at lodge.$j$, 'en', $j$6d655f5f9e2cc56d65372ea0$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$a70e4b4ac8853465f98957cc$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Golden monkey accessible trekking or cultural visit to Iby'Iwacu adapted experience$j$, $j$Golden monkey accessible trekking or cultural visit to Iby'Iwacu adapted experience. Afternoon relaxation or optional accessible activities.$j$, 'en', $j$a70e4b4ac8853465f98957cc$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$2f1e40ff66fc0d37909c5f19$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Return to Kigali$j$, $j$Return to Kigali. Genocide Memorial visit. Accessible city tour including markets and cultural centers. Farewell dinner at accessible restaurant.$j$, 'en', $j$2f1e40ff66fc0d37909c5f19$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$88948a5de70ecbf9e5213c6a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Final accessibility shopping at recommended outlets$j$, $j$Final accessibility shopping at recommended outlets. Transfer to airport with assistance through check-in and security.$j$, 'en', $j$88948a5de70ecbf9e5213c6a$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$864be9fd8caae45643065f0d$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Accessible gorilla trekking with trained support team (1 guide per traveler)$j$, 'en', $j$864be9fd8caae45643065f0d$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$0ad24e31d5e3cff31f1aaf50$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Custom wheelchair-accessible vehicle with lift system$j$, 'en', $j$0ad24e31d5e3cff31f1aaf50$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$1ac2dd41a82da81232dca40a$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Adaptive trekking equipment including all-terrain wheelchair available$j$, 'en', $j$1ac2dd41a82da81232dca40a$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$a7bfcc760e6ff21abd5051bb$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Accessible trails to gorilla families with gentler gradients$j$, 'en', $j$a7bfcc760e6ff21abd5051bb$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$cbe9bf408ab08548aa564d22$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Kigali Genocide Memorial with full accessibility features$j$, 'en', $j$cbe9bf408ab08548aa564d22$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$d6221ce589b0002eb40fd593$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Accessible accommodations with roll-in showers and appropriate facilities$j$, 'en', $j$d6221ce589b0002eb40fd593$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$0ecbc959e4ffaf3d14434b81$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Local sign language interpreter available (advance notice)$j$, 'en', $j$0ecbc959e4ffaf3d14434b81$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$11e32c94671c70a997afd49a$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Medical support team familiar with accessibility needs$j$, 'en', $j$11e32c94671c70a997afd49a$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$880654ae8a75b5e2f2b0b218$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Gorilla trekking permit for accessible trail$j$, 'en', $j$880654ae8a75b5e2f2b0b218$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$687269de6496a1a70a7cbb6d$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Custom accessible 4x4 vehicle with driver-guide$j$, 'en', $j$687269de6496a1a70a7cbb6d$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$416ae4800207285c23b63944$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Two trained support staff per wheelchair user$j$, 'en', $j$416ae4800207285c23b63944$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$196500d2743a3cf2ee422141$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All-terrain wheelchair rental if needed$j$, 'en', $j$196500d2743a3cf2ee422141$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$dfdf76a67a629ac4810f0131$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Accessible lodge accommodations with required features$j$, 'en', $j$dfdf76a67a629ac4810f0131$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$33fe27dd2fa9876db16245a4$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All meals and bottled water$j$, 'en', $j$33fe27dd2fa9876db16245a4$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$d5aa4852d26334c2dc40d9c4$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All entrance fees and community contributions$j$, 'en', $j$d5aa4852d26334c2dc40d9c4$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$426af25979957dfcaef84120$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Medical support team on call 24/7$j$, 'en', $j$426af25979957dfcaef84120$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (9, v, $j$19ad6fe4b583950fbc4a40cf$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Accessibility equipment transfer between locations$j$, 'en', $j$19ad6fe4b583950fbc4a40cf$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$4421709ebbd4b1c17c717e54$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International flights$j$, 'en', $j$4421709ebbd4b1c17c717e54$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$50e35a35d36c7970ce33a5f5$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Specialized personal medical equipment$j$, 'en', $j$50e35a35d36c7970ce33a5f5$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$b3e943a8562a7487c47cf10f$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal care attendant (can be arranged)$j$, 'en', $j$b3e943a8562a7487c47cf10f$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$eea583024548be5546138bfc$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Additional accessibility equipment beyond standard$j$, 'en', $j$eea583024548be5546138bfc$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$390e6a2ad29820146d282c8c$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Travel insurance covering pre-existing conditions$j$, 'en', $j$390e6a2ad29820146d282c8c$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$98acd6cd4e7e584426146a60$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Optional accessible activities beyond itinerary$j$, 'en', $j$98acd6cd4e7e584426146a60$j$);
  END IF;
END $do$;
-- products-data.ts: zanzibar-getaway
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$zanzibar-getaway$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$zanzibar-getaway$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$tanzania$j$),
      5, (SELECT id FROM media WHERE url = $j$/zanzibar-accessible-beach-01.jpg$j$ ORDER BY id LIMIT 1),
      $j$easy$j$::enum_tours_facts_pace, 1, 6) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Zanzibar Accessible Getaway: Inclusive Beach Resort & Spice Island Discovery$j$, $j$Relax into the rhythm of the Indian Ocean on this fully accessible Zanzibar escape. Designed for travelers with mobility devices, this tour combines beachfront wheelchair-friendly resorts, private adapted transfers, and gentle cultural tours of Stone Town and local spice farms.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "This 5-day accessible retreat proves that paradise has no barriers. We have partnered with beachfront properties in Zanzibar that feature pool hoists, ramps to the sand, and roll-in showers with grab bars. Your journey begins with a smooth VIP accessibility transfer from Abeid Amani Karume International Airport. In Stone Town, we navigate the narrow streets with adapted vehicles and trained guides, ensuring visits to the Old Fort and Forodhani Gardens are stress-free. The highlight is a private, accessible Spice Tour where raised garden beds and paved pathways allow wheelchair users to smell, touch, and taste Zanzibar’s famous cloves and vanilla without leaving their chairs. Unlike standard tours, our beach days include accessible dhows (traditional boats) for sunset cruises and adaptive water sports equipment. This itinerary is slow-paced, focused on rest, dignity, and genuine cultural immersion.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Selected accessible resorts in Nungwi and Stone Town with verified roll-in showers, pool hoists, and step-free access", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: June-October & December-February (Dry, cooler months for easy mobility)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Daily departures; private tours available year-round", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: No age restriction; family-friendly", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: Partners with inclusive Zanzibar cooperatives and employs guides with disabilities; supports accessible tourism certification initiatives in Tanzania", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Easy (Accessible for all mobility levels)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Private Tour: 1-6 travelers (wheelchair accessible vehicle)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Zanzibar Accessible Beach & Spice Tour: Wheelchair-Friendly$j$, $j$Discover accessible Zanzibar: Beach wheelchairs, adapted spice tours, and step-free Stone Town visits. Inclusive luxury with private transfers and trained support staff.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 290000, 290000, 290000, 290000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$ebf8d38151a074de23bd2733$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival Zanzibar (ZNZ)$j$, $j$Arrival Zanzibar (ZNZ). Accessibility meet-and-assist. Transfer in wheelchair lift-equipped van to Nungwi accessible resort. Resort accessibility orientation and welcome dinner.$j$, 'en', $j$ebf8d38151a074de23bd2733$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$ad6fbaa9b2ab8b6206e14aac$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Morning leisure at beachfront accessible pool$j$, $j$Morning leisure at beachfront accessible pool. Optional adaptive snorkeling (advance notice). Afternoon private accessible Spice Tour with paved pathways and planting beds at viewing height.$j$, 'en', $j$ad6fbaa9b2ab8b6206e14aac$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$fd32ebd71b2009fba5c2036c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Transfer to Stone Town$j$, $j$Transfer to Stone Town. Accessible city tour: Forodhani Gardens, Old Fort (ramp access), and House of Wonders exterior viewing. Evening accessible dhow cruise with adapted boarding.$j$, 'en', $j$fd32ebd71b2009fba5c2036c$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$2df8eabd067bb1d0ffcd3955$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Swahili cooking class at accessible community center (adapted workstations)$j$, $j$Swahili cooking class at accessible community center (adapted workstations). Farewell beachside dinner with live music.$j$, 'en', $j$2df8eabd067bb1d0ffcd3955$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$774ce66dcb1683c871084af7$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Accessible souvenir shopping$j$, $j$Accessible souvenir shopping. Private transfer to airport with full assistance through check-in and security.$j$, 'en', $j$774ce66dcb1683c871084af7$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$e1f05f11ef1714ce94397488$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Fully accessible beachfront resort with pool hoist and beach wheelchair available$j$, 'en', $j$e1f05f11ef1714ce94397488$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$1409af47487137e7050b5745$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Private accessible spice tour with raised garden viewing platforms$j$, 'en', $j$1409af47487137e7050b5745$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$762b921f574536cd8158baa4$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Stone Town accessible heritage walk (flat-route adaptation)$j$, 'en', $j$762b921f574536cd8158baa4$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$e1f29ba3b90af1a5e199f48e$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Sunset dhow cruise with wheelchair boarding ramp$j$, 'en', $j$e1f29ba3b90af1a5e199f48e$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$a38b1fc5db45227bf9da58d7$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Airport accessibility concierge upon arrival$j$, 'en', $j$a38b1fc5db45227bf9da58d7$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$665d08645757fbd600ecaa4f$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Specialized accessible transfer van with lift$j$, 'en', $j$665d08645757fbd600ecaa4f$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$3d05d22a107a32383241bd04$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Swahili cooking class adapted for wheelchair users$j$, 'en', $j$3d05d22a107a32383241bd04$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$8866eb28679be737cfcac748$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Visit to local artisan workshops with step-free access$j$, 'en', $j$8866eb28679be737cfcac748$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$b59ad52760314038f8d15948$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$4 nights accessible beachfront/lodge accommodation$j$, 'en', $j$b59ad52760314038f8d15948$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$13aa1ef9aad24bd8e8d40e1b$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Daily breakfast and half-board dinners$j$, 'en', $j$13aa1ef9aad24bd8e8d40e1b$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$e7f5060f137a3a3c10f78b8b$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private wheelchair-accessible vehicle with lift$j$, 'en', $j$e7f5060f137a3a3c10f78b8b$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$8e8e0b571f6acabf6ffa195b$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Accessibility-trained English-speaking guide$j$, 'en', $j$8e8e0b571f6acabf6ffa195b$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$35cb63b637fef282e0158ee1$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Stone Town accessible heritage tour$j$, 'en', $j$35cb63b637fef282e0158ee1$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$45a576ce00c89e7f97446e1f$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private spice tour (accessible route)$j$, 'en', $j$45a576ce00c89e7f97446e1f$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$3029988a00b8607d5a5ee714$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Sunset dhow cruise (wheelchair accessible boat)$j$, 'en', $j$3029988a00b8607d5a5ee714$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$50002af9b46f1f7429a51189$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All park fees and community tourism levies$j$, 'en', $j$50002af9b46f1f7429a51189$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (9, v, $j$9e15c7c4ded8cb54d54af471$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$24/7 in-country accessibility support hotline$j$, 'en', $j$9e15c7c4ded8cb54d54af471$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$4c688a0e2ec66486f3282185$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International and domestic flights$j$, 'en', $j$4c688a0e2ec66486f3282185$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$279330a3c56ce96d9a78915b$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Travel insurance (highly recommended)$j$, 'en', $j$279330a3c56ce96d9a78915b$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$46ef00c708bb120bdc0b6127$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal care assistant (can be arranged)$j$, 'en', $j$46ef00c708bb120bdc0b6127$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$18b04d082d9571da0574785c$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Alcoholic beverages and premium imported drinks$j$, 'en', $j$18b04d082d9571da0574785c$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$0a18de50deab9173f9b67c7d$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Tips and gratuities for staff$j$, 'en', $j$0a18de50deab9173f9b67c7d$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$83391187c3e8b00c85c44bd4$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Adaptive snorkeling/scuba equipment$j$, 'en', $j$83391187c3e8b00c85c44bd4$j$);
  END IF;
END $do$;
-- products-data.ts: best-of-kenya-tanzania-3
DO $do$ DECLARE v int; BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $j$best-of-kenya-tanzania-3$j$) THEN
    INSERT INTO tours (slug, generate_slug, published, featured, sample, template_id, destination_id, duration_days, hero_image_id, facts_pace, facts_group_size_min, facts_group_size_max)
    VALUES ($j$best-of-kenya-tanzania-3$j$, false, true, false, false,
      (SELECT id FROM templates WHERE variant = $j$accessible$j$::enum_templates_variant ORDER BY id LIMIT 1),
      (SELECT id FROM destinations WHERE slug = $j$multi-country$j$),
      10, (SELECT id FROM media WHERE url = $j$/wheelchair-safari-east-africa-07.jpg$j$ ORDER BY id LIMIT 1),
      $j$moderate$j$::enum_tours_facts_pace, NULL, 4) RETURNING id INTO v;
    INSERT INTO tours_locales (title, summary, description, seo_title, seo_description, _locale, _parent_id)
    VALUES ($j$Best of Kenya & Tanzania Accessible Safari: Maasai Mara to Serengeti$j$, $j$The ultimate East African accessible adventure crossing two countries. From the Maasai Mara to the Serengeti and Ngorongoro Crater, this safari features wheelchair-modified safari vehicles, accessible lodges, and expert guides trained in inclusive travel.$j$, $j${"root": {"type": "root", "format": "", "indent": 0, "version": 1, "direction": "ltr", "children": [{"type": "paragraph", "children": [{"type": "text", "text": "This 10-day cross-border safari proves that the Great Migration is for everyone. We utilize custom 4x4 safari vehicles with roof hatches adapted for wheelchair users, providing unobstructed photography and game viewing. Our routes include accessible airstrips and lodges with step-free tented suites, portable ramps, and vibrating pillow alerts for hearing-impaired guests. In the Maasai Mara, we visit accessible viewpoints and offer flexible game drives without time constraints. Crossing to Tanzania, the Serengeti Visitor Centre features paved walkways. The Ngorongoro Crater floor offers the highest concentration of wildlife and our vehicles are equipped to handle the descent safely. We provide private accessible picnic sites and consider dietary restrictions carefully. This tour includes a dedicated accessibility coordinator who handles border crossings seamlessly, ensuring travelers focus solely on the magic of the savannah.", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "heading", "tag": "h2", "children": [{"type": "text", "text": "Good to know", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Accommodation: Verified accessible lodges and tented camps with roll-in showers, raised beds for ease of transfer, and paved pathways", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Best time to travel: June-October (Dry season, optimal for vehicle access and wildlife viewing)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Departures: Guaranteed accessible departures: Jan 15, Jun 10, Jul 22, Aug 14, Sep 5, Dec 1 (private dates available)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Age and fitness: Minimum 12 years (younger considered on private basis)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Sustainability: Supports Inclusive Safari Guide Training Program; donates portion of proceeds to East African disability advocacy groups; employs guides with physical disabilities in community tourism roles", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Difficulty: Moderate (adapted with all-terrain equipment and flexible pacing)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}, {"type": "paragraph", "children": [{"type": "text", "text": "Group size: Maximum 4 travelers (exclusively for wheelchair users/families)", "detail": 0, "format": 0, "mode": "normal", "style": "", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "textFormat": 0, "version": 1}]}}$j$::jsonb, $j$Best of Kenya & Tanzania Accessible Safari: Maasai Mara to Serengeti$j$, $j$Experience the Great Migration on this fully accessible Kenya-Tanzania safari. Modified 4x4 vehicles, step-free lodges, and expert guides trained in inclusive travel.$j$, 'en', v);
    INSERT INTO tours_pricing_matrix (_order, _parent_id, id, season_id, p2, p4, p6, p8)
      SELECT row_number() OVER (ORDER BY sort_order, id), v, md5(v::text || 'price' || id::text), id, 895000, 895000, 895000, 895000 FROM seasons;
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (1, v, $j$a639bf92ae364727c6cc3f7d$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Arrival Nairobi (NBO)$j$, $j$Arrival Nairobi (NBO). Accessible transfer to Nairobi accessible hotel. Safari briefing with accessibility team.$j$, 'en', $j$a639bf92ae364727c6cc3f7d$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (2, v, $j$f06319a0d6aff2e927d312c9$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Fly to Maasai Mara (wheelchair assistance at Wilson Airport)$j$, $j$Fly to Maasai Mara (wheelchair assistance at Wilson Airport). Afternoon accessible game drive in modified 4x4.$j$, 'en', $j$f06319a0d6aff2e927d312c9$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (3, v, $j$58c10ad74189bffd26c275ac$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Full day Maasai Mara$j$, $j$Full day Maasai Mara. Private accessible picnic site. Flexible game drive duration. Optional accessible balloon safari.$j$, 'en', $j$58c10ad74189bffd26c275ac$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (4, v, $j$112ba6d0ebd4c8f548fb70a2$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Fly to Lake Manyara (Tanzania)$j$, $j$Fly to Lake Manyara (Tanzania). Accessible border transfer. Evening game drive.$j$, 'en', $j$112ba6d0ebd4c8f548fb70a2$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (5, v, $j$5978024cd7e52c30bb07fb46$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Lake Manyara National Park$j$, $j$Lake Manyara National Park. Paved accessible hippo pool and tree-top viewing platforms.$j$, 'en', $j$5978024cd7e52c30bb07fb46$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (6, v, $j$4f2b12fc8d7f89b52a6c865c$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti National Park (central)$j$, $j$Serengeti National Park (central). Accessible visitor center and wheelchair-friendly kopje viewpoints.$j$, 'en', $j$4f2b12fc8d7f89b52a6c865c$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (7, v, $j$d0e2a7c5cfe41d6c9783472a$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Serengeti National Park (central) (continued)$j$, $j$Continues from the previous day. Serengeti National Park (central). Accessible visitor center and wheelchair-friendly kopje viewpoints.$j$, 'en', $j$d0e2a7c5cfe41d6c9783472a$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (8, v, $j$396bf558b4540c8a2b5473d3$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Ngorongoro Crater descent$j$, $j$Ngorongoro Crater descent. Game drive on crater floor. Adapted lunch at accessible picnic site.$j$, 'en', $j$396bf558b4540c8a2b5473d3$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (9, v, $j$d5d74b7c1b0ca28680bd04c1$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Return to Arusha$j$, $j$Return to Arusha. Accessible city tour and Tanzanite shopping (step-free outlets). Farewell cultural dinner.$j$, 'en', $j$d5d74b7c1b0ca28680bd04c1$j$);
    INSERT INTO tours_itinerary (_order, _parent_id, id) VALUES (10, v, $j$87f7643952077fc48adc3932$j$); INSERT INTO tours_itinerary_locales (title, body, _locale, _parent_id) VALUES ($j$Transfer to Kilimanjaro Airport (JRO) with full accessibility assistance$j$, $j$Transfer to Kilimanjaro Airport (JRO) with full accessibility assistance.$j$, 'en', $j$87f7643952077fc48adc3932$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (1, v, $j$40811c16c87b039e6a942c26$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Custom safari vehicle with wheelchair lift and 360° viewing platform$j$, 'en', $j$40811c16c87b039e6a942c26$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (2, v, $j$b225c217ee7d769a4db45b48$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Accessible game drives in Maasai Mara, Serengeti & Ngorongoro$j$, 'en', $j$b225c217ee7d769a4db45b48$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (3, v, $j$ffa0c6c440acb0679c9fe573$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Step-free luxury tented camps with roll-in showers$j$, 'en', $j$ffa0c6c440acb0679c9fe573$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (4, v, $j$a6d81472d6c13eb8cff01ead$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Accessible hot air balloon safari option (advance request)$j$, 'en', $j$a6d81472d6c13eb8cff01ead$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (5, v, $j$071bf3a4965283e79627432e$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Vibrating alert systems for hearing-impaired travelers$j$, 'en', $j$071bf3a4965283e79627432e$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (6, v, $j$29f931b91d7a1e68a9fc1e88$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Private border crossing assistance (Kenya/Tanzania)$j$, 'en', $j$29f931b91d7a1e68a9fc1e88$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (7, v, $j$76eafbfdee01a5a9a128698d$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Wheelchair-accessible picnic lunches in the bush$j$, 'en', $j$76eafbfdee01a5a9a128698d$j$);
    INSERT INTO tours_highlights (_order, _parent_id, id) VALUES (8, v, $j$49e0db2faeae80822c8ed584$j$); INSERT INTO tours_highlights_locales (text, _locale, _parent_id) VALUES ($j$Cultural visit to accessible Maasai village (adapted experience)$j$, 'en', $j$49e0db2faeae80822c8ed584$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (1, v, $j$6a18a25e2b09d9e593294e9f$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All domestic flights in Kenya & Tanzania with wheelchair assistance$j$, 'en', $j$6a18a25e2b09d9e593294e9f$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (2, v, $j$84f1cf404ffc5ba7628b8211$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$9 nights accessible luxury lodges and tented camps$j$, 'en', $j$84f1cf404ffc5ba7628b8211$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (3, v, $j$3690f538b1d7f3a29e924911$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private accessible safari vehicle with pop-up roof and lift$j$, 'en', $j$3690f538b1d7f3a29e924911$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (4, v, $j$9b1b15840788f11bef92f8bc$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Services of a dedicated accessibility safari guide$j$, 'en', $j$9b1b15840788f11bef92f8bc$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (5, v, $j$c7938645657e7776a08b5d22$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All park fees, crater service fees, and government taxes$j$, 'en', $j$c7938645657e7776a08b5d22$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (6, v, $j$5521523ea02cf8df7fbcc565$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Maasai Mara & Serengeti game drives as per itinerary$j$, 'en', $j$5521523ea02cf8df7fbcc565$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (7, v, $j$46b2b6906c1fbca2e0a6a7ea$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$All meals and non-alcoholic beverages$j$, 'en', $j$46b2b6906c1fbca2e0a6a7ea$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (8, v, $j$46f93a42535faf270c1231bf$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Private border crossing facilitation$j$, 'en', $j$46f93a42535faf270c1231bf$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (9, v, $j$522ff2fcd6291695e5128437$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Wheelchair repair kit and backup vehicle support$j$, 'en', $j$522ff2fcd6291695e5128437$j$);
    INSERT INTO tours_included (_order, _parent_id, id) VALUES (10, v, $j$0731adbca1d5fec94a94952f$j$); INSERT INTO tours_included_locales (text, _locale, _parent_id) VALUES ($j$Emergency evacuation insurance coverage$j$, 'en', $j$0731adbca1d5fec94a94952f$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (1, v, $j$b0f724cf9f8b46425e277618$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$International flights$j$, 'en', $j$b0f724cf9f8b46425e277618$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (2, v, $j$0d5a06381651dd7f4d5c3d32$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Premier alcoholic beverages$j$, 'en', $j$0d5a06381651dd7f4d5c3d32$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (3, v, $j$f310a78823d7cf7f025fb98b$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Visa fees (Kenya & Tanzania E-Visa)$j$, 'en', $j$f310a78823d7cf7f025fb98b$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (4, v, $j$465d4ef910ef1817aea5e871$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal shopping and souvenirs$j$, 'en', $j$465d4ef910ef1817aea5e871$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (5, v, $j$195d16215a886db7ece1c7fc$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Personal care attendant (arranged on request)$j$, 'en', $j$195d16215a886db7ece1c7fc$j$);
    INSERT INTO tours_excluded (_order, _parent_id, id) VALUES (6, v, $j$23e4d226ba01fe6c64d8b7cd$j$); INSERT INTO tours_excluded_locales (text, _locale, _parent_id) VALUES ($j$Travel insurance (mandatory)$j$, 'en', $j$23e4d226ba01fe6c64d8b7cd$j$);
  END IF;
END $do$;

-- Optional: show a few tours in the home page "Popular safaris" row (edit the slugs, then remove the leading --)
-- UPDATE tours SET featured = true WHERE slug IN ('masai-mara-luxury-safari', 'serengeti-migration-tour', 'bwindi-gorilla-trek', 'kenya-disability-safari');

COMMIT;
