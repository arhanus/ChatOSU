'use client';

import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        role: 'assistant',
        content: data.response,
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main chat area */}
      <div className={`flex-1 flex flex-col`}>
        {/* Header */}
        <header className="h-14 border-b border-white/20 flex items-center px-4">
          
          <h1 className="ml-4 text-lg font-semibold">ChatOSU</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto my-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-white/70">
                <h2 className="text-2xl font-semibold mb-2">ChatOSU</h2>
                <p className="text-sm">How can I help you today?</p>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <Message key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && (
                <div className="py-3">
                  <div className="max-w-3xl mx-auto px-4">
                    <div className="flex gap-3 items-center justify-end">
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm animate-pulse">Thinking...</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500 text-white font-bold flex-shrink-0">
                        AI
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-white/20 p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
} 