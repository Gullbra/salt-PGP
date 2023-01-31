import React from "react"

import './styles/layout.css'

interface ILayoutProps {
  children: React.ReactNode
}

const Layout = ({children}:ILayoutProps) => {
  // TODO: add collapsable sidebar menu for mobile view with useWindowDimensions hook + throttle
  return (
    <>
      <header className="site__header"><h1>THE MILK STORE</h1></header>
      <main className="site__main">{children}</main>
    </>
  )
}

export default Layout