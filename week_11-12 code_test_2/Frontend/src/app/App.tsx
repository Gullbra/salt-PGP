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

interface IItinerariesState {
  flightId: string,
  departureAt: string,
  arrivalAt: string,
  availableSeats: number,
  routeId? : string
  prices?: {
    currency: string,
    adult: number,
    child: number
  }
}

function App() {
  const [ routesState, setRoutesState ] = useState<IRoutesState>({} as IRoutesState)
  const [ itinerariesState, setItinerariesState ] = useState<IItinerariesState[]>({} as IItinerariesState[])
  // const [departureDate, setDepartureDate] = useState<Date>(new Date())
  // const [arrivalDate, setArrivalDate] = useState<Date>(new Date())
  // const [flightsState, setFlightsState] = useState<any>(null)

  const refForm = useRef<HTMLFormElement>(null)

  console.log(routesState)

  useEffect(() => {
    if (firstRender) {
      firstRender = false

      myFetcheroo('routes')
        .then((response: { data: IRoute[] }) => {
          const availableDestinations = (() => {
            const departureSet = new Set<string>()
            const arrivalSet = new Set<string>()

            response.data.forEach(route => {
              departureSet.add(route.departure_destination)
              arrivalSet.add(route.arrival_destination)
            })

            return [Array.from(departureSet), Array.from(arrivalSet)]
          })()

          setRoutesState({
            availableDeparturesDest: availableDestinations[0],
            availableArrivalsDest: availableDestinations[1],
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
    }
  })

  const formHandleroo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    window.alert("Form to send! Not Implemented")
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
            <input type="text" />
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
