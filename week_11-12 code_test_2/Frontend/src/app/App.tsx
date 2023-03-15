import React, { useState, useRef, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { myFetcheroo } from './util/myFetcheroo';

import './styles/base.css';
import "react-datepicker/dist/react-datepicker.css";
import { IRoute } from './util/interfaces';

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
  routeId?: string
  prices?: {
    currency: string,
    adult: number,
    child: number
  }
}



function App() {
  const [ routesState, setRoutesState ] = useState<IRoutesState>({} as IRoutesState)
  const [ flightsToShow, setflightsToShow ] = useState<IItineraryState[]>({} as IItineraryState[])

  const refForm = useRef<HTMLFormElement>(null)

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
      departureDestination: "Stockholm",
      arrivalDestination: "Oslo",

      lowLimit: "2023-03-28T11:00:00.000Z",
      highLimit: "2023-04-03T13:00:00.000Z",
      queryType: "timeDeparture"
    }

    const desiredRoute = routesState.routes.find(route => { return (
      route.arrivalDestination === mockObj.arrivalDestination &&
      route.departureDestination === mockObj.departureDestination
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
      .then(response => console.log(response))
      .catch(err => console.log(err.message))
      .finally(() => console.log("📮 Axios called"))
  }


  return (
    <>
      <header className='site__site-header'>
        <flex-wrapper class='site-header__header-wrapper'>
          <flex-wrapper class='header-wrapper__title-wrapper'>
            <h1 className='header-wrapper__main-title'>Icarius Travels</h1>
            <p className='header-wrapper__sub-title'>We aim for the f***ing sun</p>
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

          <form onSubmit={formHandleroo} ref={refForm}>
            {/* 
              <label htmlFor=""></label>
              <input type="text" />
            */}
            <input type="submit" /> 
            {/* <ReactDatePicker
              // showIcon
              selected={departureDate}
              onChange={(date: Date) => setDepartureDate(date)}
            /> */}
            
          </form>

        </flex-wrapper>
      </section>
    </>
  );
}

export default App;
