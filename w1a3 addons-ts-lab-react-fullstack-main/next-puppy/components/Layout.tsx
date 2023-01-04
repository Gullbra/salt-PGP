// import React from "react"
import styles from "../styles/Layout.module.css"

const Layout = (
  {children} : {children:React.ReactNode}
) => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.banner}>
          <div className={styles.container}>
            <p>hey</p>
            <p>world</p>
          </div>
        </div>
        <nav className={styles.nav_bar}>
          <div className={styles.container}>
            <p>hey</p>
            <p>world</p>
          </div>
        </nav>
      </header>
      {children}
    </>
  )
}

export default Layout