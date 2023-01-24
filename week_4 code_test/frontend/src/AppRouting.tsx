import { Routes, Route } from 'react-router-dom';

import ProductList from './components/ProductList'
import ProductView from './components/ProductView'
import { IMilk, IPagination } from './interfaces/interfaces';

const Routing = ({products, pagination}:{products: IMilk[], pagination: IPagination}) => {
  const routingArray: {path: string, element: React.ReactNode}[] = [
    {
      path: "*",
      element: <p>404: Nothing here</p>
    },
    {
      path: "/",
      element: <ProductList products={products}/>
    },
    // {
    //   path: `/?page=${pagination.page}&limit=${pagination.limit}`,
    //   element: <ProductList products={products}/>
    // },
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