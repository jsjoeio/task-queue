import fastify from "fastify";
import dotenv from "dotenv";
import formBodyPlugin from "@fastify/formbody";
import { Static, Type } from "@sinclair/typebox";
import { startRedis } from "./redis";
import { initializeKitchenServices } from "./kitchen";
import { initializeWaiterServices, placeOrder } from "./waiter";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

// Inits
dotenv.config();
const server = fastify().withTypeProvider<TypeBoxTypeProvider>();
server.register(formBodyPlugin);

// Services
initializeKitchenServices();
initializeWaiterServices();

// Routes
server.get("/", async (request, reply) => {
  return "😋 We are serving freshly cooked food 🍲\n";
});

export const Order = Type.Object({
  dish: Type.String(),
  qty: Type.Number(),
  orderNo: Type.String(),
});

export const OrderReply = Type.Object({
  done: Type.Boolean(),
  message: Type.String(),
});

export type OrderType = Static<typeof Order>;
export type OrderReplyType = Static<typeof OrderReply>;

server.post<{ Body: OrderType; Reply: OrderReplyType }>(
  "/order",
  async (request, reply) => {
    let order = {
      dish: request.body.dish,
      qty: request.body.qty,
      orderNo: request.body.orderNo,
    };

    if (order.dish && order.qty) {
      console.log(`
# Order received:
- dish: ${order.dish}
- qty: ${order.qty}
- orderNo: ${order.orderNo}
      `);
      try {
        await placeOrder(order);
        reply.status(200).send({
          done: true,
          message: "Your order will be ready in a while",
        });
      } catch (error) {
        reply.status(400).send({
          done: false,
          message: "Your order could not be placed",
        });
      }
    } else {
      reply.status(422);
    }
  }
);

const PORT = parseInt(process.env.PORT || "3000");

async function main() {
  await startRedis();
  server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🍴Restaurant open at ${address}`);
  });
}

(async () => {
  await main();
})();
