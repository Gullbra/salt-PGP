import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './styles/base.css';

function App() {
  return (
    <>
      <Layout>
        <Routing/>
      </Layout>
    </>
  );
}

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

const Routing = () => {
  const routingArray = [
    {
      path: "*",
      element: <p>404: Nothing here</p>
    }
  ]

  return (
    <Routes>
      {routingArray.map((route, index) => {
        return <Route 
          key={index}
          path={route.path} 
          element={route.element} 
        />
      })}
    </Routes>
  )
}

export default App;
