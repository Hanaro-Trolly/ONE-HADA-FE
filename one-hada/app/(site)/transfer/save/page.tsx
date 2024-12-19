'use client';

import { useFetch } from '@/hooks/useFetch';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

interface RedisData {
  amount: string;
  senderAccountId: string;
  senderName: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  receiverAccountId: string;
  receiverName: string;
}

export default function Save() {
  const { data: session } = useSession();
  const { fetchData, error } = useFetch<RedisData>();
  const router = useRouter();
  const isProcessingRef = useRef(false);

  const saveTransfer = useCallback(
    async (transferData: RedisData) => {
      const {
        senderAccountId,
        receiverAccountId,
        senderName,
        receiverName,
        amount,
      } = transferData;

      if (
        senderAccountId &&
        receiverAccountId &&
        senderName &&
        receiverName &&
        amount
      ) {
        const response = await fetchData(`/api/transaction/transfer`, {
          method: 'POST',
          token: session?.accessToken,
          body: {
            fromAccountId: senderAccountId,
            toAccountId: receiverAccountId,
            amount: Number(amount),
            senderMessage: senderName,
            receiverMessage: receiverName,
          },
        });

        if (response.code === 200) {
          return true;
        }
      } else {
        console.error('계좌이체 중 오류 발생');
      }
      return false;
    },
    [session?.accessToken, fetchData]
  );

  const saveHistory = useCallback(
    async (historyData: RedisData) => {
      const {
        senderAccountNumber,
        receiverAccountNumber,
        receiverName,
        amount,
      } = historyData;

      if (
        senderAccountNumber &&
        receiverAccountNumber &&
        receiverName &&
        amount
      ) {
        const response = await fetchData('/api/history', {
          method: 'POST',
          token: session?.accessToken,
          body: {
            historyName: `${receiverName}에게 ${amount} 이체`,
            historyElements: {
              type: 'transfer',
              myAccount: senderAccountNumber,
              receiverAccount: receiverAccountNumber,
              amount: amount,
            },
          },
        });

        return response.code === 200;
      } else {
        console.error('히스토리 저장 중 오류 발생');
      }
      return false;
    },
    [session?.accessToken, fetchData]
  );

  const handleTransfer = useCallback(async () => {
    if (!session?.accessToken || isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      const response = await fetchData('/api/redis/get', {
        method: 'POST',
        body: [
          'amount',
          'senderName',
          'senderAccountId',
          'senderAccountNumber',
          'receiverAccountNumber',
          'receiverName',
          'receiverAccountId',
        ],
      });

      if (response.code === 200) {
        const transferSuccess = await saveTransfer(response.data);
        const historySuccess = await saveHistory(response.data);

        if (transferSuccess && historySuccess) {
          router.push('/transfer/checking');
        }
      }
    } catch (error) {
      console.error('Transfer process failed:', error);
    }
  }, [fetchData, saveTransfer, saveHistory, session?.accessToken, router]);

  useEffect(() => {
    handleTransfer();
  }, [handleTransfer]);

  useEffect(() => {
    if (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  }, [error]);

  return <div>이체 처리 중...</div>;
}
