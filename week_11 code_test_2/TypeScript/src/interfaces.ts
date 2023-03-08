export interface IItinerary {
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

export interface IRoute {
  route_id: string,
  departureDestination: string,
  arrivalDestination: string,
  itineraries: IItinerary[]
}

export interface IUser {
  user_id: string,
  first_name: string,
  last_name: string,
  email: string,
  hashed_pwd: string,
  bookings: {
    route_id: string,
    flight_id: string
  } []
}
