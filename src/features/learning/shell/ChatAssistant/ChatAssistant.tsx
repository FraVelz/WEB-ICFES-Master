'use client';

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
    anonRemaining,
    anonQuotaReached,
    messagesEndRef,
    inputRef,
    handleSend,
    handleKeyDown,
  } = useChatAssistant();

  return (
    <>
      <ChatLauncher isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />
      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isTyping={isTyping}
        isAnonymous={isAnonymous}
        anonRemaining={anonRemaining}
        anonQuotaReached={anonQuotaReached}
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
