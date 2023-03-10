import express from 'express';
import { newClient } from '../database/dbConnect';
import { IItinerary, IPrices } from '../interfaces';
import { QueryResult } from 'pg';

export const router = express.Router();


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