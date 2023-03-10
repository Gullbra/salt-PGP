import express from 'express';
import { newClient } from '../database/dbConnect';
import { IRoute } from '../interfaces';
import { QueryResult } from 'pg';

export const router = express.Router();

/**
 *  @param departureDestination
 *  @param arrivalDestination
 */ 
router.route('/api/routes')
  .get(async (req, res) => {
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
      .then(filteredRoutes => res.json({status: "Successful retrieval!", data: filteredRoutes}))
      .catch(err => res.json({error: err.message}))
      .finally(() => martinsClient.end())
  })

router.route('/api/routes/:routeId')
  .get(async (req, res) => {
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
  
      return res.json({status: "Successful retrieval!", data: routes[0]})
    })
  })

