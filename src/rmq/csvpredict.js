// @flow
import { rpc } from './util';

export default async function csvpredict(surveycsv: string): Promise<string> {
  const prediction = await rpc('predictor_queue', surveycsv);
  try {
    return prediction;
  } catch (e) {
    throw new Error('could not parse prediction');
  }
}
