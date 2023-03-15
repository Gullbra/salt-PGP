import axios from "axios"

export const myFetcheroo = (endpoint: string) => {
  return axios.get(`http://localhost:3005/api/${endpoint}`)
    .then(response => response.data)
}