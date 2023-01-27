import React from "react"
import { Link, useNavigate } from "react-router-dom"

import { IResponseData } from "../interfaces/interfaces"
import '../styles/styling.view.ProductList.css'
import { IPagination } from "../interfaces/interfaces"
import fetching from "../util/fetching"
import FilterDropdown from '../components/FilterDropdown'

interface IListProps {
  productState: IResponseData
  setProductState: React.Dispatch<React.SetStateAction<IResponseData>>

  pageState: IPagination
  setPageState: React.Dispatch<React.SetStateAction<IPagination>>

  setLoadingProducts: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductList = ({productState, setProductState, pageState, setPageState, setLoadingProducts}:IListProps) => {
  const navigate = useNavigate()

  const pageStateHandler = (input:{page?: number, filters?: string[]}) => {
    setPageState ((prev) => {return {...prev, page: input.page || 1, filters: input.filters || pageState.filters}})
    setLoadingProducts(true)

    navigate(
      `/?page=${input.page || 1}&limit=${pageState.limit}${
        input.filters || pageState.filters 
          ? (input.filters || pageState.filters).map(filter => `&filter=${filter}`).join('')
          : ""
      }`
    )

    fetching(
      input.page || 1,
      pageState.limit,
      false,
      input.filters || pageState.filters
    ).then(response => {
      setProductState((prev) => { return {...prev, ...response.data}})
      setLoadingProducts(false)
      setPageState((prev) => {return{...prev, maxPages: Math.ceil(response.data.count / pageState.limit)}})
    })
    .catch(err => console.log(err))
  }

  return (
    <flex-wrapper class="--flex-center">
      <section className="test-class-1">
        <div>
          <input type="text" placeholder=" Search"/>
          <p>{
            // productState.count === 99 ? "We've got 99 products, but a b**ch ain't one! (we're not traffickers)" :
            `Showing ${productState.results.length} of ${productState.count} products`}</p>

          <FilterDropdown productState={productState} pageState={pageState} pageStateHandler={pageStateHandler}/>
        </div>
        <div>
          
        </div>
      </section>

      <list-wrapper class="main__list-wrapper">
        {productState.results.map((product, index) => (
          <Link key={index} to={`/${product.id}`}
            className="main__product-card"
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
      </list-wrapper>

      {pageState.maxPages && (
        <section className="main__pageState-section">
          <div>
            {pageState.page > 1 && <button onClick={() => pageStateHandler({page: pageState.page-1})} type="button" className="pageState-btn">{"< prev"}</button>}
          </div>

          <div>
            {pageState.page > 3 && <button onClick={() => pageStateHandler({page: 1})} type="button" className="pageState-btn">{"1"}</button>}
            {pageState.page > 4 && <button className="pageState-btn">...</button>}
            {pageState.page > 2 && <button onClick={() => pageStateHandler({page: pageState.page-2})} type="button" className="pageState-btn">{`${pageState.page-2}`}</button>}
            {pageState.page > 1 && <button onClick={() => pageStateHandler({page: pageState.page-1})} type="button" className="pageState-btn">{`${pageState.page-1}`}</button>}
            <button type="button" className="pageState-btn current-page">{pageState.page}</button>
            {pageState.maxPages - pageState.page >= 1 && <button onClick={() => pageStateHandler({page: pageState.page+1})} type="button" className="pageState-btn">{`${pageState.page+1}`}</button>}
            {pageState.maxPages - pageState.page >= 2 && <button onClick={() => pageStateHandler({page: pageState.page+2})} type="button" className="pageState-btn">{`${pageState.page+2}`}</button>}
            {pageState.maxPages - pageState.page >= 4 && <button className="pageState-btn">...</button>}
            {pageState.maxPages - pageState.page >= 3 && <button onClick={() => pageStateHandler({page: pageState.maxPages || 1})} type="button" className="pageState-btn">{`${pageState.maxPages || 1}`}</button>}
          </div>

          <div>
            {pageState.page < pageState.maxPages && <button onClick={() => pageStateHandler({page: pageState.page+1})} type="button" className="pageState-btn">{"next >"}</button>}
          </div>
        </section>
      )}
      
    </flex-wrapper> 
  )
}

export default ProductList