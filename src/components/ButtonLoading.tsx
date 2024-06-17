import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'

type ButtonLoadingProps = {
  isLoading: boolean
  text: string
  onClick?: () => void
}

export default function ButtonLoading({
  isLoading,
  text,
  onClick,
}: ButtonLoadingProps) {
  return (
    <Button
      disabled={isLoading}
      className='rounded-full text-lg py-6 font-normal'
      onClick={onClick}
    >
      {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : text}
    </Button>
  )
}
