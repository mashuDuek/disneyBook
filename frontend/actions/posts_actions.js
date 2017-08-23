import * as APIUtil from '../util/post_util';

export const RECEIVE_POST = 'RECEIVE_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const FETCH_ALL_POSTS = 'FETCH_ALL_POSTS';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';


export const receivePost = (post) => {
  return {
    type: RECEIVE_POST,
    post: post
  };
};

export const editPost = (post) => {
  return {
    type: UPDATE_POST,
    post: post
  };
};

export const destroyPost = (post) => {
  return {
    type: DELETE_POST,
    post: post
  };
};

export const fetchPosts = (posts) => {
  return {
    type: FETCH_ALL_POSTS,
    posts
  };
};

export const receiveErrors = (errors) => {

  return {
    type: RECEIVE_ERRORS,
    errors: errors
  };
};

// export const receiveUsers = (users) => {
//   return{
//     type: RECEIVE_USERS,
//     users: users
//   };
// };

export const createPost = (post) => {
  return (dispatch) => {
    return APIUtil.createPost(post).
      then((post) => dispatch(receivePost(post)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};


export const updatePost = (post) => {
  return (dispatch) => {
    return APIUtil.updatePost(post).
      then((post) => dispatch(editPost(post)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const deletePost = (post) => {
  return (dispatch) => {
    return APIUtil.deletePost(post).
      then((post) => dispatch(deletePost(post)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const fetchAllPosts = () => {
  return (dispatch) => {
    return APIUtil.fetchAllPosts().
      then((posts) => dispatch(fetchPosts(posts)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

// export const fetchUsers = () => {
//   return(dispatch) => {
//     return APIUtil.fetchAllUsers().
//       then((users) => dispatch(receiveUsers(users)),
//       (errors) => dispatch(receiveErrors(errors))
//     );
//   };
// };
