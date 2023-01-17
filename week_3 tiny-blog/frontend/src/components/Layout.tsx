import React, {useState} from "react";
import '../styles/styling-Layout.css'
import { HashLink } from 'react-router-hash-link';
import { capitalize } from "../util/capitalize";

const Layout = (
  {children, setOfTags}: {children: React.ReactNode, setOfTags: Set<string>}
) => {

  const [ showSidebar, setShowSidebar ] = useState<boolean>(true)

  console.log(showSidebar)
  return (
    <>
      <header className="site__header">
        {!showSidebar && (
          <p onClick={() => setShowSidebar(true)}>☰</p>
        )}
        <h1>This is a Header</h1>
      </header>

      <flex-wrapper class="site__wrapper">
        
          <aside className={showSidebar ? 'site__sidebar --open' : "site__sidebar"}>
            <nav onClick={() => setShowSidebar(false)}>this is a nav bar</nav>
            {setOfTags && Array.from(setOfTags).sort().map((tag, index) => (
              <HashLink
                smooth
                className="sidebar__nav-item"
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