// @flow

import redis from 'redis';
import { setup } from './';

describe('simple redis spec test', () => {
  let client;
  beforeAll(async () => {
    client = redis.createClient();
    await setup();
  });

  it('should have populated the keys', (done) => {
    client.keys('*', (err, keys) => {
      try {
        expect(err).toBeNull();
        expect(keys).toContain('learning:college_training.csv');
        expect(keys).toContain('learning:college_features.csv');
        expect(keys).toContain('learning:survey_training.csv');
        expect(keys).toContain('learning:survey_features.csv');
      } catch (e) {
        done(e);
      }

      done();
    });
  });
});
