import React, { useState, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';

import './styles/base.css';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [departureDate, setDepartureDate] = useState<Date>(new Date())
  const [arrivalDate, setArrivalDate] = useState(new Date())
  const refForm = useRef<HTMLFormElement>(null)


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
            <ReactDatePicker
              // showIcon
              selected={departureDate}
              onChange={(date: Date) => setDepartureDate(date)}
            />
            
          </form>

        </flex-wrapper>
      </section>
    </>
  );
}

export default App;
