/** @flow */

import { startCoreServices, startService, stopService, stopServices } from '../docker-compose';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000;
jasmine.VERBOSE = true;

import request from 'request';

beforeAll(async () => {
  await startCoreServices();
  await startService('web-api');
});

const apiURL = "http://localhost:8080/api";

it('api smoke test', async () => {
  // await new Promise(resolve => {
  //   request(apiURL, (err, res, body) => {
  //     expect(body).toBe("okcollege server api");
  //     resolve();
  //   });
  // });
});
