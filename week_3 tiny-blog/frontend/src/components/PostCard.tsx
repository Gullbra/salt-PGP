import React from "react";
import { Link } from 'react-router-dom';

import { IPost } from "../interfaces/interfaces";
import '../styles/styling-PostCard.css'

const PostCard = ({post}: {post: IPost}) => {
  const clickFunc = () => {
    window.alert("You've downloaded a virus!")
  }

  return (
    <Link
      to={`/${post.id}`} 
      className="main__card" 
      //onClick={clickFunc}
    >
      <h4>{post.title}</h4>
    </Link>
  )
}

export default PostCard