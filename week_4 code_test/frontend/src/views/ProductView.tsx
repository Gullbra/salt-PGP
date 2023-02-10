import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { IMilk, IPagination, ICartItem } from "../interfaces/interfaces";
import '../styles/styling.view.ProductView.css'
import { createUrlFromParams } from "../util/urlManipulation";

const ProductView = ({product, pageState, setCartState}: {
  product: IMilk, 
  pageState: IPagination,
  setCartState: React.Dispatch<React.SetStateAction<ICartItem[]>>
}) => {
  const navigate = useNavigate()

  const volLabel = useRef<HTMLLabelElement>(null)
  const volInput = useRef<HTMLInputElement>(null)

  const orderHandler = () => {
    if (!volInput?.current?.value) return

    const orderObj: ICartItem & { storage?: number } = {
      ...product, 
      count: Number(volInput.current.value)
    }
    delete orderObj.storage

    setCartState(prev => {return [...prev, orderObj]})
    // window.alert("Not implemented yet")
    // console.log("orderObj:", orderObj)
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
            <input type="range" id="vol" ref={volInput}
              defaultValue={1} name="vol" min="1" max={product.storage}
              onChange={event => {
                event.preventDefault()
                
                if(volLabel?.current?.textContent)
                  volLabel.current.textContent = `${event.currentTarget.value} ${event.currentTarget.value === "1" ? "litre" : "litres"}`
              }}
            />

            <br />
            <label htmlFor="order-btn" ref={volLabel}>1 litre</label>
            <br />
            <button type="button" id="order-btn" onClick={() => orderHandler()}>Add to cart</button>
          </grid-column>

        </article>
      </flex-wrapper>
    </>
  )
}

export default ProductView