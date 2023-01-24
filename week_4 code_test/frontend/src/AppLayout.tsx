import React from "react"

interface ILayoutProps {
  children: React.ReactNode
}

const Layout = ({children}:ILayoutProps) => {
  return (
    <>
      <header>THE MILK STORE</header>
      <main>{children}</main>
    </>
  )
}

export default Layout