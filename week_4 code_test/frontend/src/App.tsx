import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Layout from './AppLayout';
import Routing from './AppRouting';
import { IMilk, IResponseData } from './interfaces/mock.db';

import './styles/base.css';

interface IPagination {
  page: number
  limit: number
}

const devENV = {
  DEV_domain: "http://localhost:3001"
}



function App() {
  const [ pagination, setPagination ] = useState<IPagination>({ page: 1, limit: 6 })
  const [ products, setProducts ] = useState<IMilk[] | null>(null)
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  // const fetcheroo = async (): Promise<{data: IResponseData}> => {
  //   return axios.get(`${devENV.DEV_domain}/api/milk/?page=${pagination.page}&limit=${pagination.limit}`)
  // }

  useEffect (() => {
    // fetcheroo()
    axios.get(`${devENV.DEV_domain}/api/milk/?page=${pagination.page}&limit=${pagination.limit}`)
      .then(response => {
        setProducts(response.data.results)
        setLoadingProducts(false)
      })
      .catch(err => console.error(err))
      .finally(() => console.log("📮 axios called"))
  }, [])

  return (
    <Layout>
      {products && <Routing products={products}/>}
    </Layout>
  );
}

export default App;
