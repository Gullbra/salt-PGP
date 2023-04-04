import express from 'express';
import { newClient } from '../database/dbConnect';
import { IRoute } from '../interfaces';
import { QueryResult } from 'pg';

export const router = express.Router();

const findConnecting = (routes: IRoute[], departureDestination: string, arrivalDestination: string) => {
  const departureRoutes = routes.filter(route => route.departure_destination === departureDestination)
  const arrivalRoutes = routes.filter(route => route.arrival_destination === arrivalDestination)

  const connectingRoutes = departureRoutes.map(firstConnection => {
    const secondConnection = arrivalRoutes.find(arrRoute => arrRoute.departure_destination === firstConnection.arrival_destination)

    return secondConnection ? [
      firstConnection,
      secondConnection
    ] : []
  }).filter(connection => connection.length > 0)

  return connectingRoutes
}

/**
 *  @param departureDestination
 *  @param arrivalDestination
 *  @param allowConnecting
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

        if (req.query.allowConnecting)
          return {
            directRoutes: 
              routes.filter(route => (
                route.departure_destination === String(req.query.departureDestination) && 
                route.arrival_destination === String(req.query.arrivalDestination)
              )),
            connectingRoutes: 
              findConnecting(routes, String(req.query.departureDestination), String(req.query.arrivalDestination))
          }

        return routes.filter(route => (
          route.departure_destination === String(req.query.departureDestination) && 
          route.arrival_destination === String(req.query.arrivalDestination)
        ))
      })
      .then(filteredRoutes => res.json({status: "Successful retrieval!", data: filteredRoutes}))
      .catch(err => res.json({error: err.message}))
  })

router.route('/api/routes/:routeId')
  .get(async (req, res) => {
    const martinsClient = await newClient()
  
    martinsClient.query(
      `
        SELECT * FROM routes_table 
        WHERE route_id = $1
      `, 
      [req.params.routeId]
    )
    .then((res: QueryResult<IRoute>) => res.rows)
    .then(routes => {
      return routes.length === 0 
        ? res.json({error: "No such route. Return to sender."})
        : res.json({status: "Successful retrieval!", data: routes[0]})
    })
    .catch(err => res.json({err: err.message}))
  })

