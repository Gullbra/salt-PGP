import React from "react";
import '../styles/styling-Layout.css'

const Layout = () => {
  return (
    <>
      <header className="site__header">
        <h1>This is a Header</h1>
      </header>
      <aside>
        <nav>this is a nav bar</nav>
      </aside>
      <main>
        <p>this is main</p>
      </main>
    </>
  )
}

export default Layout