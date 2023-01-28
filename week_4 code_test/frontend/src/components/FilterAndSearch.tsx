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
    search?: string | null;
  }) => void
}

const FilterAndSearch = ({ pageState, productState, pageStateHandler }: IPaginationComponent) => {
  const filterSelect = useRef<HTMLUListElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)

  const handleFilterChange = () => {
    const newFilters: string[] = []

    if(filterSelect.current?.children) {
      Array.from(filterSelect.current?.children).forEach(node => {
        const inputNode = node.children[0].children[0] as HTMLInputElement

        if (inputNode.checked) {
          newFilters.push(encodeURIComponent(inputNode.value))
        }
      });
    }

    pageStateHandler({filters: newFilters})
  }

  const handleSearch = () => {
    if (searchInput.current?.value && searchInput.current?.value.trim().length > 0) {
      console.log(
        "click",
        encodeURIComponent(searchInput.current?.value.trim())
      )
      const returnVar = encodeURIComponent(searchInput.current?.value.trim())
      pageStateHandler({search: returnVar})
    }
  }

  return (
    <>
      <div>
        <input type="text" ref={searchInput} placeholder=" Search - not yet implemented"/>
        <button type="button" onClick={handleSearch}>search</button>
        {pageState.search !== null 
          ? <span onClick={() => pageStateHandler({search: null})} className="active-filters-card">
              <span>{decodeURIComponent(pageState.search)}</span>
            </span> 
          : ""
        }
      </div>

      <div className="section-search-filter__filter-dropdown">
        <label className="filter-dropdown__dropdown-label">
          <p className="label__text">Filter</p>

          {pageState.filters?.map((filter, index) => (
            <span 
              //onClick={() => pageStateHandler({filters: pageState.filters.filter(item => item !==filter)})} 
              key={index} className="active-filters-card">
              <span>{decodeURIComponent(filter)}</span>
            </span>
          ))}
        </label>

        <menu className="checkbox-menu">
          <button className="filter-btn" onClick={handleFilterChange}>Apply filter</button>
          <ul ref={filterSelect}>
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

      <div>
        <p>{`Showing ${productState.results.length} of ${productState.count} products`}</p>
      </div>

      {/* 




      */}
    </>
  )
}

export default FilterAndSearch