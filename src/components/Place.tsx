import { Place as PlaceType } from '@/types'
import { Button } from './ui/button'
import {
  InfoIcon,
  LoaderCircle,
  MinusCircle,
  PlusCircleIcon,
} from 'lucide-react'
import { Suspense, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { formatter } from '@/lib/utils'

interface PlaceProps extends PlaceType {
  variant?: 'selected' | 'default'
  onClick: (id: string) => void
}

export default function Place({
  name,
  imgLink,
  _id,
  onClick,
  variant,
  openingTime,
  priceRange,
  address,
}: PlaceProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div key={_id}>
        <div className='relative hover:after:'>
          {isLoading && <LoaderCircle className='animate-spin mx-auto' />}
          <img
            className='rounded-lg'
            src={imgLink}
            alt='Placeholder'
            key={_id}
            onLoad={() => setIsLoading(false)}
          />
          <div className='gap-2 opacity-0 hover:opacity-100 w-full left-0 right-0 bg-white/80 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl text-white font-semibold'>
            <Button
              onClick={() => {
                onClick(_id)
              }}
              variant='default'
            >
              {variant === 'selected' ? <MinusCircle /> : <PlusCircleIcon />}
            </Button>
            <Button variant='default'>
              <InfoIcon
                onClick={() => {
                  setIsOpen(true)
                }}
              />
            </Button>
          </div>
        </div>

        <h2 className='text-sm text-center'>{name}</h2>
      </div>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(prev => !prev)
        }}
      >
        <DialogContent className='z-[9999]'>
          <DialogHeader>
            <DialogTitle className='mb-4 text-2xl'>Place details</DialogTitle>
            <DialogDescription>
              <div className='flex gap-4 w-full'>
                <img src={imgLink} alt={name} className='w-1/2 rounded-md' />
                <div>
                  <h3 className='text-primary text-xl'>{name}</h3>
                  <p className='text-lg text-black'>{address}</p>
                  <p>
                    From {openingTime ? openingTime[0] : '8:00'} to{' '}
                    {openingTime ? openingTime[1] : '22:00'}
                  </p>
                  <p>
                    Around{' '}
                    {priceRange
                      ? `${formatter.format(
                          priceRange[0],
                        )} - ${formatter.format(priceRange[1])}`
                      : 'VND 50,000 - VND 100,000'}
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                onClick(_id)
                setIsOpen(false)
              }}
              variant='default'
            >
              {variant === 'selected' ? 'Remove from trip' : 'Add to trip'}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              type='button'
              variant='secondary'
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
