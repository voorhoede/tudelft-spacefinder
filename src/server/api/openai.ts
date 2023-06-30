import {
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";
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
                    occupancy: quiet/busy/crowded,
                    adjustableChair: yes/no,
                    buildings: string | number,
                    daylit: yes/no,
                    bathroom: yes/no,
                    coffee: yes/no,
                    printer: yes/no,
                    availablePlaces: number,
                    powerOutlet: yes/no,
                    presentationScreen: yes/no,
                    quietness: silent/quiet/noisy,
                    // showOpenLocations: yes/no,
                    whiteBoard: yes/no,
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
      ],
    });

    const { content } = response.data.choices[0].message;
    const filters = JSON.parse(content);

    const mappedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      let updatedKey

      switch (key) {
        case "occupancy":
         updatedKey = 'buildingOccupancy';
         break;
        case "coffee":
         updatedKey = 'nearCoffeeMachine';
         break;
        case "bathroom":
         updatedKey = 'nearBathroom';
         break;
        case "printer":
         updatedKey = 'nearPrinter';
         break;
        case "availablePlaces":
         updatedKey = 'numberOfSeats';
         break;
        case "powerOutlet":
         updatedKey = 'powerOutlets';
         break;
        default:
          updatedKey = key;
      }

      return { ...acc, [updatedKey]: value }
    }, {})

    return mappedFilters;
  } catch (error) {
    console.error(`Error in chat.post: ${error.message}`);
    throw createError(500, error.message);
  }
});
