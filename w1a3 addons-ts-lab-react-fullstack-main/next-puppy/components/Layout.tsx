// import React from "react"
import styles from "../styles/Layout.module.css"

const Layout = (
  {children} : {children:React.ReactNode}
) => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.banner}>hey</div>
        <nav className={styles.nav_bar}>you</nav>
      </header>
      {children}
    </>
  )
}

export default Layout