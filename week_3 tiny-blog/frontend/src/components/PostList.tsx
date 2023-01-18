import React, { useState } from 'react'

import PostCard from './PostCard';
import { IPost } from '../interfaces/interfaces';
import { capitalize } from '../util/capitalize';
import '../styles/styling-PostList.css'

type Props = {
  postState: IPost[] | null
  setOfTags: Set<string>
}

const PostList = ({postState, setOfTags}: Props) => {

  const [ collapsedSections, setCollapsedSections ] = useState<Set<string>>(new Set())
  
  return (
    <list-wrapper>
      {postState 
        ? (
          Array.from(setOfTags)
            .sort()
            .map((tag, index) => (
              <section key={index} id={`${tag}Section`}>
                <h3 onClick={() => {
                  const newState:Set<string> = new Set(collapsedSections)
                  collapsedSections.has(tag)
                    ? newState.delete(tag)
                    : newState.add(tag)
                  setCollapsedSections(newState)
                }}><span>{collapsedSections.has(tag) ? "▸" : "▾"}</span> {capitalize(tag)}</h3>

                <posts-card-wrapper class={collapsedSections.has(tag) ? "section__test --closed" : "section__test"}>
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