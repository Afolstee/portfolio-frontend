"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  status?: "sending" | "delivered";
  typewriter?: boolean;
};

const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const onCompleteRef = useRef(onComplete);
  const hasRunRef = useRef(false);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    
    let index = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.substring(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, 40); // 40ms per character typing speed
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const predefinedQuestions = [
  "Do you offer payment plans?",
  "Are you available for a full-time role?",
  "Do you do maintenance after delivery?",
  "What's your working time like?",
  "My other tech hobbies"
];

const predefinedAnswers: Record<string, string> = {
  "Do you offer payment plans?": "Yes! My payment structure is split into two parts. 60% is required upfront before work begins, and the remaining 40% is due upon project completion. This ensures commitment on both sides and keeps the project moving smoothly. If you have a specific arrangement in mind, feel free to bring it up and we can discuss what works best.",
  "Are you available for a full-time role?": "Yes, I am. I am available for remote, hybrid and full-time jobs.",
  "Do you do maintenance after delivery?": "It depends on the scope! Any maintenance or bug fixes related to the original project are covered after delivery. However, if you'd like to add new features or functionality that wasn't part of the initial scope, that would be quoted and charged separately. Either way, I'll always make sure you're informed before any additional costs come up.",
  "What's your working time like?": "I'm based in West Africa Time (WAT, UTC+1). While I'm most active during standard business hours, I'm fairly flexible and can accommodate clients in different time zones. I typically respond to messages within a few hours, and we can always agree on a communication schedule that works for both of us at the start of the project.",
  "My other tech hobbies": "• Creating chatbots!\n• Contributing to open source\n• Exploring new frameworks and tools\n• Sharing dev tips on social media\n• Following tech trends and releases"
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [introComplete, setIntroComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emailTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAskedMoreQuestionsRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      hasAskedMoreQuestionsRef.current = false;
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            sender: "bot",
            text: "Hi there! I am Temilade's assistant. I can help him answer these questions while he is away.",
            typewriter: true
          }
        ]);
      }, 300);
    }
  }, [isOpen, messages.length]);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (awaitingEmail) return;

    inactivityTimerRef.current = setTimeout(() => {
      // Only ask once per session
      if (hasAskedMoreQuestionsRef.current) return;
      hasAskedMoreQuestionsRef.current = true;

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(m => [
          ...m, 
          { id: Date.now().toString(), sender: 'bot', text: "Do you have any other question?" }
        ]);
        
        // Wait another 30 seconds for them to reply, otherwise close
        inactivityTimerRef.current = setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(m2 => [
              ...m2, 
              { id: Date.now().toString(), sender: 'bot', text: "We hope to hear from you soon" }
            ]);
            setTimeout(() => setIsOpen(false), 3000);
          }, 1000);
        }, 30000); 

      }, 1000);
    }, 30000); // Wait 30 seconds before asking
  };

  const startEmailTimeout = () => {
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current);
    
    // First 1-minute timeout
    emailTimerRef.current = setTimeout(() => {
       addBotMessage("Just a reminder, please supply your email so we can get back to you.", 1000, true);
       
       // Second 1-minute timeout
       emailTimerRef.current = setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
             setIsTyping(false);
             setMessages(m => [...m, { id: Date.now().toString(), sender: 'bot', text: "We hope to see you again" }]);
             setTimeout(() => setIsOpen(false), 3000);
          }, 1000);
       }, 60000);
       
    }, 60000);
  };

  const addBotMessage = (text: string, delay = 1500, skipInactivity = false) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "bot",
        text
      }]);
      setIsTyping(false);
      if (!skipInactivity) resetInactivityTimer();
    }, delay);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current);

    const isNo = text.toLowerCase().trim() === "no";
    
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      status: "delivered"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    if (isNo) {
       addBotMessage("We hope to hear from you soon", 1000);
       setTimeout(() => setIsOpen(false), 3500);
       return;
    }

    if (awaitingEmail) {
      setAwaitingEmail(false);
      // Validate email (basic regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(text)) {
        addBotMessage("Thank you! I have forwarded your question to Temilade. He will reply to you soon via email.");
        
        // Collate and send to backend
        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Chatbot User',
              email: text,
              message: pendingQuestion,
              honeypot: ''
            })
          });
        } catch (e) {
          console.error("Failed to forward chat question", e);
        }
      } else {
        addBotMessage("That doesn't look like a valid email. Please try again so Temilade can reach you.", 1500, true);
        setAwaitingEmail(true);
        startEmailTimeout();
      }
      return;
    }

    const matchedAnswer = predefinedAnswers[text] || Object.values(predefinedAnswers).find(a => a.toLowerCase().includes(text.toLowerCase()) && text.length > 10);
    const exactQuestionMatch = predefinedQuestions.find(q => q.toLowerCase() === text.toLowerCase());

    if (matchedAnswer || exactQuestionMatch) {
       const responseToGive = matchedAnswer || predefinedAnswers[exactQuestionMatch!];
       addBotMessage(responseToGive);
    } else {
       setPendingQuestion(text);
       setAwaitingEmail(true);
       addBotMessage("I am only set up to answer specific quick questions. Could you please supply your email? I will collate this question and have Temilade respond to you via email.", 1500, true);
       startEmailTimeout();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-50 group"
          >
            <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 max-h-[600px] h-[80vh] flex flex-col bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0f111a] rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Temilade&apos;s Assistant</h3>
                  <p className="text-xs text-slate-400">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.sender === "user" 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-white/10 text-slate-200 rounded-tl-sm backdrop-blur-md"
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.typewriter ? (
                        <TypewriterText text={msg.text} onComplete={() => setIntroComplete(true)} />
                      ) : (
                        msg.text
                      )}
                    </div>
                    {msg.sender === "user" && msg.status && (
                      <div className="text-[10px] text-blue-200 mt-1 flex justify-end">
                        {msg.status === "delivered" ? "Delivered" : "Sending..."}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 backdrop-blur-md">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (only show initially or when prompted for external) */}
            {messages.length > 0 && introComplete && !awaitingEmail && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {predefinedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs shrink-0 whitespace-nowrap bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white/5 border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={awaitingEmail ? "Enter your email..." : "Type your question..."}
                  className="flex-1 bg-[#1a1d27] border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 rounded-full bg-blue-600 disabled:bg-slate-700 flex items-center justify-center text-white transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
