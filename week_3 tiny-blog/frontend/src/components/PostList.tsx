import React from 'react'

import PostCard from './PostCard';
import { IPost } from '../interfaces/interfaces';


const PostList = ({postState}: {postState: IPost[] | null}) => {
  
  return (
    <list-wrapper>
      {postState 
        ? (
          postState.map((post, index) => <PostCard key={index} post={post}/>)
        ) : (
          <p>Loading</p>
        )
      }
      
    </list-wrapper>
  )
}

export default PostList