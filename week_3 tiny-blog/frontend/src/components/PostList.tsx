import React from 'react'

import PostCard from './PostCard';
import { IPost } from '../interfaces/interfaces';
import { capitalize } from '../util/capitalize';
import '../styles/styling-PostList.css'

type Props = {
  postState: IPost[] | null
  setOfTags: Set<string>
}

const PostList = ({postState, setOfTags}: Props) => {
    
  const testFunc = (event:React.MouseEvent<HTMLSpanElement>) => {
    // console.log(event.target)
    // console.log(event.currentTarget.parentElement?.nextElementSibling)

    if (
      event.currentTarget.parentElement?.nextElementSibling?.classList.value.includes('--closed')
    ) {
      return event.currentTarget.parentElement?.nextElementSibling?.classList.remove('--closed')
    }
    //if (event.currentTarget.parentElement?.nextElementSibling?.classList)
    return event.currentTarget.parentElement?.nextElementSibling?.classList.add('--closed')
  }

  return (
    <list-wrapper>
      {postState 
        ? (
          Array.from(setOfTags)
            .sort()
            .map((tag, index) => (
              <section key={index} id={`${tag}Section`}>
                <h3>{capitalize(tag)} <span onClick={(event) => testFunc(event)}>click here</span></h3>

                <posts-card-wrapper class="section__test">
                  {postState
                    .filter((post => post.tags.includes(tag)))
                    .map((post, index) => <PostCard key={index} post={post}/>)
                  }
                </posts-card-wrapper>
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