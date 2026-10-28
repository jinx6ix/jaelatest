import * as migration_20261028_024010_initial from './20261028_024010_initial';

export const migrations = [
  {
    up: migration_20261028_024010_initial.up,
    down: migration_20261028_024010_initial.down,
    name: '20261028_024010_initial'
  },
];
