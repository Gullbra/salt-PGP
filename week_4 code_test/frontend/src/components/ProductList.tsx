import React from "react"
import { Link } from "react-router-dom"

import { IMilk } from "../interfaces/mock.db"
import '../styles/styling.ProductList.css'

const ProductList = ({products}:{products: IMilk[]}) => {
  console.log("render", products)

  return (
    <>
      {products.map((product, index) => (
        <Link key={index} to={`/${product.id}`}
          className="main__product-card"
        >
          <grid-row class="product-card__image-wrapper">
            <img src="milk.png" alt="product picture" className="product-card__product-image"/>
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
    </>
  )
}

export default ProductList