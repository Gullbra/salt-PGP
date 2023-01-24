export const getParamFromUrl =(query:string, param:string):(number | null) => {
  if (!query) return null
  const match = query.match(new RegExp(`([?]|[&])${param}=[\\d]+`))
  return match
    ? Number(match[0].split('=')[1])
    : null
}