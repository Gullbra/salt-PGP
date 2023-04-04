import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css";
import SelectSearch from 'react-select-search'; 
import 'react-select-search/style.css';

import './styles/base.css';
import { IRoute, IItinerary, IRoutesState, IItineraryState, IQueryParams, ISortingState } from './util/interfaces';
import { myFetcheroo } from './util/myFetcheroo';

let firstRender = true

function App() {
  const [ routesState, setRoutesState ] = useState<IRoutesState>({} as IRoutesState)
  const [ flightsToShow, setflightsToShow ] = useState<IItineraryState[]>([])
  const [ queryParamsState, setQueryParamsState ] = useState<IQueryParams>({
    lowLimit: Date.now(),
    highLimit: Date.now() + 1000*3600*24*7
  } as IQueryParams)
  const [ sortingState, setSortingState ] = useState<ISortingState>({
    value: "departureAt",
    direction: "ascending"
  })

  useEffect(() => {
    if (firstRender) {
      firstRender = false

      myFetcheroo('routes')
        .then((response: { data: IRoute[] }) => {
          setRoutesState({
            ...(() => {
              const departureSet = new Set<string>()
              const arrivalSet = new Set<string>()
  
              response.data.forEach(route => {
                departureSet.add(route.departure_destination)
                arrivalSet.add(route.arrival_destination)
              })
  
              return { 
                availableDeparturesDest: Array.from(departureSet), 
                availableArrivalsDest: Array.from(arrivalSet) 
              }
            }) (),
            routes: response.data.map(route => {
              return {
                routeId: route.route_id,
                departureDestination: route.departure_destination,
                arrivalDestination: route.arrival_destination
              }
            })
          })
        })
        .catch(err => console.log(err.message))
        .finally(() => console.log("📮 Axios called"))
    }
  })
    
  const formHandleroo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mockObj  = {
      lowLimit: "2023-03-28T11:00:00.000Z",
      highLimit: "2023-04-03T13:00:00.000Z",
      queryType: "timeDeparture"
    }

    const inputDepartureDest = queryParamsState?.departureDestination
    const inputArrivalDest = queryParamsState?.arrivalDestination

    const { inputLowLimit, inputHighLimit } = (() => {
      if (["timeDeparture", "timeArrival"].includes(mockObj.queryType)) {
        return {
          inputLowLimit: new Date(queryParamsState.lowLimit).toLocaleString(),
          inputHighLimit: new Date(queryParamsState.highLimit).toLocaleString()
        }
      }
      return {inputLowLimit: "", inputHighLimit: ""}
    }) ()

    if (!inputDepartureDest || !inputArrivalDest)
      {console.log("Error: Input destinations error!"); return setflightsToShow([])}

    const desiredRoute = routesState.routes.find(route => { return (
      route.arrivalDestination === inputArrivalDest &&
      route.departureDestination === inputDepartureDest
    )})

    if (!desiredRoute)
      {console.log("Error: No route found!"); return setflightsToShow([])}

    const endpoint = `routes/${desiredRoute.routeId}/itineraries`

    const queryParams = {
      lowLimit: inputLowLimit,
      highLimit: inputHighLimit,
      queryType: mockObj.queryType
    }

    /** 
     * @param lowLimit
     * @param highLimit
     * @param queryType (priceAdult, priceChild, timeDeparture, timeArrival)
    */
    myFetcheroo(endpoint, { params: queryParams })
      .then((response: IItinerary[]) => setflightsToShow(
        response.map(itinerary => {
          return {
            flightId: itinerary.flight_id,
            departureAt: itinerary.departure_at,
            arrivalAt: itinerary.arrival_at,
            availableSeats: itinerary.available_seats,
            route: { ...desiredRoute },
            ...(() => {
              if (itinerary.prices)
                return { prices: {...itinerary.prices} }
              return {}
            }) ()
          }
        })
      ))
      .catch(err => console.log(err.message))
      .finally(() => console.log("📮 Axios called"))
  }

  const sortFunction = (a: IItineraryState, b: IItineraryState) => {
    if(sortingState.value === "departureAt") {
      if (sortingState.direction === "ascending") 
        return new Date(a.arrivalAt).getTime() - new Date(b.departureAt).getTime()

      if (sortingState.direction === "descending") 
        return new Date(b.departureAt).getTime() - new Date(a.arrivalAt).getTime()
    }

    if(sortingState.value === "priceAdult") {
      if  (!a.prices?.adult || !b.prices?.adult)
        return 0

      if (sortingState.direction === "ascending") 
        return a.prices?.adult - b.prices?.adult

      if (sortingState.direction === "descending") 
      return  b.prices?.adult - a.prices?.adult
    }

    if(sortingState.value === "priceChild") {
      if  (!a.prices?.child || !b.prices?.child)
        return 0

      if (sortingState.direction === "ascending") 
        return a.prices?.child - b.prices?.child

      if (sortingState.direction === "descending") 
      return  b.prices?.child - a.prices?.child
    }

    return 0
  }

  return (
    <>
      <header className='site__site-header'>
        <flex-wrapper class='site-header__header-wrapper'>
          <flex-wrapper class='header-wrapper__title-wrapper'>
            <h1 className='header-wrapper__main-title'><i>Icarus Travels</i></h1>
            <p className='header-wrapper__sub-title'>We'll get you to the sun, or die trying</p>
          </flex-wrapper>

          <flex-wrapper class='header-wrapper__menu-wrapper'>
            ☰
          </flex-wrapper>
        </flex-wrapper>
      </header>

      <section className='site__site-selection'>
        <flex-wrapper class='site-selection__selection-wrapper'>
          <h2 className='selection-wrapper__title'>Find your flight!</h2>
          <p className='selection-wrapper__desc'>{"One-way or return? Expensive or cheap? We've got just the right flight for you!*"}</p>
          <p className='selection-wrapper__asterisk'>{"*as long as you're going to Oslo, Sthlm or Amsterdam."}</p>

          {routesState?.availableDeparturesDest && routesState?.availableArrivalsDest && (
            <form className='selection-wrapper__selection-form' onSubmit={formHandleroo}>
              <SelectSearch
                options={routesState.availableDeparturesDest.map(item => {return {name: item, value: item}}).filter(item => item.name !== queryParamsState.arrivalDestination)} 
                search
                value={queryParamsState.departureDestination}
                onChange={(value) => setQueryParamsState((prev) => {return {...prev, departureDestination: String(value)}})}
                placeholder='...choose departure destination'
              />
              <SelectSearch
                options={routesState.availableArrivalsDest.map(item => {return {name: item, value: item}}).filter(item => item.name !== queryParamsState.departureDestination)} 
                search
                value={queryParamsState.arrivalDestination}
                onChange={(value) => setQueryParamsState((prev) => {return {...prev, arrivalDestination: String(value)}})}
                placeholder='...choose arrival destination'
              />

              <ReactDatePicker
                showTimeSelect
                selected={new Date(queryParamsState.lowLimit)}
                onChange={(value) => setQueryParamsState((prev) => { return value ? {...prev, lowLimit: value.getTime()} : prev })}
                startDate={new Date(queryParamsState.lowLimit)}
                endDate={new Date(queryParamsState.highLimit)}
                maxDate={new Date(queryParamsState.highLimit)}
              />
              <ReactDatePicker
                showTimeSelect
                selected={new Date(queryParamsState.highLimit)}
                onChange={(value) => setQueryParamsState((prev) => { return value ? {...prev, highLimit: value.getTime()} : prev })}
                startDate={new Date(queryParamsState.lowLimit)}
                endDate={new Date(queryParamsState.highLimit)}
                minDate={new Date(queryParamsState.lowLimit)}
              /> 

              <button type="submit">Find Flights</button>               
            </form>
          )}
        </flex-wrapper>
      </section>

      {flightsToShow.length > 0 && (
        <section className='site__flights-display'>

          <flex-wrapper class='flights-display__display-wrapper'>

            <div className='flights-display__sorting-options'>
              <select className='sorting-options__attribute-select' 
                value={sortingState.value}
                onChange={event => setSortingState({...sortingState, value: event.target.value})}
              >
                <option value="departureAt">Departure Time</option>
                <option value="priceAdult">Price - Adult</option>
                <option value="priceChild">Price - Child</option>
              </select>

              <select className='sorting-options__direction-select' 
                value={sortingState.direction}
                onChange={event => setSortingState({...sortingState, direction: event.target.value})}
              >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>

            {flightsToShow.sort(sortFunction).map(flight => (
              <article key={flight.flightId} className='display-wrapper__route-display'>
                <div className='route-display__time-display'>
                  <div className='time-display__departure-box'>
                    <p>{new Date(flight.departureAt).toLocaleDateString().split(' ')[0]}</p>
                    <p>{new Date(flight.departureAt).toLocaleTimeString().split(' ')[0]}</p>
                    <h3>{flight.route?.departureDestination}</h3>
                  </div>

                  <div className='time-display__duration-box'>
                    <p>{`- ${
                      (() => {
                        const timeDiffInMin = Math.round((new Date(flight.arrivalAt).getTime() - new Date(flight.departureAt).getTime())/(1000 * 60))
                        return `${Math.floor(timeDiffInMin/60)} h ${timeDiffInMin % 60} min`
                      }) ()
                    } -`}</p>
                  </div>

                  <div className='time-display__arrival-box'>
                    <p>{new Date(flight.arrivalAt).toLocaleDateString().split(' ')[0]}</p>
                    <p>{new Date(flight.arrivalAt).toLocaleTimeString().split(' ')[0]}</p>
                    <h3>{flight.route?.arrivalDestination}</h3>
                  </div>

                </div>
                
                <div>
                  <h4>Prices:</h4>
                  <p>{`Per Adult: ${flight.prices?.adult} ${flight.prices?.currency}`}</p>
                  <p>{`Per Child: ${flight.prices?.child} ${flight.prices?.currency}`}</p>
                </div>
              </article>
            ))}
          </flex-wrapper>
        </section>
      )}
    </>
  );
}

export default App;
