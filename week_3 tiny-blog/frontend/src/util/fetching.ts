import axios from 'axios'
import { IPost } from '../interfaces/interfaces'

const development_mode = true

export const fetcheroo = async (): Promise<{ data: {posts: IPost[]} }> => {
  const optionObj = { 
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  return development_mode
    ? fetch('./mock/mock.data.json', optionObj)
        .then(response => response.json())
    : axios.get('https://dummyjson.com/posts')
}