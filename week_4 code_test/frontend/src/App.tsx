import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Layout from './AppLayout';
import Routing from './AppRouting';
import { IMilk } from './interfaces/mock.db';

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
  const [ products, setProducts ] = useState<IMilk | null>(null)
  const [ loadingProducts, setLoadingProducts ] = useState<boolean>(true)

  useEffect (() => {
    axios.get(`${devENV.DEV_domain}/api/milk/?page=${pagination.page}&limit=${pagination.limit}`)
      .then(respone => console.log(respone))
      .catch(err => console.error(err))
  }, [])

  return (
    <Layout>
      <Routing/>
    </Layout>
  );
}

export default App;
