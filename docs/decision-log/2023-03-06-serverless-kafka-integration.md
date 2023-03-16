# Add serverless Kafka integration

TU Delft provides data on building and space occupancy via a Kafka service. We decided consume the Kafka data and store it in the project's Supabase instance using a serverless integration using Kafka.js, Nuxt and Netlify.

-   Alternatives Considered: Node.js server on AWS EC2, AWS Lambda with Kafka, Supabase Edge function.
-   Decision Made By: [Jasper](https://github.com/jbmoelker), [Selwyn](https://github.com/Siilwyn).

## Decision

The Spacefinder is developed in JavaScript. The go-to solution to consume Kafka data in JavaScript is using [Kafka.js](https://kafka.js.org/). Our preferred option is to write serverless integrations with services already used by the project to avoid introducing additional moving parts that need to be monitored and maintained. With the knowledge that the data is updated every five minutes in batches that contain all data we can fetch that data in short runs. Since the consumed data is directly stored in Supabase, a Supabase Edge function was our preferred option for the consumer. However Kafka.js requires Node.js which is incompatible with Supabase Edge running on Deno (and compatible modules [kafkasaur](https://deno.land/x/kafkasaur@v0.0.7) and [kafkagosaur](https://deno.land/x/kafkagosaur@v0.0.6) didn't work). We therefore decided to move the consumer into a Nuxt API route deployed on Netlify as Nuxt and Netlify are already part of the Spacefinder's technology stack.
