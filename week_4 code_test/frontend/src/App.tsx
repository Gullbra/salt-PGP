import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './styles/base.css';
import Layout from './AppLayout';
import Routing from './AppRouting';
import { IMilk, IResponseData } from './interfaces/mock.db';

interface IPagination {
  page: number
  limit: number
  maxPages: number
}

const devENV = {
  DEV_domain: "http://localhost:3001"
}

function App() {
  const [ pagination, setPagination ] = useState<IPagination>({ page: 1, limit: 6, maxPages: 1 })
  const [ products, setProducts ] = useState<IMilk[] | null>(null)
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  useEffect (() => {
    axios.get(`${devENV.DEV_domain}/api/milk/?page=${pagination.page}&limit=${pagination.limit}`)
      .then(response => {
        setProducts(response.data.results)
        setLoadingProducts(false)
        setPagination({...pagination, maxPages: Math.ceil(response.data.count / pagination.limit)})
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
