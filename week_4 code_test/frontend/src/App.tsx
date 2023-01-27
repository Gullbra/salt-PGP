import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/base.css';
import './styles/loadingSpinner.css'
import Layout from './AppLayout';
import Routing from './AppRouting';
import { IPagination, IResponseData } from './interfaces/interfaces';
import { getParamFromUrl } from './util/getParamFromUrl';
import fetching from './util/fetching';

let initialLoad = true

function App() {
  // console.log("🖌 app rendered")
  const navigate = useNavigate()
  const urlSearchQuery = useLocation().search

  const urlVariables = {
    filters: getParamFromUrl(urlSearchQuery, "filter") as string[],
    page: Number(getParamFromUrl(urlSearchQuery, "page")),
    limit: Number(getParamFromUrl(urlSearchQuery, "limit")),
  }

  const [ pageState, setPageState ] = useState<IPagination>({} as IPagination)
  const [ productState, setProductState ] = useState<IResponseData>({} as IResponseData)
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  console.log({urlVariables, pageState, productState})

  useEffect(()=>{
    if (initialLoad) {
      initialLoad = false
      fetching(
        urlVariables.page || 1, 
        urlVariables.limit || 6,
        true,
        urlVariables.filters
      ).then(response => {

        setPageState({
          page: urlVariables.page || 1, 
          limit: urlVariables.limit || 6,
          maxPages: Math.ceil(response.data.count / (urlVariables.limit || 6)),
          filters: urlVariables.filters
        })

        setProductState({...response.data})

        setLoadingProducts(false)
        
        navigate(
          `/?page=${urlVariables.page || 1}&limit=${urlVariables.limit || 6}${
            urlVariables.filters 
              ? urlVariables.filters.map(filter => `&filter=${filter}`).join('')
              : ""
          }`
        )
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
          setLoadingProducts={setLoadingProducts}/>
        : <flex-wrapper class="--flex-center-spinner"><loading-spinner class="lds-hourglass"></loading-spinner></flex-wrapper>
      }
    </Layout>
  );
}

export default App;
