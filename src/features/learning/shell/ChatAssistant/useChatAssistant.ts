'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/context/AuthContext';
import { CHAT_ANON_LIMIT } from '@/features/learning/constants/chatAnonQuota';
import type { ChatMessage } from './chatTypes';

export function useChatAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || anonQuotaReached) return;

    const userMessage: ChatMessage = {
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

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errText = err instanceof Error ? err.message : 'No se pudo conectar con el asistente';
      const isLimitError = errText.includes('límite') || errText.includes('429');
      const content = isLimitError
        ? `${errText} Puedes iniciar sesión para seguir chateando.`
        : [
            `Lo siento, ocurrió un error: ${errText}.`,
            'Verifica que OPENAI_API_KEY esté configurada en .env.local',
          ].join(' ');

      const errorMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content,
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
      void handleSend();
    }
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isAnonymous,
    anonRemaining,
    anonQuotaReached,
    messagesEndRef,
    inputRef,
    handleSend,
    handleKeyDown,
  };
}
