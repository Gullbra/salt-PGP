
import express from "express";
import { Request, Response, Application } from 'express';

const app: Application = express()

// if (process.argv[2] && !isNaN(process.argv[2])) throw new Error('Invalid port')
// const port = process.argv[2] || 3000
const port:number = 3000
const fetchUrl:string = process.env.development
  ? '../mock/mock.data.ts'
  : 'https://dummyjson.com/posts'


app.use(express.json())

app.route('/api/posts')

app.listen(port, () => console.log(`📡 listening to http://localhost:${port}`))