import React, {useEffect, useState} from 'react';
import { Routes, Route } from 'react-router-dom'

import './styles/base.css'
import Layout from './components/Layout';
import PostList from './components/PostList';
import PostView from './components/PostView';
import { IPost } from './interfaces/interfaces';
import { fetcheroo } from './util/fetching';

let firstRender = true

function App() {
  const [ postState, setPostState ] = useState<IPost[] | null>(null)

  useEffect(() => {
    if(firstRender) {
      firstRender = false
      
      fetcheroo()
        .then(objData => setPostState(objData.data.posts))
        .catch(err => console.log(err.message))
        .finally(() => console.log('📬 fetch called'))
    }
  }, [])

  const setOfTags = new Set<string>()
  postState?.forEach(post => {
    post.tags.forEach(tag => {
      setOfTags.add(tag)
    })
  })

  return (
    <>
      <Layout setOfTags={setOfTags}>
        <Routes>
          <Route path='/' element={
            <PostList 
              postState={postState} 
              setOfTags={setOfTags}
            />
          }/>

          {postState?.map((post, index) => (
            <Route
              key={index}
              path={`/${post.id}`}
              element={<PostView post={post}/>}
            />
          ))} 
        </Routes>          
      </Layout>
    </>
  );
}

export default App;
