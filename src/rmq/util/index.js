//@flow
import { getRabbitMQConnection } from './rabbitmq';

export async function rpc(queue:string, message:string): Promise<string>{
  console.log("Getting Rabbitmq");
  let rabbitmq = await getRabbitMQConnection();
  return await new Promise(resolve => {
    console.log("Creating Channel");
    rabbitmq.createChannel((err, ch) => {
      console.log("Asserting Queue");
      ch.assertQueue('', {exclusive: true}, (err, q) => {
        let corr = generateUuid();

        ch.consume(q.queue, msg => {
          if (msg.properties.correlationId == corr){
            resolve(msg.content.toString());
          }
        });

        console.log("Sending to queue");
        ch.sendToQueue(queue, new Buffer(message), {
          correlationId: corr,
          replyTo: q.queue
        });

      });
    });
  });
}

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}
