import axios from "axios"

export const myFetcheroo = (endpoint: string, options?: { params: {[key: string]: string | number} }) => {
  // ? Was there a reason for writing this like this?
  // const optionsObj = (() => {
  //   if (options?.params)
  //     return { params: options.params }

  //   return {}
  // }) ()
  const optionsObj = options?.params
    ? { params: options.params }
    : {}

  return axios.get(`http://localhost:3005/api/${endpoint}`, optionsObj)
    .then(response => response.data)
}