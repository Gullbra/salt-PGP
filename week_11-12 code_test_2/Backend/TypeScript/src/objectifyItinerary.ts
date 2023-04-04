import { IItinerary, IPrices } from "./interfaces"

export const objectifyItinerary = ((itinerary:IItinerary & IPrices) => {
  return {
    flight_id: itinerary.flight_id,
    departure_at: itinerary.departure_at,
    arrival_at: itinerary.arrival_at,
    available_seats: itinerary.available_seats,
    prices: {
      currency: itinerary.currency,
      adult: itinerary.adult,
      child: itinerary.child
    }
  }
})