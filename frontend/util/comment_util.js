export const fetchAllComments = () => {
  return $.ajax({
    method: "GET",
    url: '/api/comments'
  });
};

export const updateComment = (comment) => {
  return $.ajax({
    method: 'PATCH',
    url: `/api/comments/${comment.id}`,
    data: comment
  });
};

export const deleteComment = (comment) => {
  return $.ajax({
    method: 'DELETE',
    url: `/api/comments/${comment.id}`
  });
};

export const createComment = (comment) => {
  return $.ajax({
    method: "POST",
    url: `/api/comments`,
    data: { comment }
  });
};

export const fetchComment = (comment) => {
  return $.ajax({
    method: "GET",
    url: `/api/comments`,
    data: { comment }
  });
};
