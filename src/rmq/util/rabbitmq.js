import { connect as rabbitmqConnect } from 'amqplib/callback_api';
import config from '../../config/environment';

function createRabbitMQConnection() {
  return new Promise((resolve) => {
    rabbitmqConnect(config.rabbitmqAddress, (err, conn) => {
      if (err) {
        console.log('Failed to connect to rabbitmq!');
        process.exit(1);
      }
      resolve(conn);
    });
  });
}

let onRabbitMQConnection;
export const getRabbitMQConnection = () => {
  if (!onRabbitMQConnection) {
    onRabbitMQConnection = createRabbitMQConnection();
  }
  return onRabbitMQConnection;
};
