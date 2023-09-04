import { Kafka } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseMessageAruba } from "../helpers/parse-message";

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

const topicMessageParserMapping = {
  "tud_aruba_access_point_client_counts": parseMessageAruba,
}

export default defineEventHandler(async (event) => {
  if (getQuery(event)?.secret !== internalSecret) {
    event.node.res.statusCode = 401;
    event.node.res.end();
    return;
  }

  const client = serverSupabaseServiceRole(event);

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
  await consumer.subscribe({ topics: kafkaConfig.topics });
  console.timeEnd("Consumer setup");

  consumer.run({
    eachBatch: async ({ batch }) => {
      const parseMessage = topicMessageParserMapping[
        batch.topic as keyof typeof topicMessageParserMapping
      ];

      if (!seeked) {
        seeked = true;

        consumer.seek({
          topic: batch.topic,
          offset: batch.highWatermark,
          partition: batch.partition,
        });
      }

      console.time(`Parse messages from ${batch.topic}`);
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
      )
        .then((parsedMessages) => parsedMessages.filter(
          <T>(parsedMessage: T): parsedMessage is NonNullable<T> => (
            Boolean(parsedMessage)
          )
        ));
      console.timeEnd(`Parse messages from ${batch.topic}`);

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
