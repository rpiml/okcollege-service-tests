// @flow

import { startCoreServices, startService, stopService, stopServices } from '../docker-compose';

import redis from 'redis';

import { csvpredict } from '../rmq';

let client = redis.createClient();

beforeAll(async () => {
  await startCoreServices();
  await startService('ml-predictor');
});

beforeAll(() => {

  // Load stuff into redis

});

let simpleInput = [
  [''     , 'like-art', 'like-computer'].join(','),
  ['user5',      '1'  ,      '0'       ].join(',')
].join('\n');



it('should accept a prediction', async () => {
  // let prediction = await csvpredict(simpleInput);
  // console.log(prediction);
});
