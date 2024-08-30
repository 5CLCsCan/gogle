import { Martini, Sandwich, Store, TentTree, Utensils } from 'lucide-react'

type Icon = {
  [key: string]: JSX.Element
}

export const icon: Icon = {
  feast: <Utensils />,
  snack: <Sandwich />,
  drink: <Martini />,
  outdoor: <TentTree />,
  indoor: <Store />,
}
