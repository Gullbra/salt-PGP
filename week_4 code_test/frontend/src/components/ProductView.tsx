import React from "react";
import { IMilk } from "../interfaces/mock.db";

const ProductView = ({product}: {product: IMilk}) => {
  return(
    <>
      <h2>{product.name}</h2>
      <p>{product.type}</p>
      <p>{product.storage}</p>
      <p>{product.id}</p>
    </>
  )
}

export default ProductView