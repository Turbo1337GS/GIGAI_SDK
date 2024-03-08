
import { useState, useCallback, useEffect } from "react";
import { ChatChunk, Message } from "../shared/types";


interface AdditionalData {
  [key: string]: any;
}

interface UseGigaAIParams {
  api: string;
  additionalData?: AdditionalData;
  initialMessages: Message[];
}

export default function useGigaAI({
  api = "api/chat",
  additionalData,
  initialMessages,
}: UseGigaAIParams) {
<<<<<<< HEAD
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const userMessageWithId: Message = {
        id: generateId(),
        role: "user",
        content: input,
      };

      setMessages((oldMessages) => [...oldMessages, userMessageWithId]);
      setLoading(true);
      setInput("");

      const messagesToSend = messages.map(({ role, content }) => {
        return { role, content };
      });

      // Dodanie ostatniej wiadomości użytkownika
      messagesToSend.push({ role: "user", content: userMessageWithId.content });

      const assistantMessageId = generateId();

      try {
        const response = await fetch(`${api}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messagesToSend,
            additionalData,
            stream: true,
          }),
        });

        const transferEncoding = response.headers.get("Transfer-Encoding");
        const Text = response.headers.get("Content-Type");
        if (Text && Text.includes("text/plain")) {
          const RawRes = await response.text();
          console.log(RawRes);
          setMessages((oldMessages) => [
            ...oldMessages,
            {
              id: assistantMessageId,
              role: "assistant",
              content: RawRes,
            },
          ]);
          setLoading(false);
        }

        if (transferEncoding && transferEncoding.includes("chunked")) {
          const reader = response.body?.getReader();
          let decoder = new TextDecoder();
          let buffer = "";

          if (reader) {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                setLoading(false);
                break;
              }

              buffer += decoder.decode(value, { stream: true });

              while (buffer.includes("\n")) {
                const splitPoint = buffer.indexOf("\n");
                const chunk = buffer.substring(0, splitPoint);
                buffer = buffer.substring(splitPoint + 1);

                if (chunk.startsWith("data: ")) {
                  const jsonStr = chunk.substring("data: ".length);
                  try {
                    const parsedData: ChatChunk = JSON.parse(jsonStr);
                    console.log(parsedData)
                    const messageContents = parsedData.choices
                      .map((choice) => choice.delta.content)
                      .join("\n");

                    setMessages((oldMessages) => {
                      const otherMessages = oldMessages.filter(
                        (msg) => msg.id !== assistantMessageId
                      );
                      const existingAssistantMsg = oldMessages.find(
                        (msg) => msg.id === assistantMessageId
                      );
                      const updatedContent = existingAssistantMsg
                      ? existingAssistantMsg.content + messageContents
                      : messageContents;

                      const updatedWeb = {
                        ...existingAssistantMsg?.web,
                        Analyzing_URL: parsedData.Web.Analyzing_URL,
                        Query: existingAssistantMsg?.web?.Query || parsedData.Web.Query,
                      };

                      const updateCode = {
                        ...existingAssistantMsg?.code,
                        php_result: parsedData.Code?.php_result || existingAssistantMsg?.code?.php_result,
                        Python3_result: parsedData.Code?.Python3_result || existingAssistantMsg?.code?.Python3_result,
                      };
                      return [
                      ...otherMessages,
                      {
                        id: assistantMessageId,
                        role: "assistant",
                        content: updatedContent,
                        code: updateCode,
                        web: updatedWeb,
                        wait: parsedData.Wait,
                        image_url: parsedData.image_url,
                        ExternID: parsedData.id,
                        model: parsedData.model,
                      },
                    ];
                    });
                  } catch (error) {
                    console.error("Error parsing stream chunk:", error);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Fetching error: ", error);
        setLoading(false);
      }
    },
    [api, additionalData, input, messages]
  );

  return {
    messages,
    isLoading,
    handleSubmit,
    input,
    setInput,
    handleInputChange,
  };
}
/*

import { useState, useCallback, useEffect } from "react";
import { ChatChunk, Message } from "../shared/types";

interface AdditionalData {
  [key: string]: any;
}

interface UseGigaAIParams {
  api: string;
  additionalData?: AdditionalData;
  initialMessages: Message[];
}

export default function useGigaAI({
  api = "api/chat",
  additionalData,
  initialMessages,
}: UseGigaAIParams) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
=======
  const [messages, setMessages] = useState<Message[]>(initialMessages );

  const [isLoading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
>>>>>>> 276d16f12f9676b4192d76a535959e00ef085e1b
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    []
  );
 
  

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const userMessageWithId: Message = {
        id: generateId(),
        role: "user",
        content: input,
      };

      setMessages((oldMessages) => [...oldMessages, userMessageWithId]);
      setLoading(true);
      setInput("");

      const messagesToSend = messages.map(({ role, content }) => {
        return { role, content };
      });

      // Dodanie ostatniej wiadomości użytkownika
      messagesToSend.push({ role: "user", content: userMessageWithId.content });

      const assistantMessageId = generateId();

      try {
        const response = await fetch(`${api}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messagesToSend,
            additionalData,
            stream: true,
          }),
        });

        const transferEncoding = response.headers.get("Transfer-Encoding");
        const Text = response.headers.get("Content-Type");
        console.log(Text);
        if (Text && Text.includes("text/plain")) {
          const RawRes = await response.text();
          console.log(RawRes);
          setMessages((oldMessages) => [
            ...oldMessages,
            {
              id: assistantMessageId,
              role: "assistant",
              content: RawRes,
            },
          ]);
          setLoading(false);
        }

        if (transferEncoding && transferEncoding.includes("chunked")) {
          const reader = response.body?.getReader();
          let decoder = new TextDecoder();
          let buffer = "";

          if (reader) {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                setLoading(false);
                break;
              }

              buffer += decoder.decode(value, { stream: true });

              while (buffer.includes("\n")) {
                const splitPoint = buffer.indexOf("\n");
                const chunk = buffer.substring(0, splitPoint);
                buffer = buffer.substring(splitPoint + 1);

                if (chunk.startsWith("data: ")) {
                  const jsonStr = chunk.substring("data: ".length);
                  try {
                    const parsedData: ChatChunk = JSON.parse(jsonStr);

                    const messageContents = parsedData.choices
                      .map((choice) => choice.delta.content)
                      .join("\n");

                    setMessages((oldMessages) => {
                      const otherMessages = oldMessages.filter(
                        (msg) => msg.id !== assistantMessageId
                      );
                      const existingAssistantMsg = oldMessages.find(
                        (msg) => msg.id === assistantMessageId
                      );
                      const updatedContent = existingAssistantMsg
                        ? existingAssistantMsg.content + messageContents
                        : messageContents;

                        const updatedWeb = {
                          // Tutaj zachowujemy istniejące pola 'web'
                          ...existingAssistantMsg?.web,
                          // Aktualizujemy 'Analyzing_URL' z każdym chunkiem
                          Analyzing_URL: parsedData.Web.Analyzing_URL,
                          // Zachowujemy 'Query' - jeśli istnieje już w 'existingAssistantMsg', nie podmieniamy go
                          Query: existingAssistantMsg?.web?.Query || parsedData.Web.Query,
                        };

                        const updateCode = {
                          ...existingAssistantMsg?.code,
                          php_result: parsedData.Code?.php_result || existingAssistantMsg?.code?.php_result,
                          Python3_result: parsedData.Code?.Python3_result || existingAssistantMsg?.code?.Python3_result,
                        };
                        return [
                        ...otherMessages,
                        {
                          id: assistantMessageId,
                          role: "assistant",
                          content: updatedContent,
                          code: updateCode,
                          web: updatedWeb,
                          wait: parsedData.Wait,
                          image_url: parsedData.image_url,
                          ExternID: parsedData.id,
                          model: parsedData.model,
                        },
                      ];
                    });
                  } catch (error) {
                    console.error("Error parsing stream chunk:", error);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Fetching error: ", error);
        setLoading(false);
      }
    },
    [api, additionalData, input, messages]
  );

  return {
    messages,
    isLoading,
    handleSubmit,
    input,
    setInput,
    handleInputChange,
  };
}


*/