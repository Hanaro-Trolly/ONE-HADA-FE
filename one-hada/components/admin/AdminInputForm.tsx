'use client';

import { useAdminWebSocket } from '@/context/admin/AdminWebSocketContext';
import { useCounsel } from '@/context/admin/CounselContext';
import { useAdminSession } from '@/context/admin/SessionContext';
import { useFetch } from '@/hooks/useFetch';
import { useState } from 'react';
import AdminInput from './AdminInput';
import AdminSubmitButton from './AdminSubmitButton';

interface AdminInputFormProps {
  userId: string;
}

interface ConsultationData {
  id: string;
  agentId: string;
  userId: string;
  consultationTitle: string;
  consultationContent: string;
  consultationDate: string;
}

interface ConsultationResponse {
  id: string;
}

export default function AdminInputForm({ userId }: AdminInputFormProps) {
  const { stompClient, setButtonLogs } = useAdminWebSocket();
  const { refetchCounselData } = useCounsel();
  const { session } = useAdminSession();
  const { fetchData, isLoading, error } = useFetch<
    ConsultationResponse,
    ConsultationData
  >();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'title' | 'content'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const consultationData: ConsultationData = {
      id: Date.now().toString(),
      agentId: session.loginUser?.id || '',
      userId: userId,
      consultationTitle: formData.title,
      consultationContent: formData.content,
      consultationDate: new Date().toISOString(),
    };

    try {
      const response = await fetchData('/api/admin/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: consultationData,
      });

      if (response && response.code === 201) {
        // 폼 초기화
        setFormData({ title: '', content: '' });

        // 상담 데이터 즉시 갱신
        await refetchCounselData(userId);

        if (stompClient?.connected) {
          try {
            await stompClient.publish({
              destination: `/topic/customer/${userId}/end-consultation`,
              body: JSON.stringify({
                message: 'consultation_ended',
                timestamp: new Date().toISOString(),
              }),
              headers: {
                'content-type': 'application/json',
              },
            });
            console.log('상담 종료 메시지 전송 완료');
            setButtonLogs([]);
          } catch (error) {
            console.error('웹소켓 메시지 전송 실패:', error);
          }
        } else {
          console.error('웹소켓 연결이 없습니다');
        }

        alert('상담 정보가 등록되었습니다.');
      } else {
        throw new Error('상담 데이터 추가 실패');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className='space-y-6'>
      <AdminInput
        label='상담 제목'
        value={formData.title}
        onChange={(e) => handleInputChange(e, 'title')}
        inputType='text'
      />

      <AdminInput
        label='상담 내용'
        value={formData.content}
        onChange={(e) => handleInputChange(e, 'content')}
        inputType='textarea'
      />

      <div className='flex justify-center'>
        <AdminSubmitButton onClick={handleSubmit} disabled={isLoading} />
      </div>

      {error && <p className='text-red-500'>{error.message}</p>}
    </div>
  );
}
