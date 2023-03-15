import fs from 'fs'
import path from 'path'

export const fetcheroo = async (file: string) => {
  return fs.promises
    .readFile(path.join(__dirname, '..', '..', '..', 'mock', `${file}.json`))
    .then(data => JSON.parse(data.toString()))
}