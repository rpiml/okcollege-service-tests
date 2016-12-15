//@flow
import { rpc } from './util';

export default async function fullpredict(survey: Object){
  let prediction = await rpc('predictor-preprocessor', JSON.stringify(survey));
  try{
    return JSON.parse(prediction);
  }catch(e){
    console.log("Could not parse prediction: ", prediction);
    return {};
  }
}
