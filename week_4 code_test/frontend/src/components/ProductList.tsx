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

  return (
    <flex-wrapper class="--flex-center">
      <section className="test-class">Test</section>
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
    </flex-wrapper> 
  )
}

export default ProductList