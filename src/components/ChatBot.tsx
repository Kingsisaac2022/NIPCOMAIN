import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import ChatService from '../services/ChatService';
import Modal from './Modal';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatService = ChatService.getInstance();
      const response = await chatService.sendMessage(input);
      
      const botMessage = { text: response, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors duration-300"
      >
        <MessageSquare size={24} className="text-background" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="AI Assistant"
        className="max-w-4xl w-full mx-4"
      >
        <div className="h-[500px] flex flex-col">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    message.isUser
                      ? 'bg-primary text-background'
                      : 'bg-background text-text'
                  }`}
                >
                  <p className="text-base">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-background text-text p-4 rounded-xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input-field"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 bg-primary text-background rounded-xl hover:bg-primary-hover transition-colors duration-300 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatBot;