import { connect as rabbitmqConnect } from 'amqplib/callback_api';
import config from '../../config/environment';

function createRabbitMQConnection(){
  return new Promise(resolve => {
    rabbitmqConnect(config.rabbitmqAddress, (err, conn) => {
      if (err){
        console.log("Failed to connect to rabbitmq!");
        process.exit(1);
      }
      resolve(conn);
    });
  });
}

export let onRabbitMQConnection = createRabbitMQConnection();
export const getRabbitMQConnection = () => onRabbitMQConnection;
