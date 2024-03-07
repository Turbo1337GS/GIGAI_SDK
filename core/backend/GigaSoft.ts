// src/package/backend/gigasoft.ts

import { ChatOptions } from "./../shared/types";

interface GigasoftOptions {
  API_KEY?: string;
}

export class Gigasoft {
  private API_KEY: string;

  constructor(options: GigasoftOptions = {}) {
    this.API_KEY = options.API_KEY || process.env.GIGAI || "";
  }
  // TODO OCR
  // TODO CHEKCSTATUS <promise>boolean
  // TODO Download List Models
  async chat(options: ChatOptions): Promise<ReadableStream | string> {
    if (!this.API_KEY) {
      throw new Error("Error: Unable to read API key or API key not provided");
    }
    if (!Array.isArray(options.messages)) {
      throw new Error("Error: Message data must be in array format");
    }
    if (options.max_tokens === undefined) {
      console.log(
        "Warning: max_tokens parameter not provided; setting to 4000"
      );
    }
    if (!options.model) {
      throw new Error(
        "Model name not provided! Check the list of models at https://main.gigasoft.com.pl/v2/chat/completions"
      );
    }
    const URL: string = "https://main.gigasoft.com.pl/v2/chat/completions";

    console.log("URL: ", URL);
    const apiResponse = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model,
        stream: options.stream,
        messages: options.messages,
        ...(options.image_base && { image_url: options.image_base }),
        functions: options.tools,
      }),
    });
    if (!apiResponse.ok) {
      throw new Error("Error: Problems with api GigaSoft!");
    }
    if (options.stream === true) {
      const stream = new ReadableStream({
        async start(controller) {
          const reader = apiResponse.body!.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        },
      });
      return stream;
    } else return await apiResponse.text();
  }
}

export default Gigasoft;
