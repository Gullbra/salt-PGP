export interface IMilk {
  name: string
  type: string
  storage: number
  id: string
}

export interface IProductState {
  results: IMilk[]
  count: number
  types?: string[]
  filteredCount?: number
}

export interface IResponseData {
  results: IMilk[]
  count: number
  types?: string[]
  filteredCount?: number
}

export interface IPagination {
  page: number
  limit: number
  maxPages?: number
}
