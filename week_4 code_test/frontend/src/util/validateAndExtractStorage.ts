import { ICartItem } from "../interfaces/interfaces";

export function validateAndExtractStorage (storage:string | undefined):ICartItem[] {
  if (!storage) return [] as ICartItem[]

  const parsedStorage = JSON.parse(storage) 
  for(let i=0; i < parsedStorage.length; i++) {
    if(!parsedStorage[i].name || !parsedStorage[i].id || !parsedStorage[i].type || !parsedStorage[i].count) {
      localStorage.removeItem("cartState")
      return [] as ICartItem[]
    }
  }

  return parsedStorage
}