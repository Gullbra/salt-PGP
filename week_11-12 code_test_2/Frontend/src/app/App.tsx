import React, { useState, useRef, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import SelectSearch from 'react-select-search'
import 'react-select-search/style.css'

import './styles/base.css';
import "react-datepicker/dist/react-datepicker.css";
import { IRoute, IItinerary } from './util/interfaces';
import { myFetcheroo } from './util/myFetcheroo';

let firstRender = true

interface IRoutesState {
  availableArrivalsDest: string[]
  availableDeparturesDest: string[]
  routes: {
    routeId: string,
    departureDestination: string,
    arrivalDestination: string,
  } []
}

interface IItineraryState {
  flightId: string,
  departureAt: string,
  arrivalAt: string,
  availableSeats: number,
  route?: {
    routeId: string,
    departureDestination: string,
    arrivalDestination: string,
  },
  prices?: {
    currency: string,
    adult: number,
    child: number
  }
}

function App() {
  const [ routesState, setRoutesState ] = useState<IRoutesState>({} as IRoutesState)
  const [ flightsToShow, setflightsToShow ] = useState<IItineraryState[]>([])

  const refDepartureSelect = useRef<HTMLSelectElement>(null)
  const refArrivalSelect = useRef<HTMLSelectElement>(null)

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

    const inputDepartureDest = refDepartureSelect.current?.value
    const inputArrivalDest = refArrivalSelect.current?.value

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
      lowLimit: mockObj.lowLimit,
      highLimit: mockObj.highLimit,
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
          <p className='selection-wrapper__asterisk'>{"*as long as you're going to Oslo, Sthlm or Amsterdam. No baggage on flight."}</p>

          {routesState?.availableDeparturesDest && routesState?.availableArrivalsDest && (
            <form className='selection-wrapper__selection-form' onSubmit={formHandleroo}>
              {/* 
              {routesState?.availableArrivalsDest && (
                <SelectSearch
                  options={routesState.availableDeparturesDest.map(item => {return {name: item, value: item}})} 
                  search
                  placeholder='...choose departure destination'
                />
              )} 
              */}
              <select ref={refDepartureSelect} className='selection-form__departure-dest' required>
                <option value="">...Where from?</option>

                {routesState.availableDeparturesDest.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>

              <select ref={refArrivalSelect} className='selection-form__arrival-dest' required>
                <option value="">...Where to?</option>

                {routesState.availableArrivalsDest.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>

              <button type="submit">Find Flights</button> 

              {/* 
              <ReactDatePicker
                // showIcon
                selected={departureDate}
                onChange={(date: Date) => setDepartureDate(date)}
              /> 
              */}
              
            </form>
          )}
        </flex-wrapper>
      </section>

      {flightsToShow.length > 0 && (
        <section className='site__flights-display'>
          <flex-wrapper class='flights-display__display-wrapper'>
            {flightsToShow.map(flight => (
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
