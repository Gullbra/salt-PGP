import fs from 'fs'
import path from 'path'

export const fetcheroo = async () => {
  return fs.promises
    .readFile(path.join(__dirname, '..', '..', 'mock', 'data.json'))
    .then(data => JSON.parse(data.toString()))
}