import express from 'express'
import { fetcheroo } from './dataFetcher'

const app = express()
app.use(express.json())

const envObj = {
  port: 3005
}

interface IItinerary {
  flight_id: string,
  departureAt: string,
  arrivalAt: string,
  availableSeats: number,
  prices: {
    currency: string,
    adult: number,
    child: number
  }
}

interface IRoutes {
  route_id: string,
  departureDestination: string,
  arrivalDestination: string,
  itineraries: IItinerary[]
}

app.route('/api/').get((_, res) => fetcheroo().then(data => res.json(data)))
app.route('/api/routes/').get(async (req, res) => {
  fetcheroo()
    .then((routes:IRoutes[]) => {
      if(!req.query.routeId && (!req.query.departure || !req.query.destination)) 
        return routes

      if(req.query.routeId)
        return routes.filter(route => route.route_id === String(req.query.routeId))

      return routes.filter(route => {
        return (
          route.departureDestination === String(req.query.departure) && 
          route.arrivalDestination === String(req.query.destination)
        )
      })
    })
    .then(filteredRoutes => res.json(filteredRoutes))
    .catch(err => res.json(`Should not be possible, what have you done? \n\n${err.message}`))
})

app.route('*').get((_, res) => res.send(`<h1>404 - Nothing here</h1>\n<p>Try <a href=\"http://localhost:${envObj.port}/api/\">/api/</a>instead<p>`))


app.listen(envObj.port, () => console.log(`📡 server listening to http://localhost:${envObj.port}`))