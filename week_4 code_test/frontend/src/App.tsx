import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/base.css';
import './styles/loadingSpinner.css'

import Layout from './AppLayout';
import Routing from './AppRouting';
import { ICartItem, IPagination, IResponseData } from './interfaces/interfaces';
import { createUrlFromParams, getParamFromUrl } from './util/urlManipulation';
import { pageLimitFromWindowSize } from './util/pageLimitFromWindowSize';
import { validateAndExtractStorage } from './util/validateAndExtractStorage';
import fetching from './util/fetching';

let initialLoad = true

function App() {
  const navigate = useNavigate()
  const urlSearchQuery = useLocation().search
  const urlPath = useLocation().pathname
  
  const [ productState, setProductState ] = useState<IResponseData>({} as IResponseData)
  const [ pageState, setPageState ] = useState<IPagination>({} as IPagination)
  const [ cartState, setCartState ] = useState<ICartItem[]>({} as ICartItem[])
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  // console.log(
  //   localStorage.getItem("cartState"),
  //   cartState
  // )

  useEffect(() => {
    if (!initialLoad) {
      console.log("✨UseEffect: localStorage - cartState")
      localStorage.cartState = JSON.stringify(cartState)
    }
  }, [cartState])

  useEffect(()=>{
    if (initialLoad) {
      console.log("✨UseEffect: initial load")
      initialLoad = false

      const urlVariables:IPagination = {
        page: Number(getParamFromUrl(urlSearchQuery, "page")) || 1,
        limit: Number(getParamFromUrl(urlSearchQuery, "limit")) || pageLimitFromWindowSize(),
        filters: getParamFromUrl(urlSearchQuery, "filter") as string[],
        search: getParamFromUrl(urlSearchQuery, "search") as string || null,
      }

      const cartFromStorage: ICartItem[] = validateAndExtractStorage(localStorage.cartState)

      fetching({...urlVariables}, true)
        .then(response => {
          setPageState({
            ...urlVariables,
            maxPages: Math.ceil(response.data.count / urlVariables.limit),
          })
          setProductState({...response.data})
          setLoadingProducts(false)
          setCartState(cartFromStorage)
          
          if (urlPath === '/'){
            navigate(createUrlFromParams({...urlVariables}))
          }
        })
        .catch(err => console.log(err))
    }
  }, [])

  return (
    <Layout cartState={cartState}>
      {!loadingProducts && productState 
        ? <Routing 
            productState={productState} setProductState={setProductState} 
            pageState={pageState} setPageState={setPageState} 
            cartState={cartState} setCartState={setCartState}
            setLoadingProducts={setLoadingProducts}
          />
        : <flex-wrapper class="--flex-center-spinner"><loading-spinner class="lds-hourglass"></loading-spinner></flex-wrapper>
      }
    </Layout>
  );
}

export default App;
