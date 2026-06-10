'use client';

import { cn } from '@/utils/cn';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Icon } from '@/shared/components/Icon';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { CHAT_ANON_LIMIT } from '@/features/learning/constants/chatAnonQuota';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const chatPanelRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideUp',
    duration: 0.3,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [anonUsed, setAnonUsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAnonymous = !user;
  const anonRemaining = Math.max(0, CHAT_ANON_LIMIT - anonUsed);
  const anonQuotaReached = isAnonymous && anonUsed >= CHAT_ANON_LIMIT;

  const syncAnonQuota = useCallback(async () => {
    if (user) {
      setAnonUsed(0);
      return;
    }

    try {
      const token = supabase && (await supabase.auth.getSession()).data.session?.access_token;
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/chat', { credentials: 'same-origin', headers });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.anonUsed === 'number') {
        setAnonUsed(data.anonUsed);
      }
    } catch {
      // Quota display falls back to 0; POST still enforces the server limit.
    }
  }, [user]);

  useEffect(() => {
    syncAnonQuota();
  }, [syncAnonQuota]);

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

    if (anonQuotaReached) {
      return;
    }

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

      const token = supabase && (await supabase.auth.getSession()).data.session?.access_token;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 && typeof data.anonUsed === 'number') {
          setAnonUsed(data.anonUsed);
        }
        throw new Error(data.error || 'Error al obtener respuesta');
      }

      if (isAnonymous && typeof data.anonUsed === 'number') {
        setAnonUsed(data.anonUsed);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errText = err instanceof Error ? err.message : 'No se pudo conectar con el asistente';
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          errText.includes('límite') || errText.includes('429')
            ? `${errText} Puedes iniciar sesión para seguir chateando.`
            : `Lo siento, ocurrió un error: ${errText}. Verifica que OPENAI_API_KEY esté configurada en .env.local`,
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
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-28 left-6 z-10 flex h-14 w-14 cursor-pointer items-center justify-center',
          'lg:right-6 lg:bottom-6 lg:left-auto',
          'border-app-accent/50 from-cta-from to-cta-to rounded-full border-2 bg-linear-to-r',
          'shadow-app-ring/30 text-white shadow-lg transition-all duration-300 hover:scale-110',
          'hover:shadow-app-ring/50 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
          'focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950'
        )}
        aria-label="Abrir asistente de chat"
      >
        <Icon name="message" size="xl" />
      </button>

      {/* Panel de chat */}
      {isOpen && (
        <div
          ref={chatPanelRef}
          className={cn(
            'fixed z-50 flex h-[min(500px,70vh)] flex-col overflow-hidden rounded-2xl',
            'border-app-ring/30 shadow-app-ring/20 border bg-slate-900/98 shadow-2xl backdrop-blur-xl',
            'right-3 bottom-24 left-3 w-auto',
            'sm:right-6 sm:left-auto sm:w-[min(400px,calc(100vw-3rem))]'
          )}
        >
          {/* Header */}
          <div className="border-app-ring/20 from-app-accent-strong/30 flex items-center justify-between border-b bg-linear-to-r to-blue-600/30 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="from-cta-from to-cta-to flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r">
                <Icon name="robot" className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Asistente ICFES</h3>
                <p className="text-app-accent-muted/80 text-xs">
                  {isAnonymous
                    ? anonQuotaReached
                      ? 'Límite de invitado alcanzado'
                      : `${anonRemaining} pregunta${anonRemaining !== 1 ? 's' : ''} gratis sin cuenta`
                    : 'Responde tus dudas'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={cn(
                'cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-900'
              )}
              aria-label="Cerrar chat"
            >
              <Icon name="times" size="lg" />
            </button>
          </div>

          {/* Message list */}
          <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="bg-app-ring/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Icon name="message" size="xl" className="text-app-accent" />
                </div>
                <p className="mb-2 text-sm text-slate-400">¿Tienes preguntas sobre el ICFES?</p>
                <p className="text-xs text-slate-500">
                  {isAnonymous
                    ? `Sin cuenta puedes hacer hasta ${CHAT_ANON_LIMIT} preguntas.`
                    : 'Escribe aquí y te ayudaré con tus dudas'}
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    msg.role === 'user' ? 'bg-ambient-a/30' : 'bg-app-ring/30'
                  )}
                >
                  <Icon
                    name={msg.role === 'user' ? 'user' : 'robot'}
                    className={msg.role === 'user' ? 'text-blue-400' : 'text-app-accent'}
                  />
                </div>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5',
                    msg.role === 'user'
                      ? 'bg-ambient-a/30 rounded-br-md border border-blue-500/30'
                      : 'rounded-bl-md border border-slate-700/50 bg-slate-800/80'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div
                      className={cn(
                        'text-sm leading-relaxed text-white [&_code]:rounded [&_code]:bg-slate-700/50 [&_code]:px-1',
                        '[&_li]:ml-4 [&_ol]:my-2 [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-2'
                      )}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-white">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="bg-app-ring/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <Icon name="robot" className="text-app-accent" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-slate-700/50 bg-slate-800/80 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span
                      className="bg-hub-orb h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="bg-hub-orb h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="bg-hub-orb h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="min-w-0 border-t border-slate-700/50 bg-slate-900/50 p-3 sm:p-4">
            {anonQuotaReached ? (
              <p className="text-center text-sm text-slate-300">
                Has usado las {CHAT_ANON_LIMIT} preguntas gratis.{' '}
                <Link
                  href="/login"
                  className={cn(
                    'text-app-accent hover:text-app-accent-muted rounded font-semibold underline',
                    'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    'focus-visible:ring-offset-slate-900'
                  )}
                >
                  Inicia sesión
                </Link>{' '}
                para seguir.
              </p>
            ) : (
              <div className="flex min-w-0 items-stretch gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu pregunta..."
                  disabled={isTyping}
                  className={cn(
                    'min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-white',
                    'sm:px-4 sm:py-3 sm:text-base',
                    'focus:border-app-ring placeholder-slate-500 transition-all focus:ring-2',
                    'focus:ring-app-ring/30 focus:outline-none disabled:opacity-60'
                  )}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Enviar mensaje"
                  className={cn(
                    'from-cta-from to-cta-to shrink-0 cursor-pointer rounded-xl bg-linear-to-r px-3 py-2.5 text-white',
                    'sm:px-4 sm:py-3',
                    'hover:from-app-accent-strong transition-all hover:to-blue-700 disabled:cursor-not-allowed',
                    'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:opacity-50',
                    'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
                  )}
                >
                  <Icon name="paper-plane" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
