export interface Survivor {
  id: number
  name: string
  age: number
  gender: string
  last_location: [number, number]
  inventory?: {
    water: number
    food: number
    medication: number
    ammunition: number
  }
  infected?: boolean
}
