// import React from "react"
import styles from "../styles/Layout.module.css"

import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })

const Layout = (
  {children} : {children:React.ReactNode}
) => {
  return (
    <font-wrapper className={inter.className}>
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
      <main className='main'>
        {children}
      </main>
    </font-wrapper>
  )
}

export default Layout