import { createClient } from "redis";

export async function startRedis() {
  const client = createClient();

  client.on("ready", () => console.log("🔺Redis ready"));
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client;
}
