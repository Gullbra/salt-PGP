import { Routes, Route } from 'react-router-dom';

import ProductList from './components/ProductList'
import ProductView from './components/ProductView'
import { IPagination, IResponseData } from './interfaces/interfaces';

interface IRoutingProps {
  productState: IResponseData
  pageState: IPagination
  setPageState: React.Dispatch<React.SetStateAction<IPagination>>
  setLoadingProducts: React.Dispatch<React.SetStateAction<boolean>>
}

const Routing = ({productState, pageState, setPageState, setLoadingProducts}:IRoutingProps) => {
  console.log("🖌 routing rendered")
  const routingArray: {path: string, element: React.ReactNode}[] = [
    {
      path: "*",
      element: <p>404: Nothing here</p>
    },
    {
      path: "/",
      element: <ProductList 
        productState={productState} 
        pageState={pageState} setPageState={setPageState} 
        setLoadingProducts={setLoadingProducts}/>
    },
    ...productState.results.map(product => ({
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