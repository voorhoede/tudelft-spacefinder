import process from "node:process";
import { Kafka } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { serverSupabaseClient } from "#supabase/server";

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
  const client = serverSupabaseClient(event);
  const consumer = kafka.consumer({ groupId: kafkaConfig.groupId });

  await consumer.connect();
  await consumer.subscribe({ topic: kafkaConfig.topic });

  process.on("SIGINT", async function() {
    console.log("SIGINT");
    process.exit();
  });

  process.on("SIGTERM", async function() {
    console.log("SIGTERM");
    await consumer.disconnect();
    console.log("disconnected");
    process.exit();
  });

  await consumer.run({
    eachBatch: async ({
      batch,
      // resolveOffset,
      // heartbeat,
      // commitOffsetsIfNecessary,
      // uncommittedOffsets,
      // isRunning,
      // isStale,
      // pause,
    }) => {
      console.time("parsing");
      const parsedMessages = await Promise.all(
        batch.messages
          .filter((message) => message.value)
          .map((message) =>
            registry
              .decode(message.value)
              .then((decodedValue) => ({
                "updated_at": new Date(Number(message.timestamp)).toISOString(),
                "access_point_name": decodedValue.name,
                "device_count": decodedValue.clientCount,
                "building_number": decodedValue.name.split("-").at(1) || 9001,
                "floor": decodedValue.locationHierarchy.split(">").at(-1).trim(),
                "map_location": decodedValue.mapLocation,
              }))
          )
      );

      // filter out duplicate older messages, Map constructor uses last entry
      const uniqueMessages = Array.from(
        new Map(
          parsedMessages.map((message) => [message.access_point_name, message])
        ).values()
      );
      console.timeEnd("parsing")

      console.time("upsert");
      const { error } = await client
        .from("access_points_latest_states")
        .upsert(uniqueMessages);
      console.timeEnd("upsert");

      if (error) {
        console.error(error);
      } else {
        console.info(`upserted ${uniqueMessages.length} messages`);
      }
    },
  });

  event.node.res.statusCode = 202;
  event.node.res.end();
});
