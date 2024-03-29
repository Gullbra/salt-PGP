import { fetcheroo } from './dataFetcher'
import { newClient } from './dbConnect'
import { IUser } from '../interfaces'
import md5 from 'md5'
import { Client } from 'pg'

const sqlDropTables = `
  DROP TABLE IF EXISTS users_bookings_table;
  DROP TABLE IF EXISTS users_table;
  DROP TABLE IF EXISTS prices_table;
  DROP TABLE IF EXISTS itineraries_table;
  DROP TABLE IF EXISTS routes_table;
`

const sqlCreateTables = `
  CREATE TABLE IF NOT EXISTS routes_table (
    route_id CHAR(8) PRIMARY KEY,
    departure_destination VARCHAR(40),
    arrival_destination VARCHAR(40)
  );

  CREATE TABLE IF NOT EXISTS itineraries_table (
    flight_id CHAR(8) PRIMARY KEY,
    departure_at TIMESTAMPTZ,
    arrival_at TIMESTAMPTZ,
    available_seats SMALLINT
      CONSTRAINT no_overcrowding CHECK (available_seats >= 0),
    route_id VARCHAR(8) REFERENCES routes_table
      ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS prices_table (
    flight_id CHAR(8) REFERENCES itineraries_table
      ON DELETE CASCADE,
    currency VARCHAR(5),
    adult REAL,
    child REAL
  );

  CREATE TABLE IF NOT EXISTS users_table (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    email VARCHAR(40),
    hashed_pwd VARCHAR(40)
  );

  CREATE TABLE IF NOT EXISTS users_bookings_table (
    user_id SERIAL REFERENCES users_table,
    flight_id CHAR(8) REFERENCES itineraries_table,
    adult_tickets SMALLINT,
    child_tickets SMALLINT,
    PRIMARY KEY (user_id, flight_id)
  );
`

const sqlInsertIntoRoutes = `
  INSERT INTO routes_table(
    route_id,
    departure_destination,
    arrival_destination
  )
  VALUES( $1, $2, $3 );
`
const sqlInsertIntoItineraries = `
  INSERT INTO itineraries_table(
    flight_id,
    departure_at,
    arrival_at,
    available_seats,
    route_id
  )
  VALUES( $1, $2, $3, $4, $5 );
`
const sqlInsertIntoPrices = `
  INSERT INTO prices_table(
    flight_id,
    currency,
    adult,
    child
  )
  VALUES( $1, $2, $3, $4 );
`
const sqlInsertIntoUsers = `
  INSERT INTO users_table(
    user_id,
    first_name,
    last_name,
    email,
    hashed_pwd
  )
  VALUES( $1, $2, $3, $4, $5 );
`
const sqlInsertIntoBookings = `
  INSERT INTO users_bookings_table(
    user_id,
    flight_id,
    adult_tickets,
    child_tickets
  )
  VALUES( $1, $2, $3, $4 );
`

interface IRawItinerary {
  flight_id: string,
  departureAt: string,
  arrivalAt: string,
  availableSeats: number,
  prices: {
    currency: string,
    adult: number,
    child: number
  }
}
interface IRawRoute {
  route_id: string,
  departureDestination: string,
  arrivalDestination: string,
  itineraries: IRawItinerary[]
}

const dbPurge = async (martinsClient: Client) => {
  console.log("🔥 Purging db...")

  return martinsClient.query(sqlDropTables)
    .then(() => console.log("... ✔ All tables dropped"))
    .catch(err => console.log({status: "... ❌ All tables NOT dropped", error: err.message}))
    .finally(() => console.log("db leaves purgatory\n"))
}


export const dbInit = async () => {
  const martinsClient = await newClient()
  await dbPurge(martinsClient)
  console.log("🛠 Initializing db...")

  const jsonPromiseFlightData: Promise<IRawRoute[]> = fetcheroo('data')
  const jsonPromiseUserData: Promise<IUser[]> = fetcheroo('users')
  const promiseCollection: Promise<void>[] = [];

  await martinsClient.query(sqlCreateTables)
    .then(() => console.log("... ✔ All tables created"))
    .catch(err => console.log({status: "... ❌ All tables NOT created", error: err.message}));

  (await jsonPromiseFlightData).forEach(async(route) => {
    promiseCollection.push(
      martinsClient.query(sqlInsertIntoRoutes, [ route.route_id, route.departureDestination, route.arrivalDestination ])
        .then(() => {
          route.itineraries.forEach(async(itinerary) => {
            martinsClient.query(sqlInsertIntoItineraries, [
              itinerary.flight_id,
              itinerary.departureAt,
              itinerary.arrivalAt,
              itinerary.availableSeats,
              route.route_id
            ])

            martinsClient.query(sqlInsertIntoPrices, [
              itinerary.flight_id,
              itinerary.prices.currency,
              itinerary.prices.adult,
              itinerary.prices.child
            ])
          })
        })
    )
  });

  Promise.all([jsonPromiseUserData, ...promiseCollection])
    .then((res) => {
      promiseCollection.length = 0

      res[0].forEach(async(user) => {
        promiseCollection.push(
          martinsClient.query(sqlInsertIntoUsers, [
            user.user_id,
            user.first_name,
            user.last_name,
            user.email,
            md5(user.hashed_pwd)
          ])
          .then(() => {
            user.bookings.forEach(async(booking) => {
              martinsClient.query(sqlInsertIntoBookings, [
                user.user_id,
                booking.flight_id,
                booking.adult_tickets,
                booking.child_tickets
              ])
            })
          })
        )
      })

      Promise.all(promiseCollection)
        .then(() => console.log("... ✔ All data inserted"))
        .catch(err => console.log({status: "... ❌ All data NOT inserted", error: err.message}))
        .finally(() => console.log("db init done, innit'?\n"))
    })
    .catch(err => console.log({status: "... ❌ All data NOT inserted", error: err.message}))
}
