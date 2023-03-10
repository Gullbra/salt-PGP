import express from 'express';
import { newClient } from '../database/dbConnect';
import { IUser, IBooking } from '../interfaces';
import { QueryResult } from 'pg';
import { validateUserMiddleware } from './middleware/validateUser'

export const router = express.Router();

router.route('/api/users/:userId')
  .all(validateUserMiddleware)
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
    .catch(err => res.json({error: err.message}))
  })

router.route('/api/users/:userId/bookings')
  .all(validateUserMiddleware)
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
      req.params.userId,
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
      VALUES( $1, $2, $3, $4 )
      RETURNING *;
    `, newBooking
    )
    .then(res => res.rows)
    .then(data => res.json({status: "successful insert!" ,data}))
    .catch(err => res.json({error: err.message}))
  })