import { Place as PlaceType } from '@/types'
import { Button } from './ui/button'
import { PlusCircleIcon } from 'lucide-react'

interface PlaceProps extends PlaceType {
  onClick: (id: string) => void
}

export default function Place({ name, imgLink, _id, onClick }: PlaceProps) {
  return (
    <div>
      <div className='relative hover:after:'>
        <img className='rounded-lg' src={imgLink} alt='Placeholder' key={_id} />
        <div className='opacity-0 hover:opacity-100 w-full left-0 right-0 bg-white/80 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl text-white font-semibold'>
          <Button
            onClick={() => {
              onClick(_id)
            }}
            variant='default'
          >
            <PlusCircleIcon />
          </Button>
        </div>
      </div>
      <h2 className='text-sm text-center'>{name}</h2>
    </div>
  )
}
