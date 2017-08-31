export const fetchAllPosts = () => {
  return $.ajax({
    method: "GET",
    url: '/api/posts'
  });
};

export const updatePost = (post) => {
  return $.ajax({
    method: 'PATCH',
    url: `/api/posts/${post.id}`,
    data: post
  });
};

export const deletePost = (post) => {
  return $.ajax({
    method: 'DELETE',
    url: `/api/posts/${post.id}`
  });
};

export const createPost = (post) => {
  debugger
  return $.ajax({
    method: "POST",
    url: `/api/posts`,
    data: { post }
  });
};

export const fetchPost = (post) => {
  return $.ajax({
    method: "GET",
    url: `/api/posts/${post.id}`,
  });
};
