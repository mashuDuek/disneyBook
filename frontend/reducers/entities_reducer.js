import PostReducer from './posts_reducer';
import UserReducer from './users_reducer';
import CommentsReducer from './comments_reducer';
import LikesReducer from './likes_reducer';
import { combineReducers } from 'redux';

const entitiesReducer = combineReducers({
  comments: CommentsReducer,
  likes: LikesReducer,
  posts: PostReducer,
  users: UserReducer,
});

export default entitiesReducer;
