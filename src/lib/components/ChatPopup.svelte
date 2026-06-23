<script>
  /**
   * ChatPopup
   * =========
   * Floating chat widget that connects to the Retell chat agent
   * via the FastAPI backend at /api/v1/chloe/chat-bot/*.
   */

  import { chloeApi } from '$lib/api/chloe';

  let isOpen = false;
  let chatId = null;
  let messages = []; // { role: 'user' | 'agent', content: string }
  let inputText = '';
  let isLoading = false;
  let error = '';
  let messagesEl;

  function toggleOpen() {
    isOpen = !isOpen;
    if (isOpen && chatId === null) {
      initChat();
    }
  }

  async function initChat() {
    isLoading = true;
    error = '';
    try {
      const data = await chloeApi.createChatSession();
      chatId = data.chat_id;
      console.log('[ChatPopup] chat_id set to:', chatId);
    } catch (e) {
      error = e.message || 'Failed to start chat';
      console.error('[ChatPopup] create session error:', e);
    } finally {
      isLoading = false;
    }
  }

  async function sendMessage() {
    const content = inputText.trim();
    if (!content || isLoading || !chatId) return;

    inputText = '';
    messages = [...messages, { role: 'user', content }];
    isLoading = true;
    error = '';
    scrollToBottom();

    try {
      console.log('[ChatPopup] sending message:', { chat_id: chatId, content });
      const data = await chloeApi.sendChatMessage(chatId, content);

      const reply = data.content;
      if (reply) {
        messages = [...messages, { role: 'agent', content: reply }];
      } else {
        // Fallback if backend didn't format nicely
        messages = [...messages, { role: 'agent', content: JSON.stringify(data) }];
      }
    } catch (e) {
      const isChatEnded =
        e.status === 400 ||
        (e.message && e.message.includes('400')) ||
        e.message === 'chat_ended' ||
        e?.data?.detail === 'chat_ended';
      if (isChatEnded) {
        messages = [...messages, { role: 'system', content: 'Chat ended.' }];
        chatId = null;
        error = '';
      } else {
        error = e.message || 'Failed to send message';
      }
      console.error('[ChatPopup] send message error:', e);
    } finally {
      isLoading = false;
      scrollToBottom();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 30);
  }

  function resetChat() {
    chatId = null;
    messages = [];
    error = '';
    inputText = '';
    initChat();
  }
</script>

<!-- ── Floating trigger button ─────────────────────────────────── -->
<button
  class="chat-toggle"
  on:click={toggleOpen}
  aria-label={isOpen ? 'Close chat' : 'Open chat with Chloe'}
>
  {#if isOpen}
    <!-- X icon -->
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  {:else}
    <!-- Chat bubble icon -->
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  {/if}
</button>

<!-- ── Chat window ─────────────────────────────────────────────── -->
{#if isOpen}
  <div class="chat-window" role="dialog" aria-label="Chloe Chat">
    <!-- Header -->
    <div class="chat-header">
      <div class="header-avatar">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="width:18px;height:18px;"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </div>
      <div>
        <p class="header-name">Chloe</p>
        <p class="header-status">
          {#if isLoading && messages.length === 0}
            <span class="dot dot-amber"></span> Connecting…
          {:else if chatId}
            <span class="dot dot-green"></span> Online
          {:else}
            <span class="dot dot-zinc"></span> Offline
          {/if}
        </p>
      </div>
      <button class="reset-btn" on:click={resetChat} title="Start new chat" aria-label="Reset chat">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="width:14px;height:14px;"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        </svg>
      </button>
    </div>

    <!-- Messages -->
    <div class="messages" bind:this={messagesEl}>
      {#if isLoading && messages.length === 0}
        <div class="empty-state">
          <div class="typing-dots"><span></span><span></span><span></span></div>
          <p>Connecting to Chloe…</p>
        </div>
      {:else if messages.length === 0}
        <div class="empty-state">
          <p class="empty-title">Hi there! 👋</p>
          <p class="empty-sub">Ask me anything — I'm Chloe, your AI assistant.</p>
        </div>
      {:else}
        {#each messages as msg (msg)}
          {#if msg.role === 'system'}
            <div class="system-msg">{msg.content}</div>
          {:else}
            <div class="message-row {msg.role}">
              {#if msg.role === 'agent'}
                <div class="agent-avatar">C</div>
              {/if}
              <div class="bubble {msg.role}">
                {msg.content}
              </div>
            </div>
          {/if}
        {/each}
        {#if isLoading}
          <div class="message-row agent">
            <div class="agent-avatar">C</div>
            <div class="bubble agent typing">
              <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
          </div>
        {/if}
      {/if}

      {#if error}
        <p class="error-msg">{error}</p>
      {/if}
    </div>

    <!-- Input -->
    <div class="chat-input-row">
      <textarea
        class="chat-input"
        placeholder="Type a message…"
        rows="1"
        bind:value={inputText}
        on:keydown={handleKeydown}
        disabled={isLoading || !chatId}
      ></textarea>
      <button
        class="send-btn"
        on:click={sendMessage}
        disabled={isLoading || !chatId || !inputText.trim()}
        aria-label="Send message"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  /* ── Toggle button ────────────────────────────────────── */
  .chat-toggle {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .chat-toggle:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 28px rgba(99, 102, 241, 0.55);
  }
  .icon {
    width: 24px;
    height: 24px;
  }

  /* ── Window ───────────────────────────────────────────── */
  .chat-window {
    position: fixed;
    bottom: 92px;
    right: 24px;
    z-index: 9998;
    width: 360px;
    max-height: 520px;
    background: #fff;
    border-radius: 16px;
    box-shadow:
      0 8px 40px rgba(0, 0, 0, 0.14),
      0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: pop-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.92) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  /* ── Header ───────────────────────────────────────────── */
  .chat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
  }
  .header-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .header-name {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
  }
  .header-status {
    margin: 0;
    font-size: 11px;
    opacity: 0.85;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .dot-green {
    background: #4ade80;
  }
  .dot-amber {
    background: #fbbf24;
    animation: pulse 1s infinite;
  }
  .dot-zinc {
    background: #a1a1aa;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
  .reset-btn {
    margin-left: auto;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 6px;
    color: white;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .reset-btn:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  /* ── Messages ─────────────────────────────────────────── */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #f8f8fc;
    min-height: 0;
    max-height: 360px;
  }
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 8px;
    color: #71717a;
    padding: 24px 0;
  }
  .empty-title {
    font-size: 16px;
    font-weight: 600;
    color: #3f3f46;
    margin: 0;
  }
  .empty-sub {
    font-size: 13px;
    color: #71717a;
    margin: 0;
  }

  .message-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }
  .message-row.user {
    flex-direction: row-reverse;
  }

  .agent-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bubble {
    max-width: 70%;
    padding: 9px 13px;
    border-radius: 14px;
    font-size: 13.5px;
    line-height: 1.5;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .bubble.user {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border-bottom-right-radius: 4px;
  }
  .bubble.agent {
    background: white;
    color: #27272a;
    border: 1px solid #e4e4e7;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }

  .system-msg {
    text-align: center;
    font-size: 12px;
    color: #a1a1aa;
    margin: 8px 0;
    font-style: italic;
  }

  /* ── Typing indicator ─────────────────────────────────── */
  .typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
    height: 16px;
  }
  .typing-dots span {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #a1a1aa;
    animation: bounce 1s infinite;
  }
  .typing-dots span:nth-child(2) {
    animation-delay: 0.15s;
  }
  .typing-dots span:nth-child(3) {
    animation-delay: 0.3s;
  }
  @keyframes bounce {
    0%,
    60%,
    100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-5px);
    }
  }

  /* ── Error ───────────────────────────────────────────── */
  .error-msg {
    font-size: 12px;
    color: #ef4444;
    text-align: center;
    margin: 4px 0 0;
    padding: 6px 10px;
    background: #fef2f2;
    border-radius: 8px;
  }

  /* ── Input ────────────────────────────────────────────── */
  .chat-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid #e4e4e7;
    background: white;
  }
  .chat-input {
    flex: 1;
    resize: none;
    border: 1px solid #e4e4e7;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 13.5px;
    font-family: inherit;
    line-height: 1.4;
    outline: none;
    transition: border-color 0.15s;
    color: #27272a;
    background: #fafafa;
    max-height: 100px;
    overflow-y: auto;
  }
  .chat-input:focus {
    border-color: #6366f1;
    background: white;
  }
  .chat-input::placeholder {
    color: #a1a1aa;
  }
  .chat-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      opacity 0.15s,
      transform 0.15s;
  }
  .send-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: scale(1.05);
  }
  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
