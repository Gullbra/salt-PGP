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
    const pageLimit = req.query?.limit ? Number(req.query?.limit) : 6
    const page = req.query?.page ? Number(req.query?.page) : 1

    fs.promises
      .readFile(path.join(__dirname, '..', '..','mock', 'db.milk.json'))
      .then(data => {
        return JSON.parse(data.toString())
      })
      .then(response => {
        if (req.query?.filter === "getAllTypes") {
          const setOfTypes = new Set()
          response.results.forEach((product: IMilk) => {
            setOfTypes.add(product.type)
          });
          response.types = Array.from(setOfTypes)
        } 
        else if (req.query?.filter) {
          const newResults = response.results.filter((product: IMilk) => {
            return product.type === req.query.filter
          });
          response.results = newResults
          response.filteredCount = newResults.length
        }
        return response
      })
      .then(response => {
        res.json({
          ...response, 
          results: response.results.splice(
            (page-1)*pageLimit, pageLimit
          )
        })
      })
      .catch(err => res.send(err.message))
  })

app.listen(port, () => console.log(`📡 listening to http://localhost:${port}`))