import React from "react"
import { Link } from "react-router-dom"
import { ICartItem } from "./interfaces/interfaces"

import './styles/layout.css'

interface ILayoutProps {
  children: React.ReactNode
  cartState: ICartItem[]
}

const Layout = ({children, cartState}:ILayoutProps) => {
  // TODO: add collapsable sidebar menu for mobile view with useWindowDimensions hook + throttle
  return (
    <>
      <header className="site__header">
        <h1>THE MILK STORE</h1>
        {cartState.length > 0 && (<Link to={'/cart'}>testCart</Link>)}
      </header>
      <main className="site__main">{children}</main>
    </>
  )
}

export default Layout