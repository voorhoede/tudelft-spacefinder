import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import type { Filters } from "~/types/Filters";

const config = useRuntimeConfig();
const openAiConfiguration = new Configuration({
  apiKey: config.openAi.secretKey,
});

const openai = new OpenAIApi(openAiConfiguration);

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const query: string = body.query;

    const response = await openai.createChatCompletion({
      max_tokens: 900,
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `
            In the following criteria_filters: {
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
          content: `Which of the criteria_filters are relevant in the prompt: "${query}"`,
        },
        {
          role: "user",
          content: `
            Format the response as follows:
            {
                "filter_criteria_1": "value_1",
                "filter_criteria_2": "value_2"
            }
            Where the filter_criteria keys and values are replaced with the actual criteria_filters.
            Make sure the object only contains the filter criteria.
          `,
        },
        // {
        //   role: "user",
        //   content: `${query} suggest a filter with the amount of people/devices and create a json with this amount of minumum and if it is a quiet or busy room`,
        // },
        // {
        //   role: "user",
        //   content: `Find the fitting data for this query ${query} and only return the values if it's relevant with the filter criteria.`,
        // },
        {
          role: "user",
          content: "The response should only be a json object without any other text.",
        },
        {
          role: "user",
          content: "Return an empty json object if there are no relevant criteria_filters in the query.",
        },
      ],
    });

    const { content } = response.data.choices[0].message as ChatCompletionRequestMessage;

    if (!content) {
      // if chatGPT cannot make sense of the query, then there won't be any content to get filters from
      return {};
    }

    const filters: unknown = JSON.parse(content);

    if (!filters) {
      // if chatGPT fails to return a parsable json object we cannot use it
      return {};
    }

    const mappedFilters: Partial<Filters> = Object
      .entries(filters)
      .reduce((acc, entry) => {
        const [key, value]: [string, unknown] = entry;
        let updatedKey: string;

        switch (key) {
          case "occupancy":
            updatedKey = "buildingOccupancy";
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

        return {
          ...acc,
          [updatedKey]: value
        };
      },
      {}
    );

    return mappedFilters;
  } catch (error: any) {
    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: error?.message,
    });
  }
});
