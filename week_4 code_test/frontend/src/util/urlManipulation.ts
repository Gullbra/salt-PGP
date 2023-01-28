export const getParamFromUrl = (query:string, param:string):(string | string[] | null) => {
  if (!query) return null
  const match = query.match(new RegExp(`([?]|[&])${param}=[^?&]+`, "g"))
  
  return match
    ? param === "filter" 
      ? match.map(item => item.split('=')[1])
      : match[0].split('=')[1]
    : null
}

export const createUrlFromParams = (page:number, limit:number, filters:string[], search:(string | null)):string => {
  return `/?page=${page}&limit=${limit}${
    filters 
      ? filters.map(filter => `&filter=${filter}`).join('')
      : ""
  }${search ? `&search=${search}`: ""}`
}