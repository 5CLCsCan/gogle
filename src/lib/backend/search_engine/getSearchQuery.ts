import { connectDB } from '../database'
import mongoose from 'mongoose'

async function getSearchQuery(query: string, limit: number = 10): Promise<any> {
  try {
    const db = await connectDB()

    const collection = db.connection.collection('places') // Replace with your actual collection name

    const result = await collection
      .aggregate([
        {
          $search: {
            index: 'searchLocation',
            text: {
              query: query,
              path: ['name', 'address', 'category'], // Specify the fields to search
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
        {
          $addFields: {
            exactMatch: {
              $cond: {
                if: {
                  $or: [
                    {
                      $regexMatch: {
                        input: '$name',
                        regex: query,
                        options: 'i',
                      },
                    },
                    {
                      $regexMatch: {
                        input: '$address',
                        regex: query,
                        options: 'i',
                      },
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
            score: { $meta: 'searchScore' }, // Get the Atlas Search score
          },
        },
        {
          $sort: {
            exactMatch: -1, // Sort by exact match first
            score: -1, // Then sort by Atlas Search score
            //score: { $meta: 'searchScore' }, // Sort by Atlas Search score
          },
        },
        {
          $limit: limit,
        },
      ])
      .toArray()

    return result
  } catch (err) {
    console.error('Error during aggregation:', err)
    throw err
  }
}

export { getSearchQuery }
