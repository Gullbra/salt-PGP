import React from "react";

import '../styles/styling.components.FilterDropdown.css'
import { IPagination, IResponseData } from "../interfaces/interfaces";

const FilterDropdown = (
  {productState, pageState}:{productState: IResponseData, pageState:IPagination}
) => {
  return (
    <div className="dropdown">
      <button className="filter-btn" 
        //onClick={}
      >Apply filter</button>
      <ul className="checkbox-dropdown-list">
        {productState.types?.map((filter, index) => {
          console.log(filter, pageState.filters, pageState.filters?.includes(filter))
          return(
            <li key={index} className="filter-option">
              <label className="filter-label">
                {pageState.filters?.includes(encodeURIComponent(filter))
                  ? <><input defaultChecked type="checkbox" value={filter} name="filter" className="filter-input"/><span>{` ${filter}`}</span></>
                  : <><input type="checkbox" value={filter} name="filter" className="filter-input"/><span>{` ${filter}`}</span></>
                }
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FilterDropdown