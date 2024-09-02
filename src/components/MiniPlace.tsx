import { Minus } from 'lucide-react'
import { Button } from './ui/button'
import { Place as PlaceType } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type MiniPlaceProps = {
  place: PlaceType
  removePlace: (id: string) => void
  index: string
}

export default function MiniPlace({
  place,
  removePlace,
  index,
}: MiniPlaceProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className='relative'
      style={style}
    >
      <img
        src={place.imgLink}
        alt='Placeholder'
        className='h-[60px] w-[60px] rounded-full'
      />
      <Button
        className='absolute top-0 right-0 h-[20px] w-[20px] rounded-full px-0 pointer-events-auto'
        variant='destructive'
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          // e.stopPropagation()

          removePlace(place._id)
        }}
      >
        <Minus size={10} />
      </Button>
    </div>
  )
}
