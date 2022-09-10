import fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const server = fastify();

// TODO: express.json()
// TODO: express.urlencoded

// Routes
server.get("/", async (request, reply) => {
  return "Hello world\n";
});
server.get("/ping", async (request, reply) => {
  return "pong\n";
});

const PORT = parseInt(process.env.PORT || "3000");

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🍴Restaurant open at ${address}`);
});
