import { IPagination } from "../interfaces/interfaces"

export const getParamFromUrl = (query:string, param:string):(string | string[] | null) => {
  if (!query) return null
  const match = query.match(new RegExp(`([?]|[&])${param}=[^?&]+`, "g"))
  
  return match
    ? param === "filter" 
      ? match.map(item => item.split('=')[1])
      : match[0].split('=')[1]
    : null
}

/*
interface IPagination {
  page: number
  limit: number
  maxPages?: number
  filters: string[]
  search: string | null
}
*/

export const createUrlFromParams = ({page, limit, filters, search}:IPagination ):string => {
  return `/?page=${page}&limit=${limit}${
    filters 
      ? filters.map(filter => `&filter=${filter}`).join('')
      : ""
  }${search ? `&search=${search}`: ""}`
}