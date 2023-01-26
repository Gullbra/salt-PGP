import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/base.css';
import './styles/loadingSpinner.css'
import Layout from './AppLayout';
import Routing from './AppRouting';
import { IMilk, IPagination, IProductState, IResponseData } from './interfaces/interfaces';
import { getParamFromUrl } from './util/getParamFromUrl';
import fetching from './util/fetching';


function App() {
  const navigate = useNavigate()
  const urlSearchQuery = useLocation().search

  const [ pagination, setPagination ] = useState<IPagination>({ page: 1, limit: 6, maxPages: undefined })
  const [ productState, setProductsState ] = useState<IResponseData | null>(null)
  //const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  useEffect (() => {
    if (!pagination.maxPages) {
      fetching(pagination.page, pagination.limit, true, getParamFromUrl(urlSearchQuery, "filter"))
        .then(response => {
          if (!response) return
          
          const newPageState = {} as IPagination

          const urlLimit = Number(getParamFromUrl(urlSearchQuery, "limit"))
          if (urlLimit) {
            newPageState.limit = urlLimit
          }

          newPageState.maxPages = Math.ceil((response.data.filteredCount || response.data.count) / (urlLimit || pagination.limit))

          const urlPage = Number(getParamFromUrl(urlSearchQuery, "page"))
          if (urlPage && urlPage <= newPageState.maxPages && urlPage > 0) {
            newPageState.page = urlPage
          }

          setPagination((prev) => {return {...prev, ...newPageState}})
        })
    }
  }, [])

  useEffect(() => {
    if (pagination.maxPages){
      const urlFilter = getParamFromUrl(urlSearchQuery, "filter")
      navigate(`/?page=${pagination.page}&limit=${pagination.limit}${urlFilter ? `&filter=${urlFilter}` :""}`)
      fetching(pagination.page, pagination.limit, productState?.types ?false :true, urlFilter ?urlFilter :null)
        .then(response => {
          if (!response) return
          console.log(response.data)
          setProductsState((prev) => {
            return {
              ...prev, 
              ...response.data
            }
          })
        })
    }
  }, [pagination])

  

  return (
    <Layout>
      {productState 
        ? <Routing productState={productState} pagination={pagination} setPagination={setPagination}/>
        : <flex-wrapper class="--flex-center-spinner"><loading-spinner class="lds-hourglass"></loading-spinner></flex-wrapper>
      }
    </Layout>
  );
}

export default App;
