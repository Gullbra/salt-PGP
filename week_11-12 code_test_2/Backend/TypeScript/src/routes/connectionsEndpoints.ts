import express from 'express';
import { newClient } from '../database/dbConnect';
import { IItinerary, IPrices } from '../interfaces';
import { QueryResult } from 'pg';
import { objectifyItinerary } from '../objectifyItinerary';

export const router = express.Router();

/**
 *  @param lowLimit
 *  @param highLimit
 *  @param queryType (priceAdult, priceChild, timeDeparture, timeArrival) // ! (priceAdult, priceChild) not implemented
 * 
 *  @param firstRouteId
 *  @param secondRouteId
 */ 
router.route('/api/connections')
  .get(async(req, res) => {
    const martinsClient = await newClient()

    if (!req.query.firstRouteId || !req.query.secondRouteId)
      return res.json({error: "Endpoint needs two valid routeId"})

    const queryType = String(req.query.queryType)

    const queryPromise: Promise<QueryResult<IItinerary & IPrices>> = (() => {
      if (['timeDeparture', 'timeArrival'].includes(queryType)) {        
        const limits = (() => {
          const lowStr = String(req.query.lowLimit); const highStr = String(req.query.highLimit)
  
          const validateOrDefaultLow = !isNaN(new Date(lowStr).getTime())
            ? lowStr
            : new Date(Date.now()).toUTCString()
  
          const validateOrDefaultHigh = !isNaN(new Date(highStr).getTime())
            ? highStr
            : new Date(Date.now() + 7 * 24 * 3600 *1000).toUTCString()
  
          return [validateOrDefaultLow, validateOrDefaultHigh]
        }) ()

        const sqlFilter = queryType === 'timeDeparture'
          ? `
          (
            it.route_id = $1
            AND
            it.departure_at >= $3
            AND
            it.departure_at <= $4
          )
          OR
          (
            it.route_id = $2
            AND
            it.departure_at >= $3
          )
          `
          : `
          (
            it.route_id = $1
            AND
            it.arrival_at <= $4
          )
          OR
          (
            it.route_id = $2
            AND
            it.arrival_at >= $3
            AND
            it.arrival_at <= $4
          )
          `

        return martinsClient.query(
          `
            SELECT 
              it.*, pr.currency, pr.adult, pr.child
            FROM itineraries_table it
              INNER JOIN prices_table pr
                ON it.flight_id = pr.flight_id 
            WHERE ${sqlFilter}
            ORDER BY it.route_id, it.departure_at;
          `,
          [
            String(req.query.firstRouteId), 
            String(req.query.secondRouteId),
            ...limits
          ]
        )
      }

      return martinsClient.query(
        `
        SELECT 
          it.*, pr.currency, pr.adult, pr.child
        FROM itineraries_table it
          INNER JOIN prices_table pr
            ON it.flight_id = pr.flight_id 
        WHERE it.route_id = $1 OR it.route_id = $2
        ORDER BY it.route_id, it.departure_at;`,
        [ String(req.query.firstRouteId), String(req.query.secondRouteId) ]
      )
    }) ()
    
    queryPromise
      .then(result => result.rows)
      .then(result => {
        const firstConnections = result.filter(itinerary => itinerary.route_id === String(req.query.firstRouteId))
        const secondConnection = result.filter(itinerary => itinerary.route_id === String(req.query.secondRouteId))

        const connectionSet = (() => {
          return queryType === 'timeDeparture'
            ? firstConnections.map(firstR => {
              const secondIt = secondConnection.find(secondR => new Date(secondR.departure_at) > new Date(firstR.arrival_at))

              return secondIt ? [
                objectifyItinerary(firstR),
                objectifyItinerary(secondIt)
              ] : []
            })
            : secondConnection.map(secondR => {
              const firstIt = firstConnections.find(firstR => new Date(firstR.arrival_at) < new Date(secondR.departure_at))

              return firstIt ? [
                objectifyItinerary(firstIt),
                objectifyItinerary(secondR)
              ] : []
            })
        }) ().filter(connction => connction.length > 0)

        return connectionSet
      })
      .then(result => {
        return result.length === 0 
          ? res.json({ error: "No such itinerary. Return to sender." })
          : res.json({ status: "Successful retrieval!", data: result })
      })
      .catch(err => res.json({error: err.message}))
  })
