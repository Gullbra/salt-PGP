import express from 'express'
import { fetcheroo } from './dataFetcher'
import { IItinerary, IRoute, IUser, IBooking } from './interfaces'
import { validateUserMiddleware } from './validateUser'
import { newClient } from './database/dbConnect'
import { dbInit } from './database/dbInit'

// dbInit()
const app = express()
app.use(express.json())

const envObj = { port: 3005 }


/**
 *  @param routeId
 *  @param departure
 *  @param arrival
 */ 
app.route('/api/routes').get(async (req, res) => {
  const martinsClient = await newClient()
  martinsClient.query(`SELECT * FROM routes_table;`)
    .then(result => {console.log("Query res returned", result); return result.rows})
    .then((routes: IRoute[]) => {
      if(!req.query.departure && !req.query.arrival) 
        return routes

      if (!req.query.departure)
        return routes.filter(route => route.arrival_destination === String(req.query.arrival))

      if (!req.query.arrival)
        return routes.filter(route => route.departure_destination === String(req.query.departure))

      return routes.filter(route => (
        route.departure_destination === String(req.query.departure) && 
        route.arrival_destination === String(req.query.arrival)
      ))
    })
    .then(filteredRoutes => res.json(filteredRoutes))
    .catch(err => res.json({error: err.message}))
    .finally(() => martinsClient.end())
})
app.route('/api/routes/:routeId').get(async (req, res) => {
  fetcheroo("data")
    .then((routes: IRoute[]) => {
      const route = routes.find(route => route.route_id === String(req.params.routeId))

      if(!route)
        return res.json({error: "Invalid routeId: No route found"})

      return res.json(route)
    })
    .catch(err => res.json({error: err.message}))
})


/**
 *  @param lowLimit
 *  @param highLimit
 *  @param departure
 *  @param arrival
 */ 
app.route('/api/routes/:routeId/itineraries').get(async(req, res) => {
  const martinsClient = await newClient()

  martinsClient.query(`
    SELECT * FROM itineraries_table 
    WHERE route_id = $1
  `, [req.params.routeId]
  )
    .then(res => res.rows)
    .then((itineraries: IItinerary[]) => {
      if (itineraries.length === 0)
        return []
      
      if (!req.query.lowLimit || !req.query.highLimit || (!req.query.departure && !req.query.arrival))
        return itineraries

      return itineraries.filter(itinerary => {
        const timeItinerary = req.query.departure 
          ? new Date(itinerary.departure_at).getTime()
          : new Date(itinerary.arrival_at).getTime()

        const timeLowLimit = new Date(String(req.query.lowLimit)).getTime()
        const timeHighLimit = new Date(String(req.query.highLimit)).getTime()

        return timeLowLimit <= timeItinerary && timeHighLimit >= timeItinerary
      })
    })
    .then(filteredItineraries => res.json(filteredItineraries))
    .catch(err => res.json({error: err.message}))
})

app.route('/api/users/:userId').all(validateUserMiddleware)
  .get(async(req, res) => {
    const martinsClient = await newClient()

    martinsClient.query(`
      SELECT * FROM users_table 
      WHERE user_id = $1
    `, [req.params.userId]
    )
    .then(res => res.rows)
    .then((users: IUser[]) => {
      if (users.length === 0)
        return res.json({error: "No such user. Return to sender."})

      return res.json(users[0])
    })
  })

app.route('/api/users/:userId/bookings').all(validateUserMiddleware)
  .get(async(req, res) => {
    const martinsClient = await newClient()

    martinsClient.query(`
      SELECT * FROM users_bookings_table 
      WHERE user_id = $1
    `, [req.params.userId]
    )
    .then(res => res.rows)
      .then((bookings: IBooking[]) => {
        if (bookings.length === 0)
          return res.json({error: "No such user. Return to sender."})

        return res.json(bookings)
      })
  })
  .patch(async(req, res) => {
    const martinsClient = await newClient()

    const newBooking = [
      String(req.params.userId),
      String(req.body.flightId),
      Number(req.body.noOfAdultTickets),
      Number(req.body.noOfChildTickets)
    ]

    if(!req.body.flightId || !Number.isInteger(newBooking[2]) || !Number.isInteger(newBooking[3]))
      return res.json({error: "Invalid data. Return to sender.", body: req.body})

    martinsClient.query(`
      INSERT INTO users_bookings_table(
        user_id,
        flight_id,
        adult_tickets,
        child_tickets
      )
      VALUES( $1, $2, $3, $4 );
    `, newBooking
    )
    .then(res => res.rows)
    .then(data => res.json(data))
  })




app.route('*').get((_, res) => res.send(`<h1>404 - Nothing here</h1>\n<p>Try <a href=\"http://localhost:${envObj.port}/api/\">/api/</a>instead<p>`))

app.listen(envObj.port, () => console.log(`📡 server listening to http://localhost:${envObj.port}\n`))
