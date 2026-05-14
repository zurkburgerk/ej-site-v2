import * as migration_20260427_003218 from './20260427_003218';
import * as migration_20260430_210945 from './20260430_210945';
import * as migration_20260509_192418 from './20260509_192418';
import * as migration_20260514_012102 from './20260514_012102';

export const migrations = [
  {
    up: migration_20260427_003218.up,
    down: migration_20260427_003218.down,
    name: '20260427_003218',
  },
  {
    up: migration_20260430_210945.up,
    down: migration_20260430_210945.down,
    name: '20260430_210945',
  },
  {
    up: migration_20260509_192418.up,
    down: migration_20260509_192418.down,
    name: '20260509_192418',
  },
  {
    up: migration_20260514_012102.up,
    down: migration_20260514_012102.down,
    name: '20260514_012102'
  },
];
