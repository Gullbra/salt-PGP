import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/base.css';
import './styles/loadingSpinner.css'
import Layout from './AppLayout';
import Routing from './AppRouting';
import { IPagination, IResponseData } from './interfaces/interfaces';
import { getParamFromUrl } from './util/getParamFromUrl';
import fetching from './util/fetching';
import { count } from 'console';

let isLoading = false

function App() {
  console.log("🖌 app rendered")
  const navigate = useNavigate()
  const urlSearchQuery = useLocation().search

  const urlVariables = {
    filters: getParamFromUrl(urlSearchQuery, "filter"),
    page: Number(getParamFromUrl(urlSearchQuery, "page")),
    limit: Number(getParamFromUrl(urlSearchQuery, "limit")),
  }

  const [ pageState, setPageState ] = useState<IPagination>({} as IPagination)
  const [ productState, setProductsState ] = useState<IResponseData>({} as IResponseData)
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  //console.log(urlVariables)
  console.log({pageState, productState})

  if (isLoading === false) {
    isLoading = true
    fetching(
      urlVariables.page || 1, 
      urlVariables.limit || 6,
      productState.types ? false : true,
      urlVariables.filters
    ).then(response => {
      setPageState({
        page: urlVariables.page || 1, 
        limit: urlVariables.limit || 6,
        maxPages: Math.ceil(response.data.count / urlVariables.limit || 6)
      })
    })
    .catch(err => console.log(err))
  }

  /*

    *OnPageLoad =>
    client = page, limit, getTypes, filter => server

    server = maxPages, types, results, count => client
  */



  /*
  if (!pageState.maxPages && !loadingProducts) {
    fetching(pageState.page, pageState.limit, true, getParamFromUrl(urlSearchQuery, "filter"))
      .then(response => {
        if (!response) return
        
        const newPageState = {} as IPagination

        const urlLimit = Number(getParamFromUrl(urlSearchQuery, "limit"))
        if (urlLimit) {
          newPageState.limit = urlLimit
        }

        newPageState.maxPages = Math.ceil((response.data.filteredCount || response.data.count) / (urlLimit || pageState.limit))

        const urlPage = Number(getParamFromUrl(urlSearchQuery, "page"))
        if (urlPage && urlPage <= newPageState.maxPages && urlPage > 0) {
          newPageState.page = urlPage
        }

        setLoadingProducts(true)
        setPageState((prev) => {return {...prev, ...newPageState}})
      })
  }

  useEffect(() => {
    if (pageState.maxPages && loadingProducts){
      const urlFilter = getParamFromUrl(urlSearchQuery, "filter")
      navigate(`/?page=${pageState.page}&limit=${pageState.limit}${
        urlFilter 
          ? Array.isArray(urlFilter) 
            ? urlFilter.map(item => `&filter=${item}`).join('')
            : `&filter=${urlFilter}`
          : ""
      }`)
      fetching(pageState.page, pageState.limit, productState?.types ? false : true, urlFilter ? urlFilter : null)
        .then(response => {
          if (!response) return
          console.log(response.data)

          setProductsState((prev) => {
            return {
              ...prev, 
              ...response.data
            }
          })
          setLoadingProducts(false)
        })
    }
  }, [pageState])
  */

  return (
    <Layout>
      {!loadingProducts && productState 
        ? <Routing productState={productState} pageState={pageState} setPageState={setPageState} setLoadingProducts={setLoadingProducts}/>
        : <flex-wrapper class="--flex-center-spinner"><loading-spinner class="lds-hourglass"></loading-spinner></flex-wrapper>
      }
    </Layout>
  );
}

export default App;
