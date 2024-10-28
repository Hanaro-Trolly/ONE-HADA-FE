import { ButtonHTMLAttributes } from 'react';
import { Button } from '../ui/button';

type AccountTypeButtonProps = {
  account_type: string;
  onClick: () => void;
  children: React.ReactNode; // children 속성 추가
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function AccountTypeButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  account_type,
  onClick,
  children,
  ...rest
}: AccountTypeButtonProps) {
  return (
    <Button
      id={account_type}
      className='px-4 py-2 bg-[#61B89F] text-black rounded-[2rem] hover:bg-[#377b68]'
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
}