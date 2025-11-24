import { ApiResponse, fetchApi } from '@/lib/api-client';

export interface AiChatBotHealthCheckResponse {
  database: string;
  llm: string;
  available: boolean;
}

export async function getChatbotHealthCheck(): Promise<ApiResponse<AiChatBotHealthCheckResponse>> {
  return fetchApi<AiChatBotHealthCheckResponse>('/ai/health', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
