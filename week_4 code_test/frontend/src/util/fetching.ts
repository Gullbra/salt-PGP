import { IResponseData } from "../interfaces/interfaces"
import axios from "axios"

export default async function fetching (page:number, limit:number, getTypes:boolean=false, filter?:(string | null)):Promise<{ data: IResponseData} | void> {
  const devENV = {
    DEV_domain: "http://localhost:3001"
  }
  
  let url = `${devENV.DEV_domain}/api/milk/?page=${page}&limit=${limit}`
  if (getTypes){
    url += `&getTypes=${getTypes}`
  }
  if (filter) {
    url += `&filter=${filter}`
  }

  return axios
    .get(url)
    .catch(err => console.error(err))
    .finally(() => console.log("📮 axios called"))
}
