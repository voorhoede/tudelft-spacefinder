import { Configuration, OpenAIApi } from "openai";
const config = useRuntimeConfig();

const configuration = new Configuration({
  apiKey: config.openAi.secretKey,
});

const openai = new OpenAIApi(configuration);

export default defineEventHandler(async (event) => {
  try {
    const { query } = await readBody(event);
    console.log(query);

    const response = await openai.createChatCompletion({
      max_tokens: 900,
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: `
                  filter criteria: {
                    coffee: yes/no
                    monitors: number
                    building_number: number
                    device_count: number
                    floor: string
                  }
              `,
        },
        {
          role: "user",
          content: `
                  The device_count is an indicator of the activity of the room.
                  every person counts as a device
                  0 devices means the room is empty. 1 device means the room is occupied.
                  4 devices means the room is busy.
                  0 devices means it will be quiet, 3 will mean it will be busier.
          `,
        },
        {
          role: "user",
          content: `
                  Can you tell me what filter criteria are important in the following prompt: "${query}"
              `,
        },
        {
          role: "user",
          content: `
                  can you format the response as follows:
                  {
                      "filter_criteria_1": "value_1",
                      "filter_criteria_2": "value_2"
                  }
                  where the filter_criteria and values are replaced with the actual criteria_filters
                  the object should only contain the filter criteria
              `,
        },
        {
          role: "user",
          content: `
                Your response should only be a json object without any other text and must match the given response format
            `,
        },
      ],
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error(`Error in chat.post: ${error.message}`);
    throw createError(500, error.message);
  }
});
