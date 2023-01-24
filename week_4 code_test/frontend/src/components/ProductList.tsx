import React from "react"

import { IMilk } from "../interfaces/mock.db"

const ProductList = ({products}:{products: IMilk[]}) => {
  console.log("render", products)

  return (
    <>
     {products.map((product, index) => (
      <div key={index}>
        <p>{product.name}</p>
        <p>{product.type}</p>
        <p>{product.storage}</p>
        <p>{product.id}</p>
      </div>
     ))}
    </>
  )
}

export default ProductList