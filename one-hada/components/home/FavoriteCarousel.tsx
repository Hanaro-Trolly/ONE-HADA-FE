import Link from 'next/link';
import JSONtoUrl from '@/lib/JSONtoUrl';
import { HistoryElementType, Shortcut } from '@/lib/datatypes';
import { Button } from '../ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

const FavoriteCarousel = ({
  favoriteList,
  handleButtonClick,
}: {
  favoriteList: Shortcut[];
  handleButtonClick: (shortcutElements: HistoryElementType) => void;
}) => (
  <div className='flex justify-center'>
    <Carousel
      opts={{ align: 'start', loop: true }}
      className='h-16 w-full flex justify-between items-center'
    >
      <CarouselPrevious variant='ghost' size='xl' className='mb-[14px]' />
      <CarouselContent>
        {favoriteList.map((item, idx) => (
          <CarouselItem key={idx}>
            <Link href={JSONtoUrl(item.shortcutElements)}>
              <Button
                id={'favoriteBtn-' + item.shortcutId}
                variant='home'
                className='h-16 w-full mx-2 font-medium rounded-x bg-white hover:bg-[#F0F0F0]'
                onClick={() => handleButtonClick(item.shortcutElements)}
              >
                <label className='overflow-ellipsis overflow-hidden whitespace-nowrap'>
                  {item.shortcutName}
                </label>
              </Button>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext variant='ghost' size='xl' className='mb-[14px]' />
    </Carousel>
  </div>
);

export default FavoriteCarousel;
