import React from "react";
import '../styles/styling-Layout.css'
import { HashLink } from 'react-router-hash-link';
import { capitalize } from "../util/capitalize";

const Layout = (
  {children, setOfTags}: {children: React.ReactNode, setOfTags: Set<string>}
) => {
  return (
    <>
      <header className="site__header">
        <h1>This is a Header</h1>
      </header>

      <flex-wrapper class="site__wrapper">
        <aside className="site__sidebar">
          <nav>this is a nav bar</nav>
          {setOfTags && Array.from(setOfTags).sort().map((tag, index) => (
            <HashLink
              smooth
              className="sidebar__nav-item"
              //smooth 
              to={`/#${tag}Section`} 
              key={index}
            >{capitalize(tag)}
            </HashLink>
          ))}
        </aside>
        <main className="site__main">
          {children}
        </main>
      </flex-wrapper>
    </>
  )
}

export default Layout