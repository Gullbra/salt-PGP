import React from "react";
import { Link } from 'react-router-dom';

import { IPost } from "../interfaces/interfaces";
import '../styles/styling-PostCard.css'

const PostCard = ({post}: {post: IPost}) => {

  return (
    <Link
      to={`/${post.id}`} 
      className="main__card" 
    >
      <h4>{post.title}</h4>

      <p>{post.body.slice(0,100)}...</p>
      
      <p>{post.tags.map(tag => `#${tag}`).join(" ")}</p>
    </Link>
  )
}

export default PostCard