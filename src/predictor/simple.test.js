// @flow

import redis from 'redis';

import { startCoreServices, startService, startLogging } from '../docker-compose';
import {
  setup,
  sampleInputPrediction,
  sampleOutputPrediction
} from '../spec/training-preprocessor/ex1';
import { csvpredict } from '../rmq';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('predictor test', () => {

  beforeAll(async () => {
    await startCoreServices();
    await startService('ml-predictor');
    await setup();
  });

  it('should accept a prediction', async () => {
    const prediction = await csvpredict(sampleInputPrediction);
    expect(prediction).toBe(sampleOutputPrediction);
  });
});
