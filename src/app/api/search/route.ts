import { getSearchQuery } from '@/lib/backend/search_engine/getSearchQuery'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')

    if (!query) {
      throw new Error('Query parameter is missing')
    }

    const result = await getSearchQuery(query)

    return new Response(JSON.stringify(result), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), { status: 500 })
  }
}
