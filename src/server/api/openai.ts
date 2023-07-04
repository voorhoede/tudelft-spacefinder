import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
const config = useRuntimeConfig();

const configuration = new Configuration({
  apiKey: config.openAi.secretKey,
});

const openai = new OpenAIApi(configuration);

export default defineEventHandler(async (event) => {
  try {
    const { query, defaultFilters } = await readBody(event);

    const response = await openai.createChatCompletion({
      max_tokens: 900,
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `
                  filter criteria: {
                    occupancy: quiet/busy/crowded,
                    adjustableChair: true/false,
                    buildings: string | number,
                    daylit: true/false,
                    bathroom: true/false,
                    coffee: true/false,
                    printer: true/false,
                    availablePlaces: number,
                    powerOutlet: true/false,
                    presentationScreen: true/false,
                    quietness: silent/quiet/noisy,
                    showOpenLocations: true/false,
                    whiteBoard: true/false,
                  }
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
          content: `${query} suggest a filter with the amount of people/devices and create a json with this amount of  minumum and if it is a quiet or busy room`,
        },
        {
          role: "user",
          content: `Find the fitting data for this query ${query} and only return the values if it's relevant with the filter criteria.`,
        },
        {
          role: "user",
          content: `
                Your response should only be a json object without any other text and must match the given response format
            `,
        },
        {
          role: "user",
          content: `If you can't find any data for this query ${query} please return an empty json object`,
        },
      ],
    });

    const { content } = response.data.choices[0]!
      .message as ChatCompletionRequestMessage;
    const filters = JSON.parse(content!);

    const mappedFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        let updatedKey;

        switch (key) {
          case "occupancy":
            updatedKey = "buildingOccupancy";
            value = [value];
            break;
          case "quietness":
            updatedKey = "quietness";
            break;
          case "coffee":
            updatedKey = "nearCoffeeMachine";
            break;
          case "bathroom":
            updatedKey = "nearBathroom";
            break;
          case "printer":
            updatedKey = "nearPrinter";
            break;
          case "availablePlaces":
            updatedKey = "numberOfSeats";
            break;
          case "powerOutlet":
            updatedKey = "powerOutlets";
            break;
          default:
            updatedKey = key;
        }

        return { ...acc, [updatedKey]: value };
      },
      {}
    );

    return { ...defaultFilters, ...mappedFilters };
  } catch (error: any) {
    if (!error.message) return;
    console.log(error);
    console.error(`Error in chat.post: ${error.message}`);
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
