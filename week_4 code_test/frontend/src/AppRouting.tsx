import { Routes, Route } from 'react-router-dom';

import ProductList from './components/ProductList'
import ProductView from './components/ProductView'
import { IMilk } from './interfaces/mock.db';

const Routing = ({products}:{products: IMilk[]}) => {
  const routingArray: {path: string, element: React.ReactNode}[] = [
    {
      path: "*",
      element: <p>404: Nothing here</p>
    },
    {
      path: "/",
      element: <ProductList products={products}/>
    },
    ...products.map(product => ({
      path: `/${product.id}`,
      element: <ProductView product={product}/>
    }))
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

export default Routing