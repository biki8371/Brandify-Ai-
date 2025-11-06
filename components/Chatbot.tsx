import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

const LoadingBubble: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-slate-700 rounded-lg p-3 max-w-xs lg:max-w-md">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setError("Missing API Key. Please configure your environment.");
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
      });
      setMessages([{
        id: 'initial-bot-message',
        role: 'model',
        text: "Hello! How can I help you with your brand today?"
      }]);
    } catch (e) {
      console.error(e);
      setError("Failed to initialize the chatbot. Please check the API key.");
    }
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("Sorry, I couldn't get a response. Please try again.");
      // remove the user message on error to allow resubmission
      setMessages(prev => prev.slice(0, prev.length -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <h2 className="text-lg font-bold text-cyan-300">AI Assistant</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-3 max-w-xs lg:max-w-md whitespace-pre-wrap ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <LoadingBubble />}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="p-4 text-red-400 text-sm">{error}</div>}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading || !!error}
            className="flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !!error}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold p-2 rounded-md transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};
