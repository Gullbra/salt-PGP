export const getParamFromUrl =(query:string, param:string):(string | string[] | null) => {
  if (!query) return null
  const match = query.match(new RegExp(`([?]|[&])${param}=[^?&]+`, "g"))
  return match
    ? match.length > 1 
      ? match.map(item => item.split('=')[1])
      : match[0].split('=')[1]
    : null
}