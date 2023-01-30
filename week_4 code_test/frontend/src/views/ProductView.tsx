import React from "react";
import { useNavigate } from "react-router-dom";

import { IMilk, IPagination } from "../interfaces/interfaces";
import '../styles/styling.view.ProductView.css'
import { createUrlFromParams } from "../util/urlManipulation";

const ProductView = ({product, pageState}: {product: IMilk, pageState: IPagination}) => {
  const navigate = useNavigate()

  const orderHandler = () => {
    window.alert("Not implemented yet")
    console.log("Not implemented")
  }

  return(
    <>
      <flex-wrapper class="main__flex-wrapper">
        <button className="flex-wrapper__back-btn" 
          onClick={() => navigate(createUrlFromParams({...pageState}))}
        >{"< back"}</button>

        <article className="flex-wrapper__article">
          <grid-column class="article__image-wrapper">
            <img src="milk.png" alt={`${product.name}`} className="image-wrapper__product-image"/>
          </grid-column>
          <grid-column class = "article__info">
            <p className="info__name">{product.name}</p>
            <p className="info__type">{product.type}</p>
            <p className="info__storage">{`${product.storage} liter`}</p>
            <input type="range" id="vol" name="vol" min="1" max={product.storage}/>

            <button type="button" onClick={() => orderHandler()}>Order</button>
          </grid-column>

        </article>
      </flex-wrapper>
    </>
  )
}

export default ProductView