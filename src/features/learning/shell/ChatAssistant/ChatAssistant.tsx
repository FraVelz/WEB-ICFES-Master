'use client';

import { useCallback } from 'react';
import { ChatLauncher } from './ChatLauncher';
import { ChatPanel } from './ChatPanel';
import { useChatAssistant } from './useChatAssistant';

export function ChatAssistant() {
  const {
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
  } = useChatAssistant();

  const handleOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <>
      {!isOpen && <ChatLauncher onOpen={handleOpen} />}
      <ChatPanel
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        isTyping={isTyping}
        isAnonymous={isAnonymous}
        requiresLogin={requiresLogin}
        inputValue={inputValue}
        onInputChange={setInputValue}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
        onKeyDown={handleKeyDown}
        onSend={() => void handleSend()}
      />
    </>
  );
}
