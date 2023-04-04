import express from 'express'
import cors from 'cors'

import { dbInit } from './database/dbInit'
import { router as flightRoutesEnpoints } from "./routes/flightRoutesEnpoints";
import { router as itinerariesEndpoints } from "./routes/itinerariesEndpoints";
import { router as usersEnpoints } from "./routes/usersEnpoints";
import { router as connectionsEndpoints } from "./routes/connectionsEndpoints";

const app = express()
const envObj = { port: 3005 }

app.use(express.json())
app.use(cors({ origin: ['http://localhost:3000'] }))
app.use('/', flightRoutesEnpoints)
app.use('/', itinerariesEndpoints)
app.use('/', usersEnpoints)
app.use('/', connectionsEndpoints)

app.route('/api/supersecret').all((_, res) => {dbInit(); return res.json({status: "Purging and re-seeding db"})})
app.route('*').get((_, res) => res.send(`<h1>404 - Nothing here</h1>\n<p>Try <a href=\"http://localhost:${envObj.port}/api/\">/api/</a>instead<p>`))

app.listen(envObj.port, () => console.log(`\n📡 server listening to http://localhost:${envObj.port}\n`))
