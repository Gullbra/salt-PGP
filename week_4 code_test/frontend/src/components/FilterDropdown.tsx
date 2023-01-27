import React, { useRef } from "react";

import '../styles/styling.component.FilterDropdown.css'
import { IPagination, IResponseData } from "../interfaces/interfaces";

interface IFilterDropdown {
  productState: IResponseData
  pageState: IPagination
  pageStateHandler: (input: {page?: number; filters?: string[];}) => void
}

const FilterDropdown = ({productState, pageState, pageStateHandler}:IFilterDropdown) => {
  const filterList = useRef<HTMLUListElement>(null)

  const handleClick = () => {
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
    <div className="dropdown">
      <button className="filter-btn" onClick={handleClick}>Apply filter</button>

      <ul className="checkbox-dropdown-list" ref={filterList}>
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
    </div>
  )
}

export default FilterDropdown