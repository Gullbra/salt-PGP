export const getParamFromUrl =(query:string, param:string):(string | null) => {
  if (!query) return null
  const match = query.match(new RegExp(`([?]|[&])${param}=[^?&]+`))
  return match
    ? match[0].split('=')[1]
    : null
}