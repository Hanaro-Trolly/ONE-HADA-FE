import { Button } from '../ui/button';

type MenuButtonProps = {
  label: string;
  targetId: string;
};

export default function MenuButton({ label, targetId }: MenuButtonProps) {
  const scrollToSection = () => {
    const section = document.getElementById(label);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div>
      <Button
        id={`menuButtonScrollDown${targetId}`}
        onClick={scrollToSection}
        size='sm'
        className='rounded-2xl h-7 w-auto bg-[#61B89F] hover:bg-[#AEDBCE]'
      >
        {label}
      </Button>
    </div>
  );
}
