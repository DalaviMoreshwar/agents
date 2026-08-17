import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(JSON.stringify(chatCompletion.choices[0], null, 2));

  const toolCalls = chatCompletion.choices[0].message.tool_calls;
  if (!toolCalls) {
    console.log(
      `Assistant: ${chatCompletion.choices[0].message.content ?? ""}`,
    );
    return;
  }

  for (const tools of toolCalls) {
    const functionName = tools.function.name;
    const functionArgs = tools.function.arguments;

    if (functionName === "getTotalExpence") {
      const result = getTotalExpence(JSON.parse(functionArgs));
    }
  }
}

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You're a Apex, a personal finance assistant. Your Task is to assist user with their expenses, balance, and financial plannings.
          Current DateTime: ${new Date().toUTCString()}
          `,
      },
      {
        role: "user",
        content: "How much money I spent this month?",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "getTotalExpence",
          description: "get total expence from date to date",
          parameters: {
            type: "object",
            properties: {
              from: {
                type: "string",
                description: "start date to get the expence",
              },
              to: {
                type: "string",
                description: "end date to get the expence",
              },
            },
          },
        },
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

// tool -> getTotalExpence Function
function getTotalExpence({ from, to }) {
  console.log(`calling getTotalExpence fn`);
  return "12000";
}

main();
