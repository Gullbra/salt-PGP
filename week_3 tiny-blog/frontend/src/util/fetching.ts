import axios from 'axios'
import { IPost } from '../interfaces/interfaces'

const development_mode = true

export const fetcheroo = async (): Promise<{ data: {posts: IPost[]} }> => {

  if (development_mode) {
    const optionObj = { 
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    return fetch('./mock/mock.data.json', optionObj)
      .then(response => response.json())
      .catch(err => console.log(err.message))
  } else {
    return axios.get('https://dummyjson.com/posts')
  }
}
