import { fetchEventSource, EventSourceMessage } from '@microsoft/fetch-event-source';

const API_URL = process.env.NEXT_PUBLIC_API_SERVER_URL || 'https://blog.api.baekgwa.site';

export interface ChatStreamPayload {
  sentence: string;
  filter: string[];
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface ChatStreamOptions {
  onMessage: (data: string) => void;
  onDone: () => void;
  onError: (error: unknown) => void;
  onRateLimitInfo?: (info: RateLimitInfo) => void;
}

export async function streamChat(payload: ChatStreamPayload, options: ChatStreamOptions) {
  const { onMessage, onDone, onError, onRateLimitInfo } = options;
  const ctrl = new AbortController();
  let isDone = false;

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
        const limit = Number(response.headers.get('X-RateLimit-Limit'));
        const remaining = Number(response.headers.get('X-RateLimit-Remaining'));
        const reset = Number(response.headers.get('X-RateLimit-Reset'));

        if (response.status === 429) {
          const retryAfter = Number(response.headers.get('Retry-After')) || undefined;
          if (onRateLimitInfo && !isNaN(limit) && !isNaN(remaining) && !isNaN(reset)) {
            onRateLimitInfo({ limit, remaining, reset, retryAfter });
          }
          const errText = await response.text();
          throw new Error(`rate_limit_exceeded:${retryAfter ?? 0}:${errText}`);
        }

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Failed to connect: ${response.status} ${errText}`);
        }

        if (onRateLimitInfo && !isNaN(limit) && !isNaN(remaining) && !isNaN(reset)) {
          onRateLimitInfo({ limit, remaining, reset });
        }
      },
      onmessage: (event: EventSourceMessage) => {
        if (!event.event || event.event === 'message') {
          try {
            const data = JSON.parse(event.data);
            const token = data.token;

            if (token) {
              onMessage(token);
            }
          } catch {
            if (event.data) {
              onMessage(event.data);
            }
          }
        } else if (event.event === 'done') {
          if (!isDone) {
            isDone = true;
            onDone();
            ctrl.abort();
          }
        }
      },
      onclose: () => {
        if (!isDone) {
          isDone = true;
          onDone();
        }
      },
      onerror: (err) => {
        onError(err);
        ctrl.abort();
        throw err;
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      onError(err);
    } else if (!(err instanceof Error)) {
      onError(err);
    }
  }
}
