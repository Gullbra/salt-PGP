import express from "express";
import { Request, Response, Application } from 'express';
import fs from 'fs'
import path from "path";
import cors from 'cors';

const app: Application = express()
const port: number = 3001

export interface IMilk {
  name: string
  type: string
  storage: number
  id: string
}

app.use(cors({origin: ['http://localhost:3000']}));
app.use(express.json())

app.route('/api/milk')
  .get((req:Request, res:Response) => {

    const pageLimit = req.query.limit ? Number(req.query?.limit) : 6
    const page = req.query.page ? Number(req.query?.page) : 1
    const getTypes = String(req.query.getTypes) === "true"
    const filters = req.query.filter
      ? String(req.query.filter).split(',')
      : null

    fs.promises
      .readFile(path.join(__dirname, '..', '..','mock', 'db.milk.json'))
      .then(data => JSON.parse(data.toString()))
      .then(response => {
        if (getTypes) {
          const setOfTypes = new Set()
          response.results.forEach((product: IMilk) => {
            setOfTypes.add(product.type)
          });

          response.types = Array.from(setOfTypes)
        }

        if (filters) {
            const filteredResults = response.results.filter((product: IMilk) => {
              return filters.includes(product.type)
            });

          response.results = filteredResults
          response.count = filteredResults.length
        }

        response.results = response.results.splice((page-1)*pageLimit, pageLimit)
        res.json(response)
      })
      .catch(err => res.send(err.message))
  })

app.listen(port, () => console.log(`📡 listening to http://localhost:${port}`))