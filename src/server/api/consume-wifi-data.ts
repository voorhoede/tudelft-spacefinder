import { Kafka } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

const { kafkaConfig, schemaRegistry } = useRuntimeConfig();

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

export default defineEventHandler(async (event) => {
  const consumer = kafka.consumer({ groupId: kafkaConfig.groupId });

  await consumer.connect();
  await consumer.subscribe({ topic: kafkaConfig.topic });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const decodedValue = await registry.decode(message.value);
      console.log({ message: decodedValue });
    },
  });

  event.node.res.statusCode = 202;
  event.node.res.end();
});
