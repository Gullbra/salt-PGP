import { IResponseData } from "../interfaces/interfaces"
import axios from "axios"

export default async function fetching (page:number, limit:number, getTypes:boolean=false, filter?:(string | string[] | null)):Promise<{ data: IResponseData}> {
  const devENV = {
    DEV_domain: "http://localhost:3001"
  }
  
  let url = `${devENV.DEV_domain}/api/milk/?page=${page}&limit=${limit}`
  if (getTypes){
    url += `&getTypes=${getTypes}`
  }
  if (filter) {
    if(Array.isArray(filter)) {
      filter.forEach(item => {
        url += `&filter=${item}`
      })
    } else {
      url += `&filter=${filter}`
    }
  }

  return axios
    .get(url)
    .finally(() => console.log("📮 axios called"))
}
