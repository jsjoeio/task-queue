import Queue, { QueueSettings } from "bee-queue";

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

export type Order = {
  dish: string;
  qty: number;
  orderNo: strinig;
};

// acts as the publisher
export function placeOrder(order: Order) {
  return cookQueue.createJob(order).save();
}

// acts as the consumer
serveQueue.process(
  (job: Queue.Job<Order>, done: Queue.DoneCallback<unknown>) => {
    console.log(`🧾 ${job.data.qty}x ${job.data.dish} ready to be served 😋`);
    //  Notify the client via push notification, web socket or email etc.
    done(null, "success");
  }
);
