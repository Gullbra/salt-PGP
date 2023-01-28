import { Routes, Route } from 'react-router-dom';

import ProductListView from './views/ProductListView'
import ProductView from './views/ProductView'
import { IPagination, IResponseData } from './interfaces/interfaces';

interface IRoutingProps {
  productState: IResponseData
  setProductState: React.Dispatch<React.SetStateAction<IResponseData>>

  pageState: IPagination
  setPageState: React.Dispatch<React.SetStateAction<IPagination>>

  setLoadingProducts: React.Dispatch<React.SetStateAction<boolean>>
}

const Routing = ({productState, setProductState, pageState, setPageState, setLoadingProducts}:IRoutingProps) => {
  const routingArray: {path: string, element: React.ReactNode}[] = [
    {
      path: "*",
      element: <p>404: Nothing here</p>
    },
    {
      path: "/",
      element: <ProductListView 
        productState={productState} setProductState={setProductState}
        pageState={pageState} setPageState={setPageState} 
        setLoadingProducts={setLoadingProducts}/>
    },
    ...productState.results.map(product => ({
      path: `/${product.id}`,
      element: <ProductView product={product} pageState={pageState}/>
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