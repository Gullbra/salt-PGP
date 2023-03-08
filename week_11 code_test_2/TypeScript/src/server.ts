import express from 'express'
import { fetcheroo } from './dataFetcher'
import { IItinerary, IRoute, IUser } from './interfaces'
import { validateUserMiddleware } from './validateUser'

const app = express()
app.use(express.json())

const envObj = { port: 3005 }

app.route('/api').get((_, res) => fetcheroo().then(data => res.json(data)))

/**
 *  @param routeId
 *  @param departure
 *  @param arrival
 */ 
app.route('/api/routes').get(async (req, res) => {
  fetcheroo()
    .then((routes: IRoute[]) => {
      if(!req.query.routeId && !req.query.departure && !req.query.arrival) 
        return routes

      if(req.query.routeId)
        return routes.filter(route => route.route_id === String(req.query.routeId))

      if (!req.query.departure)
        return routes.filter(route => route.arrivalDestination === String(req.query.arrival))

      if (!req.query.arrival)
        return routes.filter(route => route.departureDestination === String(req.query.departure))

      return routes.filter(route => (
        route.departureDestination === String(req.query.departure) && 
        route.arrivalDestination === String(req.query.arrival)
      ))
    })
    .then(filteredRoutes => res.json(filteredRoutes))
    .catch(err => res.json(`Should not be possible, what have you done? \n\n${err.message}`))
})

/**
 *  @param lowLimit
 *  @param highLimit
 *  @param departure
 *  @param arrival
 */ 
app.route('/api/routes/:routeId/itineraries').get((req, res) => {
  fetcheroo()
    .then((routes: IRoute[]) => {
      const route = routes.find(route => route.route_id === req.params.routeId)
      
      if (!route) 
        return res.json("Invalid routeId: No route found")

      if (!req.query.lowLimit || !req.query.highLimit || (!req.query.departure && !req.query.arrival))
        return route.itineraries

      return route.itineraries.filter(itinerary => {
        const timeItinerary = req.query.departure 
          ? new Date(itinerary.departureAt).getTime()
          : new Date(itinerary.arrivalAt).getTime()

        const timeLowLimit = new Date(String(req.query.lowLimit)).getTime()
        const timeHighLimit = new Date(String(req.query.highLimit)).getTime()

        return timeLowLimit <= timeItinerary && timeHighLimit >= timeItinerary
      })
    })
    .then(filteredItineraries => res.json(filteredItineraries))
    .catch(err => res.json({error: err.message}))
})

app.route('/api/users/:userId').patch(validateUserMiddleware, (_, res) => res.send("Not implemented"))

app.route('*').get((_, res) => res.send(`<h1>404 - Nothing here</h1>\n<p>Try <a href=\"http://localhost:${envObj.port}/api/\">/api/</a>instead<p>`))

app.listen(envObj.port, () => console.log(`📡 server listening to http://localhost:${envObj.port}`))
