import express from 'express'
import { fetcheroo } from './dataFetcher'

const app = express()
app.use(express.json())

const envObj = {
  port: 3005
}

app.route('*').get((_, res) => fetcheroo().then(data => res.json(data)))


app.listen(envObj.port, () => console.log(`📡 server listening to http://localhost:${envObj.port}`))