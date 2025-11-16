import { fetchEventSource, EventSourceMessage } from '@microsoft/fetch-event-source';

const API_URL = process.env.NEXT_PUBLIC_API_SERVER_URL || 'https://blog.api.baekgwa.site';

export interface ChatStreamPayload {
  sentence: string;
  filter: string[];
}

export interface ChatStreamOptions {
  onMessage: (data: string) => void;
  onDone: () => void;
  onError: (error: any) => void;
}

const SSE_TIMEOUT = 300_000;

export async function streamChat(payload: ChatStreamPayload, options: ChatStreamOptions) {
  const { onMessage, onDone, onError } = options;
  const ctrl = new AbortController();

  try {
    await fetchEventSource(`${API_URL}/ai/stream/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
      signal: ctrl.signal,
      openWhenHidden: true,

      onopen: async (response) => {
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Failed to connect: ${response.status} ${errText}`);
        }
      },
      onmessage: (event: EventSourceMessage) => {
        if (event.event === 'message') {
          try {
            const data = JSON.parse(event.data);
            const token = data.token;
            onMessage(token);
          } catch (e) {
            console.error('Failed to parse SSE data JSON:', event.data, e);
            onMessage(event.data);
          }
        } else if (event.event === 'done') {
          onDone();
          ctrl.abort();
        }
      },
      onclose: () => {
        console.log('Stream closed by server or client.');
      },
      onerror: (err) => {
        onError(err);
        ctrl.abort();
        throw err;
      },
    });
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError(err);
    }
  }
}
