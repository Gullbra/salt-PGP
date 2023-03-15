import axios from "axios"

export const myFetcheroo = (endpoint: string, options?: { params: {[key: string]: string | number} }) => {
  const optionsObj = (() => {
    if (options?.params)
      return { params: options.params }

    return {}
  }) ()

  return axios.get(`http://localhost:3005/api/${endpoint}`, optionsObj)
    .then(response => response.data)
}