import React from "react"
import { Link, useNavigate } from "react-router-dom"

import '../styles/styling.view.ProductList.css'
import { IPagination, IResponseData } from "../interfaces/interfaces"
import fetching from "../util/fetching"
import FilterAndSearch from '../components/FilterAndSearch'
import Pagination from '../components/Pagination'
import { createUrlFromParams } from "../util/urlManipulation"


interface IListProps {
  productState: IResponseData
  setProductState: React.Dispatch<React.SetStateAction<IResponseData>>

  pageState: IPagination;
  setPageState: React.Dispatch<React.SetStateAction<IPagination>>

  setLoadingProducts: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductListView = ({productState, setProductState, pageState, setPageState, setLoadingProducts}:IListProps) => {
  const navigate = useNavigate()

  const pageStateHandler = (input:{page?: number, filters?: string[], search?:(string | null)}) => {
    navigate(createUrlFromParams(
      input.page || 1,
      pageState.limit,
      input.filters || pageState.filters,
      input.search === null ? null : input.search || pageState.search
    ))
    let loadingSpinnerOnSlowConnections = setTimeout(() => setLoadingProducts(true), 200)

    fetching(
      input.page || 1,
      pageState.limit,
      false,
      input.filters || pageState.filters,
      input.search === null ? null : input.search || pageState.search
    ).then(response => {
      clearTimeout(loadingSpinnerOnSlowConnections)
      setProductState((prev) => { return {...prev, ...response.data}})
      setLoadingProducts(false)
      setPageState((prev) => { return {
        ...prev,
        page: input.page || 1, 
        filters: input.filters || pageState.filters,
        search: input.search === null ? null : input.search || pageState.search,
        maxPages: Math.ceil(response.data.count / pageState.limit),
      }})
    }).catch(err => console.log(err))
  }

  return (
    <flex-wrapper class="--flex-center">
      <section className="main__section-filter-search">
        <FilterAndSearch pageState={pageState} productState={productState} pageStateHandler={pageStateHandler}/>
      </section>

      {productState.results.length === 0
        ? <p>No products found</p>
        : <section className="main__list-section">
            {productState.results.map((product, index) => (
              <Link key={index} to={`/${product.id}`}
                className="list-section__product-card"
              >
                <grid-row class="product-card__image-wrapper">
                  <img src="milk.png" alt={`${product.name}`} className="product-card__product-image"/>
                </grid-row>
                <grid-row class="product-card__info-wrapper">
                  <p className="info__name">{product.name}</p>
                  <flex-wrapper class="info-wrapper__type-and-stock">
                    <p className="info__type">{product.type}</p>
                    <p className="info__storage">{`${product.storage} liter`}</p>
                  </flex-wrapper>
                </grid-row>
              </Link>
            ))}
          </section>
      }
      
      {productState.results.length > 0 && <Pagination pageState={pageState} pageStateHandler={pageStateHandler}/>}
    </flex-wrapper> 
  )
}

export default ProductListView