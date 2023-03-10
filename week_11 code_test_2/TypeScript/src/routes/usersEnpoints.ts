import express from 'express';
import { newClient } from '../database/dbConnect';
import { IUser, IBooking, IItinerary } from '../interfaces';
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

      return res.json({status: "Succesful retrieval!", data: users[0]})
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

      return res.json({status: "Succesful retrieval!", data: bookings})
    })
  })
  .post(async(req, res) => {
    const newBooking = [
      req.params.userId,
      String(req.body.flightId),
      Number(req.body.noOfAdultTickets),
      Number(req.body.noOfChildTickets)
    ]

    if(!req.body.flightId || !Number.isInteger(newBooking[2]) || !Number.isInteger(newBooking[3]))
      return res.json({error: "Invalid data. Return to sender.", body: req.body})

    const martinsClient = await newClient()
    martinsClient.query(
      `
        SELECT available_seats FROM itineraries_table
        WHERE flight_id = $1
      `,
      [req.body.flightId]
    )
    .then((res: QueryResult<{available_seats: number}>) => res.rows[0].available_seats)
    .then(currentSeatsAvaibale => {
      const requestedSeats = Number(req.body.noOfAdultTickets) + Number(req.body.noOfChildTickets)
      if (currentSeatsAvaibale < requestedSeats)
        return res.json({error: "Not enough available seats on flight"})

      const savingBooking: Promise<QueryResult<IBooking>> = martinsClient.query(
        `
          INSERT INTO users_bookings_table(
            user_id,
            flight_id,
            adult_tickets,
            child_tickets
          )
          VALUES( $1, $2, $3, $4 )
          RETURNING *;
        `, 
        newBooking
      )

      const updatingAvailableSeats: Promise<QueryResult<IItinerary>> = martinsClient.query(
        `
          UPDATE itineraries_table
          SET available_seats = $1
          WHERE flight_id = $2
          RETURNING *;
        `,
        [currentSeatsAvaibale - requestedSeats, newBooking[1]]
      )

      Promise.all([savingBooking, updatingAvailableSeats])
        .then(result => res.json({
          status: "successful insert!", 
          data: {
            newBooking: result[0].rows[0],
            updatedFlight: {
              flight_id: result[1].rows[0].flight_id,
              available_seats: result[1].rows[0].available_seats,
              seats_available_before: currentSeatsAvaibale
            }
          }
        }))
        .catch(err => res.json({error: err.message}))
    })
    .catch(err => res.json({error: err.message}))
  })