import React from "react"
import { Link } from "react-router-dom"

import { IMilk } from "../interfaces/interfaces"
import '../styles/styling.ProductList.css'
import { IPagination } from "../interfaces/interfaces"

interface IListProps {
  products: IMilk[]
  pagination: IPagination
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>
}

const ProductList = ({products, pagination, setPagination}:IListProps) => {
  
  // const paginationArr = Array.from({length: pagination.maxPages || 1}, (_, i) => i++)

  const paginationHandler = (page:number) => {
    setPagination ((prev) => {return {...prev, page: page}})
  } 

  return (
    <flex-wrapper class="--flex-center">
      <section className="test-class-1">Test</section>

      <list-wrapper class="main__list-wrapper">
        {products.map((product, index) => (
          <Link key={index} to={`/${product.id}`}
            className="main__product-card"
          >
            <grid-row class="product-card__image-wrapper">
              <img src="milk.png" alt={`Picture: ${product.name}`} className="product-card__product-image"/>
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
        <section className="test-class-1">
          {pagination.page !== 1 && <button type="button" onClick={() => paginationHandler(1)}>{"<<"}</button>}
          {/* <button type="button" onClick={() => paginationHandler(pagination.page-1)}>{"<"}</button> */}
          {pagination.page-2 > 0 && (<span>...</span>)}
          {pagination.page-1 > 0 && (<button type="button" onClick={() => paginationHandler(pagination.page-1)}>{`${pagination.page-1}`}</button>)}
          <button type="button"><b>{`${pagination.page}`}</b></button>
          {pagination.page+1 <= pagination.maxPages && (<button type="button" onClick={() => paginationHandler(pagination.page+1)}>{`${pagination.page+1}`}</button>)}
          {pagination.page+2 <= pagination.maxPages && (<span>...</span>)}
          {/* <button type="button">{">"}</button> */}
          {pagination.page !== pagination.maxPages && <button type="button" onClick={() => paginationHandler(pagination.maxPages || 1)}>{">>"}</button>}
        </section>
      )}
      
    </flex-wrapper> 
  )
}

export default ProductList