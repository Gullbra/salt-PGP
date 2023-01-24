import React from "react"
import { Link } from "react-router-dom"

import { IMilk } from "../interfaces/mock.db"

const ProductList = ({products}:{products: IMilk[]}) => {
  console.log("render", products)

  return (
    <>
      {products.map((product, index) => (
        <Link key={index} to={`/${product.id}`}>
          <p>{product.name}</p>
          <p>{product.type}</p>
          <p>{product.storage}</p>
          <p>{product.id}</p>
        </Link>
      ))}
    </>
  )
}

export default ProductList