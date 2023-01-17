import React from 'react';
import './styles/base.css'

import Layout from './components/Layout';
import PostList from './components/PostList';

function App() {
  return (
    <>
      <Layout>
        <PostList></PostList>
      </Layout>
    </>
  );
}

export default App;
