import { UserState } from '@/lib/backend/recommendation/category/userState'
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter'
import { RankingSystem } from '@/lib/backend/recommendation/category/rankingSystem'
import { findData } from '@/lib/backend/database'
import TripModel, { ITrip } from '@/models/TripSchema'
import getCategory from '../../updateData/getCategoryList'
import IGetRCMPlaceData from './IGetRCMdata'

export class RecommendationSystem {
  userState: UserState
  chosenPlace: string[]
  filter: UserFilter
  rankingSystem: RankingSystem

  constructor() {
    this.userState = new UserState()
    this.chosenPlace = []
    this.filter = new UserFilter()
    this.rankingSystem = new RankingSystem()
  }

  recommend() {
    if (this.userState) {
      this.rankingSystem.rankingUserState(this.userState)
    }
    if (this.filter) {
      this.rankingSystem.rankingUserFilter(this.filter)
    }
    if (this.chosenPlace) {
      this.rankingSystem.rankingChosenPlaces(this.chosenPlace)
    }
    this.rankingSystem.categoryPoints.sort((a, b) => b.point - a.point)
    return this.rankingSystem.categoryPoints
  }

  setFilter(filter: UserFilter) {
    this.filter = filter
  }

  setUserState(userState: UserState) {
    this.userState.setState(
      userState.satiation,
      userState.tiredness,
      userState.thirsty,
    )
  }

  setChosenPlace(chosenPlace: string[]) {
    this.chosenPlace = chosenPlace
  }

  async initRecommendationSystem(rcm_data: IGetRCMPlaceData) {
    try {
      const tripID = rcm_data.tripID
      var trip: ITrip
      const trips: ITrip[] | null = await findData(TripModel, { _id: tripID })
      if (!trips || trips.length === 0) {
        console.log('Trip not found')
        return
      }
      trip = trips[0]
      if (trip.userState) this.setUserState(trip.userState)
      if (trip.userFilter) this.setFilter(trip.userFilter)
      
      if (rcm_data.category_list && rcm_data.category_list.length > 0) 
        this.setChosenPlace(rcm_data.category_list)
      else {
        const chosenPlaceCategory = await getCategory(trip.locationsID)
        if (chosenPlaceCategory) this.setChosenPlace(chosenPlaceCategory)
      }

    } catch (err) {
      console.error('Error initializing recommendation system:', err)
    }
  }

  async getRecommendations(rcm_data: IGetRCMPlaceData) {
    await this.initRecommendationSystem(rcm_data)
    this.rankingSystem.resetScore()
    this.userState.resetState(this.chosenPlace ? this.chosenPlace : [])
    this.recommend()
    return this.rankingSystem.categoryPoints
  }
}

const recommendationSystem = new RecommendationSystem()

export { recommendationSystem }
export default recommendationSystem
