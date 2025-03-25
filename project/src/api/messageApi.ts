import { API_BASE, APP_VERSION, APP_SOURCE, DEVICE_ID } from './config';

interface SendMessageResponse {
  status: {
    code: number;
    message: string;
  };
  message: {
    messageID: number;
  };
}

interface SendMessageParams {
  gameID: string;
  message: string;
  sender?: string;
}

interface Message {
  messageID: string;
  gameID: string;
  text: string;
  deviceID: string;
  sender: string;
  created: string;
}

interface GetMessagesResponse {
  status: {
    code: number;
    message: string;
  };
  messages: Message[];
}

export async function getMessagesForGame(gameID: string): Promise<GetMessagesResponse> {
  const response = await fetch(`${API_BASE}/getMessagesForGame`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: APP_SOURCE,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
      gameID
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  const data = await response.json();
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message || 'Failed to fetch messages');
  }

  return data;
}

export async function sendMessageToGameWithSender({
  gameID,
  message,
  sender
}: SendMessageParams): Promise<SendMessageResponse> {
  const response = await fetch(`${API_BASE}/sendMessageToGameWithSender`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: APP_SOURCE,
      appVersion: APP_VERSION,
      deviceID: DEVICE_ID,
      gameID,
      message,
      ...(sender ? { sender } : {})
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  
  if (data.status.code !== 0) {
    throw new Error(data.status.message || 'Failed to send message');
  }

  return data;
} 