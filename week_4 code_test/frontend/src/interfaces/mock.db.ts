export interface IMilk {
  name: string
  type: string
  storage: number
  id: string
}

export interface IResponseData {
  count: number
  results: IMilk[]
}