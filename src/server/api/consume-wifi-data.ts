import { Kafka } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { serverSupabaseClient } from "#supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseMessage } from "../helpers/parse-message";

const { internalSecret, kafkaConfig, schemaRegistry } = useRuntimeConfig();

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

let seeked = false;

export default defineEventHandler(async (event) => {
  if (getQuery(event)?.secret !== internalSecret) {
    event.node.res.statusCode = 401;
    event.node.res.end();
    return;
  }

  const client = serverSupabaseClient(event);

  consumeLastBatch({ client });

  // Close consumer connection within function time limit
  await new Promise((resolve) => setTimeout(async () => {
    console.time("Consumer disconnect");
    await consumer.disconnect();
    console.timeEnd("Consumer disconnect");
    event.node.res.statusCode = 202;
    event.node.res.end();
    resolve(null);
  }, 20000));
});

async function consumeLastBatch({ client }: { client: SupabaseClient }) {
  console.time("Consumer setup");
  await consumer.connect();
  await consumer.subscribe({ topic: kafkaConfig.topic });
  console.timeEnd("Consumer setup");

  consumer.run({
    eachBatch: async ({ batch }) => {
      if (!seeked) {
        seeked = true;
        consumer.seek({
          topic: kafkaConfig.topic,
          offset: batch.highWatermark,
          partition: batch.partition,
        });
      }

      console.time("Parse messages");
      const parsedMessages = await Promise.all(
        batch.messages
          .filter((message) => message.value)
          .map((message) =>
            registry
              .decode(message.value!)
              .then((decodedValue) => parseMessage({
                timestamp: message.timestamp,
                decodedValue,
              }))
          )
      );
      console.timeEnd("Parse messages");

      // filter out duplicate older messages, Map constructor uses last entry
      const uniqueMessages = Array.from(
        new Map(
          parsedMessages.map((message) => [message.access_point_name, message])
        ).values()
      );

      console.time(`Upsert ${uniqueMessages.length} messages`);
      const { error } = await client
        .from("access_points_latest_states")
        .upsert(uniqueMessages);
      console.timeEnd(`Upsert ${uniqueMessages.length} messages`);

      if (error) {
        console.error(error);
      }
    },
  });
}
