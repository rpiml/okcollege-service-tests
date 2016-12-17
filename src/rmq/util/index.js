// @flow

import { request } from 'amqplib-rpc';

import { getRabbitMQConnection } from './rabbitmq';

export async function rpc(queue: string, message: string): Promise<string> {
  const rabbitmq = await getRabbitMQConnection();
  const reply = (await request(rabbitmq, queue, message)).content.toString();
  rabbitmq.close();
  return reply;
}

export default rpc;
