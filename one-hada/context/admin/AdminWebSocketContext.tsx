'use client';

import { useWebSocket } from '@/hooks/useWebsocket';
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { useAdminSession } from './SessionContext';

interface WebSocketContextType {
  stompClient: any;
  connected: boolean;
  buttonLogs: ButtonLog[];
}

interface ButtonLog {
  customerId: string;
  buttonId: string;
  timestamp: string;
  path: string;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const AdminWebSocketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { session } = useAdminSession();
  const [buttonLogs, setButtonLogs] = useState<ButtonLog[]>([]);
  const { stompClient, connected, connectWebSocket } = useWebSocket({
    role: 'consultant',
  });

  // 로그인 시 웹소켓 연결
  useEffect(() => {
    if (session.loginUser) {
      connectWebSocket();
    }
  }, [session.loginUser]);

  useEffect(() => {
    if (stompClient && connected) {
      // 버튼 클릭 로그 구독
      const buttonSub = stompClient.subscribe(
        '/topic/consultant/button-logs',
        (message) => {
          const log = JSON.parse(message.body);
          setButtonLogs((prev) => [...prev, log]);
        }
      );

      return () => {
        buttonSub.unsubscribe();
      };
    }
  }, [stompClient, connected]);

  return (
    <WebSocketContext.Provider value={{ stompClient, connected, buttonLogs }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useAdminWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      'useAdminWebSocket must be used within an AdminWebSocketProvider'
    );
  }
  return context;
};
