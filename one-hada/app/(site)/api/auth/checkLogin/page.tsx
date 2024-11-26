'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { fetchAllData } from '@/lib/api';
import { User } from '@/lib/datatypes';

export default function CheckLogin() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const updateSession = useCallback(async () => {
    try {
      const userData = await fetchAllData<User>('user');
      const provider = `user_${session?.user?.provider}` as keyof User;
      const foundUser = userData.find(
        (user) => user[provider] === session?.user.id
      );
      if (foundUser) {
        await update({ id: foundUser.id });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [session, update]);

  useEffect(() => {
    if (status === 'loading') return;
    const handleLogin = async () => {
      if (!session?.user) {
        console.error('No session found!');
        router.push('/api/auth/signin/');
        return;
      }
      //TODO: 유저정보 확인
      try {
        console.log('Sending user data to backend:', {
          userId: session.user.id,
          email: session.user.email,
          name: session.user.name,
          provider: session.user.provider,
        });

        // 백엔드에 사용자 정보 전송하여 세션 ID 발급 요청
        const response = await fetch('http://localhost:8080/api/auth/jwt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.name,
            provider: session.user.provider,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate session ID');

        console.log('Seeion ID generated successfully!');

        if (session.user.isNewUser) {
          router.push('/api/auth/register'); // 새로운 사용자 등록 페이지로 이동
        } else {
          updateSession();
          router.push('/'); // 기존 사용자라면 메인 페이지로 이동
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };

    handleLogin();
  }, [status, session, router, updateSession]);

  return (
    <div
      style={{ height: 'calc(100vh - 56px)' }}
      className=' w-full flex flex-col justify-center items-center '
    >
      <div role='status'>
        <svg
          aria-hidden='true'
          className='inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-main-green'
          viewBox='0 0 100 101'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
            fill='currentColor'
          />
          <path
            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
            fill='currentFill'
          />
        </svg>
      </div>
      <div>
        <div className='mt-6 text-center'>사용자 정보를 찾고있어요</div>
        <div className='text-center '>조금만 기다려주세요</div>
      </div>
    </div>
  );
}
