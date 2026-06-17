import React, { useState } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { aiApi } from '../../api/ai.api';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const RecruiterChat: React.FC<{ username: string }> = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am the AI Portfolio Assistant for this candidate. Ask me questions about their skills, experience, or projects!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await aiApi.chat(username, nextMessages);
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages([...nextMessages, { role: 'assistant', content: 'Failed to retrieve response from AI twin. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-2xl transition-transform active:scale-95 animate-pulse"
          aria-label="Open AI Recruiter Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat overlay viewport */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-[#111827] border border-border/80 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="bg-[#1f2937] px-4 py-3 border-b border-border/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Recruiter Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages viewport */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-xs leading-relaxed max-h-[340px]">
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div key={idx} className={cn("flex gap-2.5 max-w-[85%]", isAssistant ? "self-start" : "self-end flex-row-reverse")}>
                  <div className={cn("h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-white border", isAssistant ? "bg-primary/10 border-primary/20" : "bg-secondary/10 border-secondary/20")}>
                    {isAssistant ? <Bot size={14} className="text-primary" /> : <User size={14} className="text-secondary" />}
                  </div>
                  <div className={cn("p-3 rounded-xl", isAssistant ? "bg-surface text-gray-300 rounded-tl-none border border-border/40" : "bg-primary text-white rounded-tr-none")}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex gap-2.5 max-w-[85%] self-start animate-pulse">
                <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-xl bg-surface text-gray-400 rounded-tl-none border border-[#1f2937] flex items-center gap-1">
                  <span>Twin is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Text Input Footer */}
          <div className="p-3 border-t border-border/60 bg-[#111827]/80 flex gap-2">
            <input
              type="text"
              placeholder="Ask about their background..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow bg-surface border border-border/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/80"
              disabled={loading}
            />
            <Button size="sm" onClick={handleSend} isLoading={loading} className="px-3 min-w-0" aria-label="Send Message">
              <Send size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterChat;
