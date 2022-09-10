import Queue, { QueueSettings } from "bee-queue";
import { OrderType } from ".";

const options: QueueSettings = {
  removeOnSuccess: true,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
};

const cookQueue = new Queue("cook", options);
const serveQueue = new Queue("serve", options);

// acts as the publisher
export function placeOrder(order: OrderType) {
  return cookQueue.createJob(order).save();
}

export function initializeWaiterServices() {
  // acts as the consumer
  serveQueue.process(
    (job: Queue.Job<OrderType>, done: Queue.DoneCallback<unknown>) => {
      console.log(`🧾 ${job.data.qty}x ${job.data.dish} ready to be served 😋`);
      //  Notify the client via push notification, web socket or email etc.
      done(null, "success");
    }
  );
}
