import baseAxios from '..'

type InfoData = {
  userId: number
  id: number
  title: string
  body: string
}

export function getPostInfo(path: string) {
  const url = Math.random() > 0.5 ? 'posts' : 'postsErr'
  return baseAxios.get<DataResponse<InfoData>>(`/${url}/${path}`)
}
