import { fetcheroo } from '../dataFetcher'
import { martinsClient } from './database'
import { IRoute } from '../interfaces'

const sqlDropTables = `
  DROP TABLE prices_table; 
  DROP TABLE itineraries_table; 
  DROP TABLE routes_table;
`
const sqlCreateTables = `
  CREATE TABLE IF NOT EXISTS routes_table (
    route_id CHAR(8) PRIMARY KEY,
    departureDestination VARCHAR(40),
    arrivalDestination VARCHAR(40)
  );

  CREATE TABLE IF NOT EXISTS itineraries_table (
    flight_id CHAR(8) PRIMARY KEY,
    departureAt VARCHAR(30),
    arrivalAt VARCHAR(30),
    availableSeats SMALLINT
      CONSTRAINT no_overcrowding CHECK (availableSeats >= 0),
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
`
const sqlInsertIntoRoutes = `
  INSERT INTO routes_table(
    route_id, 
    departureDestination, 
    arrivalDestination
  )
  VALUES( $1, $2, $3 );
`
const sqlInsertIntoItineraries = `
  INSERT INTO itineraries_table(
    flight_id,
    departureAt,
    arrivalAt,
    availableSeats,
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

export const purgedb = () => {
  console.log("Purging db...")

  martinsClient.query(sqlDropTables)
    .then(() => console.log("... ✔ All tables dropped"))
    .catch(err => console.log({status: "... ❌ All tables NOT dropped", error: err.message}))
    .finally(() => console.log("db leaves purgatory"))
}

export const initdb = async () => {
  console.log("Initializing db...")

  const jsonPromiseFlightData: Promise<IRoute[]> = fetcheroo('data')
  const jsonPromiseUserData: Promise<IRoute[]> = fetcheroo('data')
  const dbPromises: Promise<void>[] = [];
  
  await martinsClient.connect()

  await martinsClient.query(sqlCreateTables)
    .then(() => console.log("... ✔ tables created"))
    .catch(err => console.log({status: "... ❌ Tables not created", error: err.message}));

  (await jsonPromiseFlightData).forEach(async(route) => {
    dbPromises.push(
      martinsClient.query(sqlInsertIntoRoutes, [ route.route_id, route.departureDestination, route.arrivalDestination ])
        .then(() => {
          route.itineraries.forEach( async (itinerary) => {
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
  })

  Promise.all(dbPromises)
    .then(() => console.log("... ✔ data inserted"))
    .catch(err => console.log({status: "... ❌ Data not inserted", error: err.message}))
    .finally(() => console.log("db init done, innit'?"))
}
