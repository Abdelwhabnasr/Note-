/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, MessageCircle, RefreshCw, Github } from 'lucide-react';
import Markdown from 'react-markdown';
import { mariam } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'أهلاً بك! أنا مريم، رفيقتك الذكية. كيف يمكنني مساعدتك اليوم؟ ✨',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const responseText = await mariam.chat(input, history);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'عذراً، حدث خطأ ما. هل يمكنك المحاولة مرة أخرى؟',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-warm selection:bg-brand-accent/20">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-panel border-b border-brand-ink/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white shadow-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight">مريم AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-ink/50 font-semibold">Personal Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-ink/60 hover:text-brand-ink transition-colors"
          >
            <Github size={20} />
          </a>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-full hover:bg-brand-ink/5 text-brand-ink/60 transition-all"
            title="إعادة ضبط المحادثة"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 overflow-y-auto">
        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  message.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                  message.role === 'user' ? "bg-brand-ink text-white" : "bg-brand-accent text-white"
                )}>
                  {message.role === 'user' ? <User size={16} /> : <MessageCircle size={16} />}
                </div>
                
                <div className={cn(
                  "px-5 py-3 rounded-2xl shadow-sm",
                  message.role === 'user' 
                    ? "bg-brand-ink text-white rounded-tr-none" 
                    : "bg-white text-brand-ink rounded-tl-none border border-brand-ink/5"
                )}>
                  <div className="markdown-body text-sm md:text-base leading-relaxed">
                    <Markdown>{message.text}</Markdown>
                  </div>
                  <div className={cn(
                    "mt-2 text-[10px] opacity-50",
                    message.role === 'user' ? "text-right" : "text-left"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 ml-auto"
            >
              <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white animate-pulse">
                <Sparkles size={16} />
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none border border-brand-ink/5 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-6 bg-gradient-to-t from-brand-warm via-brand-warm to-transparent">
        <div className="max-w-4xl w-full mx-auto relative">
          <div className="relative group">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="اكتب رسالتك هنا..."
              className="w-full bg-white border border-brand-ink/10 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all shadow-lg resize-none text-brand-ink placeholder:text-brand-ink/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
                input.trim() && !isLoading 
                  ? "bg-brand-accent text-white shadow-md hover:scale-105 active:scale-95" 
                  : "bg-brand-ink/5 text-brand-ink/20 cursor-not-allowed"
              )}
            >
              <Send size={20} className="rotate-180" />
            </button>
          </div>
          <p className="text-center mt-3 text-[10px] text-brand-ink/40 font-medium uppercase tracking-widest">
            Powered by Mariam AI • Crafted for your GitHub
          </p>
        </div>
      </footer>
    </div>
  );
}
