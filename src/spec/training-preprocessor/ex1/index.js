// @flow

import redis from 'redis';
import college_features from './college_features.csv';
import college_training from './college_training.csv';
import survey_features from './survey_features.csv';
import survey_training from './survey_training.csv';

const redisKeys = {
  'learning:college_features.csv': college_features,
  'learning:college_training.csv': college_training,
  'learning:survey_features.csv': survey_features,
  'learning:survey_training.csv': survey_training,
};

export async function setup(): Promise<*> {
  const client = redis.createClient();

  redisKeys.keys().forEach((key) => {
    client.set(key, redisKeys[key]);
  });
}


export default setup;
