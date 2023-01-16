
import express, { response } from "express";
import { Request, Response, Application } from 'express';
import axios from 'axios'
import fs from 'fs'
import path from "path";

const app: Application = express()
const port:number = 3000

const fetch = () => {
  return process.env.development
    ? fs.promises
        .readFile(path.join(__dirname, '..', 'mock', 'mock.data.json'))
        .then(data => JSON.parse(data.toString()))
    : axios.get('https://dummyjson.com/posts')
}

app.use(express.json())

app.route('/api/posts')
  .get((req:Request, res:Response) => {
    fetch()
      .then(response => res.json(response.data))
      .catch(err => res.send(err.message))
  })

app.listen(port, () => console.log(`📡 listening to http://localhost:${port}`))