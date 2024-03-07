import { useState, useCallback } from 'react';
import { ChatChunk, Message, Code, Web } from '../shared/types';

interface AdditionalData {
  [key: string]: any;
}

interface UseGigaAIParams {
  api: string;
  additionalData?: AdditionalData;
}

export default function useGigaAI({
  api="api/chat",
  additionalData
}: UseGigaAIParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }, []);

  
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userMessageWithId: Message = { id: generateId(), role: 'user', content: input };

    setMessages(oldMessages => [...oldMessages, userMessageWithId]);
    setLoading(true);
    setInput('');

    const messagesToSend = messages.map(({ id, ...rest }) => rest);
    messagesToSend.push({ role: 'user', content: userMessageWithId.content });

    const assistantMessageId = generateId();

    try {
      const response = await fetch(`${api}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          additionalData,
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      let decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setLoading(false);
            break;
          }

          // Dekodowanie danych z serwera
          buffer += decoder.decode(value, { stream: true });

          while (buffer.includes('\n')) {
            const splitPoint = buffer.indexOf('\n');
            const chunk = buffer.substring(0, splitPoint);
            buffer = buffer.substring(splitPoint + 1);

            if (chunk.startsWith('data: ')) {
              const jsonStr = chunk.substring('data: '.length);
              try {
                const parsedData : ChatChunk = JSON.parse(jsonStr);

                // Zgromadzony content - nie zmieniamy logiki
                const messageContents = parsedData.choices.map(choice => choice.delta.content).join('\n');

                setMessages(oldMessages => {
                  const otherMessages = oldMessages.filter(msg => msg.id !== assistantMessageId);
                  const existingAssistantMsg = oldMessages.find(msg => msg.id === assistantMessageId);
                  const updatedContent = existingAssistantMsg ? existingAssistantMsg.content + messageContents : messageContents;
                  
                  return [...otherMessages, {
                      id: assistantMessageId,
                      role: 'assistant',
                      content: updatedContent,
                      code: parsedData.Code,
                      web: parsedData.Web,
                      wait: parsedData.Wait,
                      image_url: parsedData.image_url,
                      ExternID: parsedData.id
                  }];
                });
              } catch (error) {
                console.error('Error parsing stream chunk:', error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Fetching error: ', error);
      setLoading(false);
    }
  }, [api, additionalData, input, messages]);

  return { messages, isLoading, handleSubmit, input, setInput, handleInputChange };
}
