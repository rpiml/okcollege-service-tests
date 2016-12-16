/** @flow */

import request from 'request';

import { startCoreServices, startService } from '../docker-compose';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('api tests', () => {
  beforeAll(async () => {
    await startCoreServices();
    await startService('web-api');
  });

  const apiURL = 'http://localhost:8080/api';

  it('api smoke test', async () => {
    console.log("running smoke test");
    await new Promise((resolve) => {
      request(apiURL, (err, res, body) => {
        expect(body).toBe('okcollege server api');
        resolve();
      });
    });
  });
});
