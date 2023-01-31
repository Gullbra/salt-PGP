import { IPagination, IResponseData } from "../interfaces/interfaces"
import axios from "axios"

export default async function fetching ({page, limit, filters, search}:IPagination, getTypes?:boolean):Promise<{ data: IResponseData }> {

  const DEV_ENV = {
    DEV_domain: "http://localhost:3001"
  }
  
  let url = `${DEV_ENV.DEV_domain}/api/milk/?page=${page}&limit=${limit}`
  if (filters) {
    filters.forEach(item => {
      url += `&filter=${item}`
    })
  }
  if (search) {
    url += `&search=${search}`
  }
  if (getTypes){
    url += `&getTypes=${getTypes}`
  }

  return axios
    .get(url)
    .finally(() => console.log("📮 axios called"))
}
