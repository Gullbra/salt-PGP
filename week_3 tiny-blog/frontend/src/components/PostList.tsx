import React from 'react'

import PostCard from './PostCard';
import { IPost } from '../interfaces/interfaces';
import { capitalize } from '../util/capitalize';

const PostList = ({postState, setOfTags}: {postState: IPost[] | null, setOfTags: Set<string>}) => {
    
  return (
    <list-wrapper>
      {postState 
        ? (
          Array.from(setOfTags)
            .sort()
            .map((tag, index) => (
              <section key={index} id={`${tag}Section`}>
                <h3>{capitalize(tag)}</h3>

                {postState
                  .filter((post => post.tags.includes(tag)))
                  .map((post, index) => <PostCard key={index} post={post}/>)
                }
              </section>
            ))
        ) : (
          <p>Loading</p>
        )
      }
      
    </list-wrapper>
  )
}

export default PostList