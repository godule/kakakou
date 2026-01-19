import React, { useState, useRef, useEffect } from 'react';
import { askTCMExpert } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '您好，我是灵枢。请问您想了解关于中药、穴位、诊断或方剂的哪些知识？' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askTCMExpert(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-tcm-200">
      <div className="bg-tcm-800 p-4 text-white flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-full">
            <Sparkles size={24} className="text-yellow-400" />
        </div>
        <div>
            <h2 className="font-serif text-lg font-bold">AI 灵枢助手</h2>
            <p className="text-xs text-tcm-300">由 Gemini 2.5 驱动</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-tcm-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] rounded-2xl p-4 shadow-sm
              ${msg.role === 'user' 
                ? 'bg-tcm-700 text-white rounded-br-none' 
                : 'bg-white text-tcm-800 border border-tcm-200 rounded-bl-none'}
            `}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs font-bold uppercase tracking-wider">
                {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                <span>{msg.role === 'user' ? '您' : '灵枢'}</span>
              </div>
              <div className="prose prose-sm prose-p:my-1 prose-headings:my-2 text-inherit leading-relaxed whitespace-pre-wrap">
                 {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-tcm-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-tcm-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-tcm-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-tcm-400 rounded-full animate-bounce delay-150" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-tcm-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="询问关于脉象、中药禁忌或方剂的问题..."
            className="flex-1 border border-tcm-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tcm-500 bg-tcm-50"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-tcm-800 hover:bg-tcm-900 text-white p-3 rounded-xl disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;