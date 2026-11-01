import * as migration_20261028_024010_initial from './20261028_024010_initial';
import * as migration_20261029_000000_add_media_objectkey from './20261029_000000_add_media_objectkey';
import * as migration_20261030_000000_fix_media_objectkey from './20261030_000000_fix_media_objectkey';
import * as migration_20261101_120000_add_missing_seo_merchant_columns from './20261101_120000_add_missing_seo_merchant_columns';

export const migrations = [
  {
    up: migration_20261028_024010_initial.up,
    down: migration_20261028_024010_initial.down,
    name: '20261028_024010_initial'
  },
  {
    up: migration_20261029_000000_add_media_objectkey.up,
    down: migration_20261029_000000_add_media_objectkey.down,
    name: '20261029_000000_add_media_objectkey'
  },
  {
    up: migration_20261030_000000_fix_media_objectkey.up,
    down: migration_20261030_000000_fix_media_objectkey.down,
    name: '20261030_000000_fix_media_objectkey'
  },
  {
    up: migration_20261101_120000_add_missing_seo_merchant_columns.up,
    down: migration_20261101_120000_add_missing_seo_merchant_columns.down,
    name: '20261101_120000_add_missing_seo_merchant_columns'
  },
];
