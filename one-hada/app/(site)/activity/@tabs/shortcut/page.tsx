'use client';

import ShortCutCard from '@/components/molecules/ShortCutCard';
import SmallButton from '@/components/molecules/SmallButton';
import { Edit2Icon, RotateCcwIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteData, getDataByUserId } from '@/lib/api';
import { Shortcut } from '@/lib/datatypes';

export default function ShortCutPage() {
  const [isDelete, setIsDelete] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [shortCuts, setShortCuts] = useState<Shortcut[]>([]);
  const userId = '1'; // 여기서 사용자 ID를 설정하세요.

  useEffect(() => {
    const loadShortCuts = async () => {
      try {
        const data = await getDataByUserId<Shortcut>('shortcut', userId);
        if (data) {
          setShortCuts(data);
        } else {
          console.error('No shortcuts found for the user.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadShortCuts();
  }, [userId]);

  const toggle = () => setIsDelete((prev) => !prev);

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => {
      const newCheckedItems = new Set(prev);
      if (newCheckedItems.has(id)) {
        newCheckedItems.delete(id);
      } else {
        newCheckedItems.add(id);
      }
      return newCheckedItems;
    });
  };

  const deleteHandler = async () => {
    try {
      for (const id of Array.from(checkedItems)) {
        await deleteData('shortcut', id as string);
      }
      setShortCuts((prev) => prev.filter((item) => !checkedItems.has(item.id)));
    } catch (error) {
      console.error('Error deleting shortcuts:', error);
    } finally {
      setCheckedItems(new Set());
      toggle();
    }
  };

  const favoriteList = shortCuts.filter(({ is_Favorite }) => is_Favorite);
  const normalList = shortCuts.filter(({ is_Favorite }) => !is_Favorite);

  return (
    <>
      <li className='h-10 flex items-center w-full justify-between pr-4 py-1'>
        <div></div>
        <div className='mx-2'>
          {isDelete ? (
            <div className='flex gap-2'>
              <SmallButton
                classNames='text-[#666666] bg-white hover:bg-gray-200'
                onClick={toggle}
              >
                <RotateCcwIcon />
                취소
              </SmallButton>
              <SmallButton
                classNames='bg-[#E44B5B] hover:bg-[#B61C2B]'
                onClick={deleteHandler}
              >
                <Trash2Icon />
                삭제
              </SmallButton>
            </div>
          ) : (
            <SmallButton
              classNames='bg-[#5e7887] hover:bg-[#3f505a]'
              onClick={toggle}
            >
              <Edit2Icon />
              편집
            </SmallButton>
          )}
        </div>
      </li>
      <ul
        style={{ maxHeight: 'calc(100vh - 150px)' }}
        className='w-full py-2 overflow-y-scroll'
      >
        {favoriteList.map((item) => (
          <li key={item.id}>
            <ShortCutCard
              id={item.id}
              name={item.shortcut_name}
              isEdit={isDelete}
              isFavorite={true}
              onCheckboxChange={handleCheckboxChange}
            />
          </li>
        ))}
        {normalList.map((item) => (
          <li key={item.id}>
            <ShortCutCard
              id={item.id}
              name={item.shortcut_name}
              isEdit={isDelete}
              isFavorite={false}
              onCheckboxChange={handleCheckboxChange}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
