import "dotenv/config";
import { Kafka } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

const kafkaConfig = {
  url: process.env.KAFKA_URL,
  username: process.env.KAFKA_USERNAME,
  password: process.env.KAFKA_PASSWORD,
  groupId: "tud_dvoorhoede",
  topics: [
    "tud_aruba_access_point_client_counts",
  ],
};
const schemaRegistry = {
  url: process.env.SCHEMA_REGISTRY_URL,
  username: process.env.SCHEMA_REGISTRY_USERNAME,
  password: process.env.SCHEMA_REGISTRY_PASSWORD,
};

console.time("Initialize");
const kafka = new Kafka({
  clientId: "tudelft-spacefinder",
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: kafkaConfig.username,
    password: kafkaConfig.password,
  },
  brokers: [kafkaConfig.url],
});

const registry = new SchemaRegistry({
  host: schemaRegistry.url,
  auth: {
    username: schemaRegistry.username,
    password: schemaRegistry.password,
  },
});

const consumer = kafka.consumer({ groupId: kafkaConfig.groupId });
console.timeEnd("Initialize");

await consumer.connect();
await consumer.subscribe({ topics: kafkaConfig.topics, fromBeginning: false });

await consumer.run({
  eachMessage: async ({ message }) => {
    registry
      .decode(message.value)
      .then(console.info)
  },
});

process.on("SIGINT", async () => {
  console.time("Consumer disconnect");
  await consumer.disconnect();
  console.timeEnd("Consumer disconnect");
});
