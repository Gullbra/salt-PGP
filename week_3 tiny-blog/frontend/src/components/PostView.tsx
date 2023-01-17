import React from "react";

import { IPost } from "../interfaces/interfaces";

const PostView = ({post}: {post: IPost}) => {

  return (
    <>
      <h2>{post.title}</h2>

      <p>{post.body}</p>
    </>
  )

}

export default PostView