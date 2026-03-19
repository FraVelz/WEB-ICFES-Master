'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faXmark, faPaperPlane, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener respuesta');
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Lo siento, ocurrió un error: ${err instanceof Error ? err.message : 'No se pudo conectar con el asistente'}. Verifica que OPENAI_API_KEY esté configurada en .env.local`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center text-white border-2 border-cyan-400/50"
        aria-label="Abrir asistente de chat"
      >
        <FontAwesomeIcon icon={faMessage} className="text-xl" />
      </button>

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(400px,calc(100vw-3rem))] h-[min(500px,70vh)] bg-slate-900/98 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-cyan-600/30 to-blue-600/30 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Asistente ICFES</h3>
                <p className="text-xs text-cyan-300/80">Responde tus dudas</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar chat"
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faMessage} className="text-2xl text-cyan-400" />
                </div>
                <p className="text-slate-400 text-sm mb-2">¿Tienes preguntas sobre el ICFES?</p>
                <p className="text-slate-500 text-xs">Escribe aquí y te ayudaré con tus dudas</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-blue-500/30'
                      : 'bg-cyan-500/30'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={msg.role === 'user' ? faUser : faRobot}
                    className={msg.role === 'user' ? 'text-blue-400' : 'text-cyan-400'}
                  />
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-blue-500/30 border border-blue-500/30 rounded-br-md'
                      : 'bg-slate-800/80 border border-slate-700/50 rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="text-sm text-white leading-relaxed [&_p]:my-1 [&_ul]:my-2 [&_ol]:my-2 [&_li]:ml-4 [&_code]:bg-slate-700/50 [&_code]:px-1 [&_code]:rounded [&_strong]:font-semibold">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full shrink-0 bg-cyan-500/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRobot} className="text-cyan-400" />
                </div>
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl text-white hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
