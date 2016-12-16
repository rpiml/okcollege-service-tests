// @flow

import redis from 'redis';

import { startCoreServices, startService, startLogging } from '../docker-compose';
import { setup } from '../spec/training-preprocessor/ex1';
import { csvpredict } from '../rmq';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('predictor test', () => {
  startLogging();
  // const client = redis.createClient();
  //
  // const simpleInput = [
  //   [''     , 'like-art', 'like-computer'].join(','),
  //   ['user5',      '1'  ,      '0'       ].join(',')
  // ].join('\n');
  //
  beforeAll(async () => {
    await startCoreServices();
    // await startService('web-api');
  });

  it('should accept a prediction', async () => {
    // let prediction = await csvpredict(simpleInput);
    // console.log(prediction);
  });
});
