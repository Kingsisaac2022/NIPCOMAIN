import { OpenAI } from 'openai';
import DataTracker from '../middleware/DataTracker';

class ChatService {
  private static instance: ChatService;
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    this.openai = new OpenAI({
      apiKey: key,
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not set');
    }

    try {
      const dataTracker = DataTracker.getInstance();
      const recentEvents = dataTracker.getEventLog().slice(-5);

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant for the NIPCO Smart Station Manager platform. You have access to recent system events and can provide insights about station operations."
          },
          {
            role: "user",
            content: `Recent events: ${JSON.stringify(recentEvents)}\n\nUser question: ${message}`
          }
        ],
      });

      return response.choices[0].message.content || 'No response generated';
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }
}

export default ChatService;