import React from "react"
import { Link } from "react-router-dom"

import { IMilk, IResponseData } from "../interfaces/interfaces"
import '../styles/styling.ProductList.css'
import { IPagination } from "../interfaces/interfaces"

interface IListProps {
  productState: IResponseData
  pageState: IPagination
  setPageState: React.Dispatch<React.SetStateAction<IPagination>>
  setLoadingProducts: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductList = ({productState, pageState, setPageState, setLoadingProducts}:IListProps) => {
  
  const pageStateHandler = (page:number) => {
    setPageState ((prev) => {return {...prev, page: page}})
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

      {pageState.maxPages && (
        <section className="main__pageState-section">
          <div>
            {pageState.page > 1 && <button onClick={() => pageStateHandler(pageState.page-1)} type="button" className="pageState-btn">{"< prev"}</button>}
          </div>

          <div>
            {pageState.page > 3 && <button onClick={() => pageStateHandler(1)} type="button" className="pageState-btn">{"1"}</button>}
            {pageState.page > 4 && <button className="pageState-btn">...</button>}
            {pageState.page > 2 && <button onClick={() => pageStateHandler(pageState.page-2)} type="button" className="pageState-btn">{`${pageState.page-2}`}</button>}
            {pageState.page > 1 && <button onClick={() => pageStateHandler(pageState.page-1)} type="button" className="pageState-btn">{`${pageState.page-1}`}</button>}
            <button type="button" className="pageState-btn current-page">{pageState.page}</button>
            {pageState.maxPages - pageState.page >= 1 && <button onClick={() => pageStateHandler(pageState.page+1)} type="button" className="pageState-btn">{`${pageState.page+1}`}</button>}
            {pageState.maxPages - pageState.page >= 2 && <button onClick={() => pageStateHandler(pageState.page+2)} type="button" className="pageState-btn">{`${pageState.page+2}`}</button>}
            {pageState.maxPages - pageState.page >= 4 && <button className="pageState-btn">...</button>}
            {pageState.maxPages - pageState.page >= 3 && <button onClick={() => pageStateHandler(pageState.maxPages || 1)} type="button" className="pageState-btn">{`${pageState.maxPages || 1}`}</button>}
          </div>

          <div>
            {pageState.page < pageState.maxPages && <button onClick={() => pageStateHandler(pageState.page+1)} type="button" className="pageState-btn">{"next >"}</button>}
          </div>
        </section>
      )}
      
    </flex-wrapper> 
  )
}

export default ProductList