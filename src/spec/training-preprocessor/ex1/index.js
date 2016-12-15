// @flow

import redis from 'redis';
import { readFileSync } from 'fs';
import path from 'path';

const redisKeys = {
  'learning:college_features.csv': readFileSync(
      path.resolve(__dirname, './college_features.csv')).toString(),
  'learning:college_training.csv': readFileSync(
      path.resolve(__dirname, './college_training.csv')).toString(),
  'learning:survey_features.csv': readFileSync(
      path.resolve(__dirname, './survey_features.csv')).toString(),
  'learning:survey_training.csv': readFileSync(
      path.resolve(__dirname, './survey_training.csv')).toString(),
};

export async function setup(): Promise<*> {
  const client = redis.createClient();

  Object.keys(redisKeys).forEach((key) => {
    client.set(key, redisKeys[key]);
  });
}


export default setup;
