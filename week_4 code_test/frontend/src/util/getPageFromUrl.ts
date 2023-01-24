export const getPageFromUrl =(query:any):(number | null) => {
  if (!query) return 1
  const match = query.match(/\?page=[\d]+/) 
  return match
    ? Number(match[0].split('=')[1])
    : null
}