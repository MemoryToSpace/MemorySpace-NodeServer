// src/types/openai.d.ts
declare module 'openai' {
  export interface ChatCompletionRequestMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  export interface ChatCompletionChoice {
    message: ChatCompletionRequestMessage;
  }

  export interface ChatCompletionResponse {
    choices: ChatCompletionChoice[];
  }

  export interface CreateChatCompletionRequest {
    model: string;
    messages: ChatCompletionRequestMessage[];
  }

  export class OpenAI {
    constructor(_config: { apiKey: string });
    chat: {
      completions: {
        create(_request: CreateChatCompletionRequest): Promise<ChatCompletionResponse>;
      };
    };
  }

  export default OpenAI;
}
