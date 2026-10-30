-- =====================================================================================
-- ONLY IF YOU ALREADY RAN the earlier optional script jaetravel-budget-tours.sql (the price rule).
-- Now that you have real budget tours, that script is not needed. This puts the 14 tours it moved back
-- to the Standard template (their addresses return to /tours/<slug>). Run it BEFORE or AFTER the budget import.
--     psql "$DATABASE_URL" -f jaetravel-budget-undo.sql
-- =====================================================================================
BEGIN;
UPDATE tours
SET template_id = (SELECT id FROM templates WHERE variant = 'standard' ORDER BY id LIMIT 1)
WHERE template_id = (SELECT id FROM templates WHERE variant = 'budget' ORDER BY id LIMIT 1)
  AND slug IN (
    'aberdare-national-park-safari',
    'akagera-national-park-safari',
    'arusha-cultural-tour',
    'golden-monkey-tracking',
    'hell-gate-lake-naivasha-adventure',
    'jinja-adventure-tour',
    'kibale-national-park-chimpanzee-trekking',
    'lake-manyara-national-park-safari',
    'lake-mburo-national-park-safari',
    'lake-nakuru-flamingo-spectacle',
    'maasai-cultural-experience',
    'mikumi-national-park',
    'nyungwe-forest-canopy-walk',
    'samburu-game-reserve'
  );
COMMIT;
