import React, { useRef } from "react";

import '../styles/styling.component.FilterAndSearch.css'
import { IPagination, IResponseData } from "../interfaces/interfaces";
// import FilterDropdown from "./FilterDropdown";

interface IPaginationComponent{
  pageState: IPagination
  productState: IResponseData
  pageStateHandler: (input: {
    page?: number;
    filters?: string[];
  }) => void
}

const FilterAndSearch = ({ pageState, productState, pageStateHandler }: IPaginationComponent) => {
  const filterList = useRef<HTMLUListElement>(null)

  const handleFilterChange = () => {
    const newFilters: string[] = []

    if(filterList.current?.children) {
      Array.from(filterList.current?.children).forEach(node => {
        const inputNode = node.children[0].children[0] as HTMLInputElement

        if (inputNode.checked) {
          newFilters.push(encodeURIComponent(inputNode.value))
        }
      });
    }

    pageStateHandler({filters: newFilters})
  }

  return (
    <>
      <div className="section-search-filter__filter-dropdown">


        <label className="filter-dropdown__dropdown-label">
          <p className="label__text">Filter</p>

          {pageState.filters?.map((filter, index) => (
            <span key={index} className="active-filters-card"><span>{decodeURIComponent(filter)}</span></span>
          ))}
        </label>


        <menu className="checkbox-menu">
          <button className="filter-btn" onClick={handleFilterChange}>Apply filter</button>
          <hr />
          <ul ref={filterList}>
            {productState.types?.map((filter, index) => {
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
        </menu>
      </div> 

      {/* 
      <div>
        <input type="text" placeholder=" Search - not yet implemented"/>
        <button>search</button>
      </div>

      <div>
        <p>{`Showing ${productState.results.length} of ${productState.count} products`}</p>
      </div>

      */}
    </>
  )
}

export default FilterAndSearch