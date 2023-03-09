export interface IItinerary {
  flight_id: string,
  departure_at: string,
  arrival_at: string,
  available_seats: number,
  prices: {
    currency: string,
    adult: number,
    child: number
  }
}

export interface IRoute {
  route_id: string,
  departure_destination: string,
  arrival_destination: string,
  itineraries: IItinerary[]
}

export interface IBooking {
  flight_id: string
  adult_tickets: number,
  child_tickets: number,
}

export interface IUser {
  user_id: string,
  first_name: string,
  last_name: string,
  email: string,
  hashed_pwd: string,
  bookings: IBooking[]
}
