import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/base.css';
import './styles/loadingSpinner.css'
import Layout from './AppLayout';
import Routing from './AppRouting';
import { IMilk, IPagination } from './interfaces/interfaces';
import { getParamFromUrl } from './util/getParamFromUrl';
import fetching from './util/fetching';


function App() {
  const navigate = useNavigate()
  const urlSearchQuery = useLocation().search

  const [ pagination, setPagination ] = useState<IPagination>({ page: 1, limit: 6, maxPages: undefined })
  const [ products, setProducts ] = useState<IMilk[] | null>(null)
  //const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  useEffect (() => {
    if (!pagination.maxPages) {
      fetching(pagination.page, pagination.limit)
        .then(response => {
          if (!response) return
          
          const newPageState = {} as IPagination

          const urlLimit = getParamFromUrl(urlSearchQuery, "limit")
          if (urlLimit) {
            newPageState.limit = urlLimit
          }

          newPageState.maxPages = Math.ceil(response.data.count / (urlLimit || pagination.limit))

          const urlPage = getParamFromUrl(urlSearchQuery, "page")
          if (urlPage && urlPage <= newPageState.maxPages && urlPage > 0) {
            newPageState.page = urlPage
          }

          setPagination((prev) => {return {...prev, ...newPageState}})
        })
    }
  }, [])

  useEffect(() => {
    navigate(`/?page=${pagination.page}&limit=${pagination.limit}`)
    fetching(pagination.page, pagination.limit)
      .then(response => {
        if (!response) return
        setProducts(response.data.results)
      })
  }, [pagination])

  return (
    <Layout>
      {products 
        ? <Routing products={products} pagination={pagination} setPagination={setPagination}/>
        : <flex-wrapper class="--flex-center-spinner"><loading-spinner class="lds-hourglass"></loading-spinner></flex-wrapper>
      }
    </Layout>
  );
}

export default App;
