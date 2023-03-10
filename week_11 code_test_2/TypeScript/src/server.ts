import express from 'express'
import { fetcheroo } from './dataFetcher'
import { IItinerary, IRoute, IUser, IBooking, IPrices } from './interfaces'
import { validateUserMiddleware } from './validateUser'
import { newClient } from './database/dbConnect'
import { dbInit } from './database/dbInit'
import { QueryResult } from 'pg'

// dbInit()
const app = express()
app.use(express.json())

const envObj = { port: 3005 }


/**
 *  @param departureDestination
 *  @param arrivalDestination
 */ 
app.route('/api/routes').get(async (req, res) => {
  const martinsClient = await newClient()
  martinsClient.query(`SELECT * FROM routes_table;`)
    .then((result: QueryResult<IRoute>)  =>  result.rows)
    .then(routes => {
      if(!req.query.departureDestination && !req.query.arrivalDestination) 
        return routes

      if (!req.query.departureDestination)
        return routes.filter(route => route.arrival_destination === String(req.query.arrivalDestination))

      if (!req.query.arrivalDestination)
        return routes.filter(route => route.departure_destination === String(req.query.departureDestination))

      return routes.filter(route => (
        route.departure_destination === String(req.query.departureDestination) && 
        route.arrival_destination === String(req.query.arrivalDestination)
      ))
    })
    .then(filteredRoutes => res.json(filteredRoutes))
    .catch(err => res.json({error: err.message}))
    .finally(() => martinsClient.end())
})
app.route('/api/routes/:routeId').get(async (req, res) => {
  const martinsClient = await newClient()

  martinsClient.query(`
    SELECT * FROM routes_table 
    WHERE route_id = $1
  `, [req.params.routeId]
  )
  .then((res: QueryResult<IRoute>) => res.rows)
  .then(routes => {
    if (routes.length === 0)
      return res.json({error: "No such route. Return to sender."})

    return res.json(routes[0])
  })
})


/**
 *  @param lowLimit
 *  @param highLimit
 *  @param queryType (priceAdult, priceChild, timeDeparture, timeArrival)
 */ 
app.route('/api/routes/:routeId/itineraries').get(async(req, res) => {
  const martinsClient = await newClient()
  
  if (!req.query.queryType) {
    await martinsClient.query('SELECT * FROM itineraries_table')
      .then(result => res.json(result.rows))
    return
  }

  const queryType = String(req.query.queryType)

  if (!["priceAdult", "priceChild", "timeDeparture", "timeArrival"].includes(queryType)) {
    await martinsClient.query('SELECT * FROM itineraries_table')
      .then(result => res.json(result.rows))
    return
  }

  const queryPromise: Promise<QueryResult<IItinerary & IPrices>> = (() => {
    const limits = (() => {
      if (["priceAdult", "priceChild"].includes(queryType)) {
        return [
          Number(req.query.lowLimit) || 0, 
          Number(req.query.highLimit) || 10000
        ]
      }

      const lowStr = String(req.query.lowLimit); const highStr = String(req.query.highLimit)

      const validateOrDefaultLow = !isNaN(new Date(lowStr).getTime())
        ? lowStr
        : new Date(Date.now()).toUTCString()

      const validateOrDefaultHigh = !isNaN(new Date(highStr).getTime())
        ? highStr
        : new Date(Date.now() + 7 * 24 * 3600 *1000).toUTCString()

      return [validateOrDefaultLow, validateOrDefaultHigh]
    }) ()

    const queryColumn = (() => {
      switch (queryType) {
        case "priceAdult": return "pr.adult";
        case "priceChild": return "pr.child";
        case "timeDeparture": return "it.departure_at";
        case "timeArrival": return "it.arrival_at";
        default: throw new Error('error: unable to define "queryColumn"')
      }
    }) ()

    return martinsClient.query(
      `
        SELECT it.*, pr.currency, pr.adult, pr.child
        FROM itineraries_table it
          INNER JOIN prices_table pr
            ON it.flight_id = pr.flight_id
        WHERE it.route_id = $1 AND ${queryColumn} >= $2 AND ${queryColumn} =< $3
        ORDER BY ${queryColumn};
      `, 
      [req.params.routeId, limits[0], limits[1]]
    )
  }) ()
  
  queryPromise 
    .then(queryRes => res.json(queryRes.rows))
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
    .then((res: QueryResult<IUser>) => res.rows)
    .then(users => {
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
    .then((res: QueryResult<IBooking>) => res.rows)
    .then(bookings => {
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

      /* 
        * Testdata:
        1
        5f7a09b5
        2
        3
      */

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
