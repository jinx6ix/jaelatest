import * as migration_20261028_024010_initial from './20261028_024010_initial';
import * as migration_20261029_000000_add_media_objectkey from './20261029_000000_add_media_objectkey';

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
];
