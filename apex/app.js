import readline from "node:readline/promises";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// create terminal input interface
const chatInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages = [
  {
    role: "assistant",
    content: `
        You are a patient math tutor.
        Do no directly answer a student's questions.
        Guide them to a solution step-by-step.
        
         Current DateTime: ${new Date().toUTCString()}
    `,
  },
];

function addUserMessages(messages, text) {
  const userMsg = {
    role: "user",
    content: text,
  };
  messages.push(userMsg);
}

function addAssistantMessages(messages, text) {
  const assistantMsg = {
    role: "assistant",
    content: text,
  };
  messages.push(assistantMsg);
}

async function chat(messages, temperature = 1.0) {
  const message = await groq.chat.completions.create({
    messages: messages,
    model: "openai/gpt-oss-120b",
    // max_completion_tokens: 1000,
    temperature: temperature,
  });

  return message.choices[0].message.content;
}

async function main() {
  // infinite loop
  while (true) {
    const userInput = await chatInterface.question("YOU << ");
    addUserMessages(messages, userInput);

    const answer = await chat(messages, 0.0);

    addAssistantMessages(messages, answer.content);

    console.log(`AI  >> ${answer}`);
  }
}

main();
