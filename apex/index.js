import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// TOOLS
function getWeatherDetails(city) {
  if (city.toLowerCase() === "mumbai") return "10 degree celcius";
}

async function chat() {
  const response = await client.responses.create({
    input: "what is the weather in mumbai?",
    model: "gpt-4o",
  });

  console.log(response);
}

chat();
