// @flow

import redis from 'redis';
import { readFileSync } from 'fs';
import path from 'path';

export const redisKeys = {
  'learning:college_features.csv': readFileSync(
      path.resolve(__dirname, './college_features.csv')).toString(),
  'learning:college_training.csv': readFileSync(
      path.resolve(__dirname, './college_training.csv')).toString(),
  'learning:survey_features.csv': readFileSync(
      path.resolve(__dirname, './survey_features.csv')).toString(),
  'learning:survey_training.csv': readFileSync(
      path.resolve(__dirname, './survey_training.csv')).toString(),
};

export const sampleInputPrediction = readFileSync(
  path.resolve(__dirname, './sample_input_prediction.csv')).toString();

export const sampleOutputPrediction = readFileSync(
  path.resolve(__dirname, './sample_output_prediction.csv')).toString();

export async function setup(): Promise<*> {
  const client = redis.createClient();

  Object.keys(redisKeys).forEach((key) => {
    client.set(key, redisKeys[key]);
  });

  client.quit();
}


export default setup;
