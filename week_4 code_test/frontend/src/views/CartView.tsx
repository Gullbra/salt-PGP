import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ICartItem, IPagination } from '../interfaces/interfaces'
import { createUrlFromParams } from '../util/urlManipulation'

interface ICartViewProps {
  pageState: IPagination

  cartState: ICartItem[]
  setCartState: React.Dispatch<React.SetStateAction<ICartItem[]>>
}

const CartView = ({pageState, cartState, setCartState}:ICartViewProps) => {
  const navigate = useNavigate()

  return (
    <>
      <button className="flex-wrapper__back-btn" 
        onClick={() => navigate(createUrlFromParams({...pageState}))}
      >{"< back"}</button>

      {cartState.map(product => (
        <article key={product.id}>
          <p>{product.name}</p>
          <p>{product.type}</p>
          <p>{product.id}</p>
          <p>{product.count}</p>
        </article>
      ))}
    </>
  )
}

export default CartView

