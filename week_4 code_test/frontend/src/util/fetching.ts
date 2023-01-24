import { IResponseData } from "../interfaces/interfaces"
import axios from "axios"

export default async function fetching (page:number, limit:number):Promise<{ data: IResponseData} | void> {
  const devENV = {
    DEV_domain: "http://localhost:3001"
  }
  
  return axios
    .get(`${devENV.DEV_domain}/api/milk/?page=${page}&limit=${limit}`)
    .catch(err => console.error(err))
    .finally(() => console.log("📮 axios called"))
}
