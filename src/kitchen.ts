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

export function initializeKitchenServices() {
  cookQueue.process(
    3,
    (job: Queue.Job<OrderType>, done: Queue.DoneCallback<unknown>) => {
      setTimeout(
        () => console.log("Getting the ingredients ready 🧅 🍅 🍄"),
        1000
      );
      setTimeout(() => console.log(`👨🏼‍🍳 Prepaing ${job.data.dish}`), 1500);
      setTimeout(() => {
        console.log(`🧾 Order ${job.data.orderNo}: ${job.data.dish} ready`);
      }, job.data.qty * 3000);
    }
  );

  cookQueue.on("succeeded", (job, result) => {
    serveQueue.createJob(job.data).save();
  });
}
