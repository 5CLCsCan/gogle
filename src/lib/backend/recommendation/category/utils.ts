import { connectDB, findData } from '@/lib/backend/database'
import { CategoryModel } from '@/models/CategorySchema'

export class Ultils {
  static getCurrentTimePeriod(currentHour: number | null) {
    if (currentHour === null) currentHour = new Date().getHours()

    if (currentHour >= 6 && currentHour < 15) {
      return 'morning'
    } else if (currentHour >= 15 && currentHour < 18) {
      return 'afternoon'
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'night'
    } else {
      return 'lateNight'
    }
  }

  static getNumberOfPeople(num: number) {
    if (num < 5) return 'smallGroup'
    if (num < 10) return 'mediumGroup'
    return 'largeGroup'
  }
}

export class HumanEffectEvaluation {
  satiation: number
  thirsty: number
  tiredness: number
  constructor(satiation: number, thirsty: number, tiredness: number) {
    this.satiation = satiation
    this.thirsty = thirsty
    this.tiredness = tiredness
  }
}

async function fetchCategories(): Promise<string[]> {
  try {
    const category = await findData(CategoryModel, { type: 'mainCategory' })
    if (!category || category.length === 0) {
      console.log('Category not found fetchCategories')
      return []
    }
    const categoryNames: string[] = []
    category.forEach((element: any) => {
      categoryNames.push(...element.value)
    })
    return categoryNames
  } catch (err) {
    console.error('Error initializing recommendation system:', err)
    return []
  }
}

const placeCategory = await fetchCategories()
export { placeCategory }

async function getMainCategoryFunction(): Promise<{ [key: string]: string }> {
  try {
    const category = await findData(CategoryModel, { type: 'mainCategory' })
    if (!category || category.length === 0) {
      console.log('Category not found getMainCategory')
      return {}
    }
    const categoryNames: { [key: string]: string } = {}
    category.forEach((element: any) => {
      element.value.forEach((value: string) => {
        categoryNames[value] = element.name
      })
    })
    return categoryNames
  } catch (err) {
    console.error('Error initializing recommendation system:', err)
    return {}
  }
}

async function categoryEvaluateFunction(): Promise<{
  [key: string]: HumanEffectEvaluation
}> {
  try {
    const category = await findData(CategoryModel, { type: 'mainCategory' })
    if (!category || category.length === 0) {
      console.log('Category not found categoryEvaluate')
      return {}
    }
    return category.reduce((acc: any, c: any) => {
      acc[c.name] = new HumanEffectEvaluation(
        c.point.satiation,
        c.point.thirsty,
        c.point.tiredness,
      )
      return acc
    }, {})
  } catch (err) {
    console.error('Error initializing recommendation system:', err)
    return {}
  }
}

const getMainCategory = await getMainCategoryFunction()
const categoryEvaluate = await categoryEvaluateFunction()

export { getMainCategory, categoryEvaluate }

async function timePeriodsFunction(): Promise<{ [key: string]: string }> {
  try {
    const category = await findData(CategoryModel, { type: 'timeLimit' })
    if (!category || category.length === 0) {
      console.log('Time periods not found')
      return {}
    }
    const timePeriods: { [key: string]: string } = {}
    category.forEach((element: any) => {
      timePeriods[element.name] = element.value
    })
    return timePeriods
  } catch (err) {
    console.error('Error initializing recommendation system:', err)
    return {}
  }
}

const timePeriods = await timePeriodsFunction()
export { timePeriods }
