// @flow

import redis from 'redis';
import { startService, startCoreServices } from '../../docker-compose';
import { setup } from './';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('simple redis spec test', () => {
  beforeAll(async () => {
    await startCoreServices();
  });

  beforeAll(async () => {
    // await setup();
  });

  it('should have populated the keys', () => {
    // const client = redis.createClient();
    // client.keys('*', (err, keys) => {
    //   try {
    //     expect(err).toBeNull();
    //     expect(keys).toContain('learning:college_training.csv');
    //     expect(keys).toContain('learning:college_features.csv');
    //     expect(keys).toContain('learning:survey_training.csv');
    //     expect(keys).toContain('learning:survey_features.csv');
    //   } catch (e) {
    //     done(e);
    //   }
    //   client.quit();
    //   done();
    // });
  });
});
