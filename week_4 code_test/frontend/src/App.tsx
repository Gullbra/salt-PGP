import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/base.css';
import './styles/loadingSpinner.css'
import Layout from './AppLayout';
import Routing from './AppRouting';
import { IMilk, IPagination } from './interfaces/interfaces';
import { getPageFromUrl } from './util/getPageFromUrl';
import fetching from './util/fetching';


function App() {
  const navigate = useNavigate()
  const urlSearchParams = useLocation().search

  //const initPageState = { page: getPageFromUrl(urlSearchParams), limit: 6, maxPages: undefined }

  const [ pagination, setPagination ] = useState<IPagination>({ page: 1, limit: 6, maxPages: undefined })
  const [ products, setProducts ] = useState<IMilk[] | null>(null)
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  useEffect (() => {
    if (!pagination.maxPages) {
      fetching(pagination.page, pagination.limit)
        .then(response => {
          if (!response) return
          
          const newPageState = {} as IPagination
          newPageState.maxPages = Math.ceil(response.data.count / pagination.limit)

          const urlPage = getPageFromUrl(urlSearchParams)
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

  // useEffect (() => {
  //   fetching(pagination.page, pagination.limit)
  //     .then(response => {
  //       if (response) {
  //         setProducts(response.data.results)
  //         setLoadingProducts(false)
  //         setPagination({...pagination, maxPages: Math.ceil(response.data.count / pagination.limit)})
  //         //

  //         if (pagination.maxPages){
  //           console.log("navigate", {page: pagination.page, toBig: pagination.page <= pagination.maxPages, toSmall: pagination.page > 0})
  //           navigate(`/?page=${
  //             pagination.page <= pagination.maxPages && pagination.page > 0 
  //               ? pagination.page 
  //               : 1}&limit=${pagination.limit}`)
  //         }
  //       }
  //     })
  // }, [pagination.page, pagination.limit])

  return (
    <Layout>
      {products 
        ? <Routing products={products} pagination={pagination}/>
        : <flex-wrapper class="--flex-center-spinner"><div className="lds-hourglass"></div></flex-wrapper>
      }
    </Layout>
  );
}

export default App;
