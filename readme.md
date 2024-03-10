# GigaAI Chat Hook Documentation
### Current SDK version 0.2

<div style="text-align: center;">
<img style=" border: 1px solid #ddd; border-radius: 4px; padding: 5px; max-width: 35%; text-align: center;"  src="https://main.gigasoft.com.pl/logo.png"> </img>
</div>





Welcome to the GigaAI Chat Hook documentation. This React hook is designed to simplify the integration of GigaSoft's AI chat models into your application, providing a seamless interactive chat experience. Currently supporting several NLP models, this guide will walk you through installation, usage, and examples.


 ### Changelog

* 07.03.2024
<details>

<summary> <b>Click to expand </b></summary>
Added interface in react.ts!

```tsx
interface UseGigaAIParams {
  api: string;
  additionalData?: AdditionalData;
}

export default function useGigaAI({
  api="api/chat",
  additionalData
}: UseGigaAIParams) 
```
Now u can send optional data to api 

 ## Added support for receiving raw replies

Example 
```ts
export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const raw = "aaaa";
  return new Response(raw);

  const stream = await Giga.chat({
    model: "GigAI-v1",
    messages: messages,
    stream:true, // must be set to true, for hook useGigAI react...
    
  })
  return new Response(stream);
}
```
</details>

 * 10.03.2024
<details>

<summary> <b>Click to expand </b></summary>
* Added support for models OCR 
</details>




[Demo web app](https://github.com/Turbo1337GS/ChatbotUI)

## Getting Started

The GigaAI Chat Hook (`useGigaAI`) is a part of `@/package/core/frontend/react.ts` within the GigaSoft AI package. It enables easy integration with GigaSoft AI's chat API, allowing for real-time chat functionalities within your React application. This initial version (v0.1) supports a selection of NLP models and will be updated to include more models such as GigAI-OCR in future releases.

### src/app/api/chat/route.tsx

```tsx
import Gigasoft from "@/package/core/backend/GigaSoft";
export const runtime = "edge";
const Giga = new Gigasoft({
  API_KEY: process.env.GIGAI,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await Giga.chat({
    model: "GigAI-v1",
    messages: messages,
    stream: true, // must be set to true, for hook useGigAI react...
  });
  return new Response(stream);
}
```

### src/app/page.tsx

```tsx
"use client";
import useGigaAI from "@/package/core/frontend/react";
// code from https://sdk.vercel.ai/docs/guides/providers/openai
// But using hook useGigaAI()
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useGigaAI();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

### Supported AI Models

As of version 0.1, the following NLP models are supported:

- `GigAI-v1`
- `GigAI-v1_5`
- `Fake`

Please ensure your application is configured to use one of these models for the chat functionalities.

## Installation

To use `useGigaAI`, ensure that you have first cloned the GigaSoft AI package into your project. The hook is located at `src/package/core/frontend/react.ts` within the package structure.

### Step 1: Import the Hook

In your React component file where you intend to use the chat functionality, import `useGigaAI` as follows:

```tsx
import useGigaAI from "@/package/core/frontend/react";
```

### Step 2: Initialization and Configuration

Initialize `useGigaAI` in your component to get access to its functionalities and states:

```tsx
const { messages, input, handleInputChange, handleSubmit } = useGigaAI();
```

## Usage

After importing and initializing the hook in your component, you can now make use of the provided states and functions to integrate a chat interface within your application.

### Displaying Messages

The `messages` state holds an array of message objects that can be rendered in your UI. Each message object contains details such as the message content, sender role, and more.

Example of displaying messages:

```tsx
<div className="chat-messages">
  {messages.map((m) => (
    <div key={m.id} className={`message ${m.role}`}>
      {m.role === "user" ? "User: " : "AI: "}
      {m.content}
    </div>
  ))}
</div>
```

### Sending Messages

To send a message, use the `input` and `handleInputChange` to capture user input, and `handleSubmit` for processing and sending the message to the backend for a response.

Example of a message input form:

```tsx
<form onSubmit={handleSubmit}>
  <input
    className="message-input"
    value={input}
    placeholder="Say something..."
    onChange={handleInputChange}
  />
</form>
```

## Examples

### Simple Chat Application

Here's a complete example of a simple chat application using the `useGigaAI` hook.

```tsx
import React from "react";
import useGigaAI from "@/package/core/frontend/react";

function ChatApp() {
  const { messages, input, handleInputChange, handleSubmit } = useGigaAI();

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
      </form>
    </div>
  );
}

export default ChatApp;
```

This example demonstrates the basic setup needed to implement a chat feature using `useGigaAI`.

## Future Developments

The GigaAI Chat Hook is in its initial version (v0.1), and future updates will include support for additional models and functionalities. Feedback and contributions are welcome, as we aim to expand the capabilities of this hook to cater to various chat-interaction needs.

Stay tuned for updates and enhancements, including the introduction of the GigAI-OCR model in upcoming versions. Your feedback is valuable to us as we continue to develop and improve the GigaAI Chat Hook.

For more information or support, please visit our GitHub repository or contact our support team.
