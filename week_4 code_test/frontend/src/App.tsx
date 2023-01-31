import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/base.css';
import './styles/loadingSpinner.css'

import Layout from './AppLayout';
import Routing from './AppRouting';
import { IPagination, IResponseData } from './interfaces/interfaces';
import { createUrlFromParams, getParamFromUrl } from './util/urlManipulation';
import { pageLimitFromWindowSize } from './util/pageLimitFromWindowSize';
import fetching from './util/fetching';

let initialLoad = true

function App() {
  const navigate = useNavigate()
  const urlSearchQuery = useLocation().search
  const urlPath = useLocation().pathname

  const urlVariables:IPagination = {
    page: Number(getParamFromUrl(urlSearchQuery, "page")) || 1,
    limit: Number(getParamFromUrl(urlSearchQuery, "limit")) || pageLimitFromWindowSize(),
    filters: getParamFromUrl(urlSearchQuery, "filter") as string[],
    search: getParamFromUrl(urlSearchQuery, "search") as string || null,
  }

  const [ pageState, setPageState ] = useState<IPagination>({} as IPagination)
  const [ productState, setProductState ] = useState<IResponseData>({} as IResponseData)
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  useEffect(()=>{
    if (initialLoad) {
      initialLoad = false

      fetching({...urlVariables}, true)
        .then(response => {
          setPageState({
            ...urlVariables,
            maxPages: Math.ceil(response.data.count / urlVariables.limit),
          })
          setProductState({...response.data})
          setLoadingProducts(false)
          
          if (urlPath === '/'){
            navigate(createUrlFromParams({...urlVariables}))
          }
        })
        .catch(err => console.log(err))
    }
  }, [])

  return (
    <Layout>
      {!loadingProducts && productState 
        ? <Routing 
            productState={productState} setProductState={setProductState} 
            pageState={pageState} setPageState={setPageState} 
            setLoadingProducts={setLoadingProducts}
          />
        : <flex-wrapper class="--flex-center-spinner"><loading-spinner class="lds-hourglass"></loading-spinner></flex-wrapper>
      }
    </Layout>
  );
}

export default App;
