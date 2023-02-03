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
        if (node.classList.contains("--menu-item-selected")) {
          newFilters.push(`${encodeURIComponent(node.getAttribute('value') || "")}`)
        }
      });
      console.log(newFilters)
      pageStateHandler({filters: pageState.filters?.concat(newFilters) || newFilters})  
    }
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
      <flex-wrapper class="filter-and-search-section__selection-wrapper">
        <div className="box --search__container">
          <input className="--search__input" type="text" ref={searchInput} placeholder=" Search"/>
          <button className="--search__btn" type="button" onClick={handleSearch}>search</button>
        </div>

        <div className="box --filter section-search-filter__filter-dropdown dropdown-container">
          <label className="filter-dropdown__dropdown-label">
            <p className="label__text">Select Filters</p>
          </label>

          <menu className="dropdown-menu">
            {pageState.filters.length !== productState.types?.length && 
              <button className="filter-btn" onClick={handleFilterChange}>Apply new filters</button>}

            <ul ref={filterSelect}>
              {productState.types
                ?.filter(type => !pageState.filters?.includes(encodeURIComponent(type)))
                .map(filter => { return (
                    <li
                      key={filter} 
                      className="dropdown-menu__menu-item"
                      value={filter}
                      onClick={event => event.currentTarget.classList.contains("--menu-item-selected") 
                        ? event.currentTarget.classList.remove("--menu-item-selected")
                        : event.currentTarget.classList.add("--menu-item-selected")
                        // TODO: add debounce to this onclick
                      }
                    >{`${filter}`}</li>
                )})
              }
            </ul>
          </menu>
        </div> 
      </flex-wrapper>

      <flex-wrapper class="filter-and-search-section__cards-wrapper">
        {/* //TODO: map filter cards here*/}
        {pageState.search !== null 
          ? <span onClick={() => {
              console.log("testing remove search")
              pageStateHandler({search: null})
            }} className="active-filters-card">
              <span>{"search: " + decodeURIComponent(pageState.search)+ " x "}</span>
            </span> 
          : ""
        }
        {pageState.filters?.map((filter, index) => (
          <span 
            onClick={() => pageStateHandler({filters: pageState.filters.filter(item => item !==filter)})} 
            key={index} className="active-filters-card">
            <span>{"filter: " + decodeURIComponent(filter) + " x "}</span>
          </span>
        ))}
      </flex-wrapper>

      <div className="box --prod-count"
        // TODO: set pagelimit
        // className="box dropdown-container"
      >
        <p>{`Showing ${productState.results.length} of ${productState.count} products`}</p>
        {/* <menu className="dropdown-menu">
          <div>
            <label htmlFor="setPageLimit">set pagelimit: </label>
            <input type="number" id="setPageLimit" min={1} max={productState.count} defaultValue={pageState.limit}/>
          </div>
        </menu> */}
      </div>

    </>
  )




}

export default FilterAndSearch