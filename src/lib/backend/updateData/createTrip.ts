import TripModel from '@/models/TripSchema'
import { connectDB, addData } from '@/lib/backend/database'

export interface CreateTripData {
  userEmail: string
  startDate: Date
  startTime: string
  locations?: string[]
  sharedEmails: string[]
}

export default async function createTrip(
  data: CreateTripData,
): Promise<boolean> {
  await connectDB()
  const { userEmail, startDate, startTime, locations, sharedEmails } = data
  const newTrip = new TripModel({
    userEmail: userEmail,
    startDate: startDate,
    startTime: startTime,
    locations: locations,
    sharedEmails: sharedEmails,
  })

  console.log('new trip:' + newTrip)
  const status = await addData(newTrip)
  return status
}
