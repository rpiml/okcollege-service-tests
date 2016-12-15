//@flow
import { rpc } from './util';

export default async function csvpredict(surveycsv: string){
  let prediction = await rpc('predictor_queue', surveycsv);
  try{
    return prediction;
  }catch(e){
    console.log("Could not parse prediction: ", prediction);
    return {};
  }
}
