import React from "react"
import { Link } from "react-router-dom"

import { IMilk, IResponseData } from "../interfaces/interfaces"
import '../styles/styling.ProductList.css'
import { IPagination } from "../interfaces/interfaces"

interface IListProps {
  productState: IResponseData
  pagination: IPagination
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>
  setLoadingProducts: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductList = ({productState, pagination, setPagination, setLoadingProducts}:IListProps) => {
  
  const paginationHandler = (page:number) => {
    setPagination ((prev) => {return {...prev, page: page}})
    setLoadingProducts(true)
  } 

  return (
    <flex-wrapper class="--flex-center">
      <section className="test-class-1">
        <div>
          <input type="text" placeholder=" Search"/>
          <p>{productState.filteredCount ? `Showing ${productState.filteredCount} of ${productState.count} products`: `${productState.count} products`}</p>
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

      {pagination.maxPages && (
        <section className="main__pagination-section">
          <div>
            {pagination.page > 1 && <button onClick={() => paginationHandler(pagination.page-1)} type="button" className="pagination-btn">{"< prev"}</button>}
          </div>

          <div>
            {pagination.page > 3 && <button onClick={() => paginationHandler(1)} type="button" className="pagination-btn">{"1"}</button>}
            {pagination.page > 4 && <button className="pagination-btn">...</button>}
            {pagination.page > 2 && <button onClick={() => paginationHandler(pagination.page-2)} type="button" className="pagination-btn">{`${pagination.page-2}`}</button>}
            {pagination.page > 1 && <button onClick={() => paginationHandler(pagination.page-1)} type="button" className="pagination-btn">{`${pagination.page-1}`}</button>}
            <button type="button" className="pagination-btn current-page">{pagination.page}</button>
            {pagination.maxPages - pagination.page >= 1 && <button onClick={() => paginationHandler(pagination.page+1)} type="button" className="pagination-btn">{`${pagination.page+1}`}</button>}
            {pagination.maxPages - pagination.page >= 2 && <button onClick={() => paginationHandler(pagination.page+2)} type="button" className="pagination-btn">{`${pagination.page+2}`}</button>}
            {pagination.maxPages - pagination.page >= 4 && <button className="pagination-btn">...</button>}
            {pagination.maxPages - pagination.page >= 3 && <button onClick={() => paginationHandler(pagination.maxPages || 1)} type="button" className="pagination-btn">{`${pagination.maxPages || 1}`}</button>}
          </div>

          <div>
            {pagination.page < pagination.maxPages && <button onClick={() => paginationHandler(pagination.page+1)} type="button" className="pagination-btn">{"next >"}</button>}
          </div>
        </section>
      )}
      
    </flex-wrapper> 
  )
}

export default ProductList