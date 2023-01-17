import React, {useEffect, useState} from 'react'

import { IPost } from '../interfaces/interfaces';
import { fetcheroo } from '../util/fetching';

let firstRender = true

const PostList = () => {

  const [ postState, setPostState ] = useState<IPost[] | null>(null)

  useEffect(() => {
    if(!postState && firstRender){
      console.log('📬 fetching...')
      firstRender = false
      
      fetcheroo()
        .then(objData => setPostState(objData.data.posts))
    }
  }, [])
  
  return (
    <list-wrapper>
      <p>list</p>
    </list-wrapper>
  )
}

export default PostList