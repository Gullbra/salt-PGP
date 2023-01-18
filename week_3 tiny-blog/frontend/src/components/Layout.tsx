import React, {useState} from "react";
import '../styles/styling-Layout.css'
import { HashLink } from 'react-router-hash-link';
import { capitalize } from "../util/capitalize";

type Props = {
  children: React.ReactNode
  setOfTags: Set<string>
}



const Layout = (
  {children, setOfTags}: Props
) => {

  const [ showSidebar, setShowSidebar ] = useState<boolean>(true)

  return (
    <>
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>

      <flex-wrapper class="site__wrapper">
        <Aside showSidebar={showSidebar} setShowSidebar={setShowSidebar} setOfTags={setOfTags}/>
        <main className="site__main">
          {children}
        </main>
      </flex-wrapper>
    </>
  )
}

const Header = (
  {showSidebar, setShowSidebar}:{showSidebar:boolean, setShowSidebar:React.Dispatch<React.SetStateAction<boolean>>}
) => {
  return(
    <header className="site__header">
      <header-column class="header--flex">
        <p className={showSidebar ? "header__menu-btn --transparent" : "header__menu-btn"} onClick={() => setShowSidebar(true)}>☰</p>
      </header-column>

      <header-column class="header--flex">
        <h1>This is a Header</h1>
      </header-column>
    </header>
  )
}

const Aside = (
  {showSidebar, setShowSidebar, setOfTags}:{showSidebar:boolean, setShowSidebar:React.Dispatch<React.SetStateAction<boolean>>, setOfTags: Set<string>}
) => {
  return(
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
  )
}

export default Layout