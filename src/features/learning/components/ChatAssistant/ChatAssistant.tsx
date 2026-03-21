'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/shared/components/Icon';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatPanelRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideUp',
    duration: 0.3,
  });
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
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-cyan-400/50 bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/50"
        aria-label="Abrir asistente de chat"
      >
        <Icon name="message" size="xl" />
      </button>

      {/* Panel de chat */}
      {isOpen && (
        <div
          ref={chatPanelRef}
          className="fixed right-6 bottom-24 z-50 flex h-[min(500px,70vh)] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/98 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 bg-linear-to-r from-cyan-600/30 to-blue-600/30 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-blue-600">
                <Icon name="robot" className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Asistente ICFES</h3>
                <p className="text-xs text-cyan-300/80">Responde tus dudas</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Cerrar chat"
            >
              <Icon name="times" size="lg" />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20">
                  <Icon name="message" size="xl" className="text-cyan-400" />
                </div>
                <p className="mb-2 text-sm text-slate-400">
                  ¿Tienes preguntas sobre el ICFES?
                </p>
                <p className="text-xs text-slate-500">
                  Escribe aquí y te ayudaré con tus dudas
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === 'user' ? 'bg-blue-500/30' : 'bg-cyan-500/30'
                  }`}
                >
                  <Icon
                    name={msg.role === 'user' ? 'user' : 'robot'}
                    className={
                      msg.role === 'user' ? 'text-blue-400' : 'text-cyan-400'
                    }
                  />
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'rounded-br-md border border-blue-500/30 bg-blue-500/30'
                      : 'rounded-bl-md border border-slate-700/50 bg-slate-800/80'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="text-sm leading-relaxed text-white [&_code]:rounded [&_code]:bg-slate-700/50 [&_code]:px-1 [&_li]:ml-4 [&_ol]:my-2 [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-white">
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/30">
                  <Icon name="robot" className="text-cyan-400" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-slate-700/50 bg-slate-800/80 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700/50 bg-slate-900/50 p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="cursor-pointer rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 text-white transition-all hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="paper-plane" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
