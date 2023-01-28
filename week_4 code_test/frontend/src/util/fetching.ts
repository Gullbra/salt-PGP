import { IResponseData } from "../interfaces/interfaces"
import axios from "axios"

export default async function fetching (
  page:number, limit:number, getTypes:boolean=false, filter?:(string[] | null)
):Promise<{ data: IResponseData}> {

  const DEV_ENV = {
    DEV_domain: "http://localhost:3001"
  }
  
  let url = `${DEV_ENV.DEV_domain}/api/milk/?page=${page}&limit=${limit}`
  if (getTypes){
    url += `&getTypes=${getTypes}`
  }
  if (filter) {
    filter.forEach(item => {
      url += `&filter=${item}`
    })
  }

  return axios
    .get(url)
    .finally(() => console.log("📮 axios called"))
}
