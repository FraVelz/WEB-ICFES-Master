'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { ChatMessage } from './chatTypes';

export function useChatAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAnonymous = !user;
  const requiresLogin = isAnonymous;

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
    if (!trimmed || requiresLogin) return;

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
        const authRequired = data.code === 'AUTH_REQUIRED' || res.status === 401;
        const message = authRequired
          ? 'Debes iniciar sesión para usar el asistente.'
          : data.error || 'Error al obtener respuesta';
        throw new Error(message);
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
      const isAuthError = errText.includes('iniciar sesión');
      const content = isAuthError
        ? `${errText} Ve a la página de inicio de sesión para continuar.`
        : isLimitError
          ? `${errText} Puedes seguir estudiando en la ruta de aprendizaje.`
          : `Lo siento, ocurrió un error: ${errText}. Intenta de nuevo en unos momentos.`;

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
    requiresLogin,
    messagesEndRef,
    inputRef,
    handleSend,
    handleKeyDown,
  };
}
