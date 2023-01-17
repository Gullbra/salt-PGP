import React from "react";
import '../styles/styling-Layout.css'

const Layout = (
  {children}: {children: React.ReactNode}
) => {
  return (
    <>
      <header className="site__header">
        <h1>This is a Header</h1>
      </header>

      <flex-wrapper class="site__wrapper">
        <aside className="site__sidebar">
          <nav>this is a nav bar</nav>
        </aside>
        <main className="site__main">
          {children}
        </main>
      </flex-wrapper>
    </>
  )
}

export default Layout