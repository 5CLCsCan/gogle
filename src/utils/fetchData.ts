const URL = 'https://www.gogle.studio/api'

const updateToken = async () => {
  const response = await fetch(`${URL}/auth/gettoken`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
  const token = await response.json()
  localStorage.setItem('accessToken', token.token)
}

export const fetchData = async (
  method: string,
  endpoint: string,
  depth: number = 0,
  body?: object,
): Promise<Response> => {
  if (depth > 1) {
    throw new Error('Cannot get token')
  }
  console.log(body)

  const response = await fetch(`${URL}/${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(body),
  })

  if (response.status === 401) {
    await updateToken()
    return fetchData(method, endpoint, depth + 1, body)
  }

  return response
}
