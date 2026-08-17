import Groq from "groq-sdk";

const expenseDB = [];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const chatCompletion = await getGroqChatCompletion();
}

async function getGroqChatCompletion() {
  const messages = [
    {
      role: "system",
      content: `You're a Apex, a personal finance assistant. Your Task is to assist user with their expenses, balance, and financial plannings.
          Current DateTime: ${new Date().toUTCString()}
          `,
    },
  ];

  messages.push({
    role: "user",
    content: "How much money I spent this month?",
  });

  while (true) {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "openai/gpt-oss-120b",
      tools: [
        {
          type: "function",
          function: {
            name: "getTotalExpense",
            description: "get total expense from date to date",
            parameters: {
              type: "object",
              properties: {
                from: {
                  type: "string",
                  description: "start date to get the expense",
                },
                to: {
                  type: "string",
                  description: "end date to get the expense",
                },
              },
            },
          },
        },
      ],
    });

    messages.push(chatCompletion.choices[0].message);

    const toolCalls = chatCompletion.choices[0].message.tool_calls;
    if (!toolCalls) {
      console.log(
        `Assistant: ${chatCompletion.choices[0].message.content ?? ""}`,
      );
      break;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionArgs = tool.function.arguments;

      let result = "";
      if (functionName === "getTotalExpense") {
        result = getTotalExpense(JSON.parse(functionArgs));
      }

      messages.push({
        role: "tool",
        content: result,
        tool_call_id: tool.id,
      });
    }

    console.log(`========================`);
    console.log(`MSGS >>> ${JSON.stringify(messages, null, 2)}`);
  }
}

// tool -> getTotalExpense Function
function getTotalExpense({ from, to }) {
  console.log(`calling getTotalExpense fn`);
  return "12000 INR";
}

// tool -> addExpense Function
function addExpense({ name, amount }) {
  console.log(`adding ${amount} to expense DB for ${name}`);
  expenseDB.push({
    name,
    amount,
  });
}

main();
