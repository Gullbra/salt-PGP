namespace Week11.ClassLibrary;
//public class Routes
//{
//	public string route_id;
//	public string departure_destination;
//	public string arrival_destination;
//	public Itinerary[] itineraries; 
//}

//public class Itinerary
//{
//	public string flight_id;
//	public string departure_at;
//	public string arrival_at;
//	public int available_seats;
//	public Prices[] prices;
//}

public class Prices
{
	public string? currency;
	public double adult;
	public double child;
}

public class RawRoute
{
	public string? route_id;
	public string? departureDestination;
	public string? arrivalDestination;
	public RawItinerary[]? itineraries;
}

public class RawItinerary
{
	public string? flight_id;
	public string? departureAt;
	public string? arrivalAt;
	public int availableSeats;
	public Prices[]? prices;
}