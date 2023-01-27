import React from "react";
import { useNavigate } from "react-router-dom";

import { IMilk, IPagination } from "../interfaces/interfaces";

const ProductView = ({product, pageState}: {product: IMilk, pageState: IPagination}) => {
  const navigate = useNavigate()

  return(
    <>
      <button onClick={() => {
        navigate(
          `/?page=${pageState.page || 1}&limit=${pageState.limit || 6}${
            pageState.filters 
              ? pageState.filters.map(filter => `&filter=${filter}`).join('')
              : ""
          }`
        )
      }}>back</button>
      
      <h2>{product.name}</h2>
      <p>{product.type}</p>
      <p>{product.storage}</p>
      <p>{product.id}</p>
    </>
  )
}

export default ProductView