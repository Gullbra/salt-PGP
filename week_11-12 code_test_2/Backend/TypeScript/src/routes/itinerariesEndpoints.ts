import express from 'express';
import { newClient } from '../database/dbConnect';
import { IItinerary, IPrices } from '../interfaces';
import { QueryResult } from 'pg';

export const router = express.Router();

const objectifyItinerary = ((itinerary:IItinerary & IPrices) => {
  return {
    flight_id: itinerary.flight_id,
    departure_at: itinerary.departure_at,
    arrival_at: itinerary.arrival_at,
    available_seats: itinerary.available_seats,
    prices: {
      currency: itinerary.currency,
      adult: itinerary.adult,
      child: itinerary.child
    }
  }
})


/**
 *  @param lowLimit
 *  @param highLimit
 *  @param queryType (priceAdult, priceChild, timeDeparture, timeArrival)
 */ 
router.route('/api/routes/:routeId/itineraries')
  .get(async(req, res) => {
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
          default: throw new Error('unable to define "queryColumn"')
        }
      }) ()

      return martinsClient.query(
        `
          SELECT it.*, pr.currency, pr.adult, pr.child
          FROM itineraries_table it
            INNER JOIN prices_table pr
              ON it.flight_id = pr.flight_id
          WHERE it.route_id = $1 AND ${queryColumn} > $2 AND ${queryColumn} < $3
          ORDER BY ${queryColumn};
        `, 
        [req.params.routeId, limits[0], limits[1]]
      )
    }) ()
    
    queryPromise 
      .then(queryRes => res.json(queryRes.rows.map(itinerary => objectifyItinerary(itinerary))))
      .catch(err => res.json({error: err.message}))
  })

router.route('/api/routes/:routeId/itineraries/:flightId')
  .get(async(req, res) => {
    const martinsClient = await newClient()
  
    martinsClient.query(
      `
        SELECT it.*, pr.currency, pr.adult, pr.child
        FROM itineraries_table it
          INNER JOIN prices_table pr
            ON it.flight_id = pr.flight_id
        WHERE it.route_id = $1 AND it.flight_id = $2
      `, 
      [req.params.routeId, req.params.flightId]
    )
    .then((res: QueryResult<IItinerary & IPrices>) => res.rows)
    .then(itineraries => {
      return itineraries.length === 0 
        ? res.json({error: "No such itinerary. Return to sender."})
        : res.json(objectifyItinerary(itineraries[0]))
    })
    .catch(err => res.json({err: err.message}))    
  })