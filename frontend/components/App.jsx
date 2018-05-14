import React from 'react';
import SessionLoginFormContainer from './session/session_form_container_login';
import SessionSignUpFormContainer from './session/session_form_container_signup';
import SessionFooter from './session/session_footer';
import FeedContainer from './posts/feed_container';
import PostsContainer from './posts/posts_container';
import ModalContainer from './modals/modal_container';
import ProfileContainer from './users/profile_container';
import DropdownContainer from './dropdowns/dropdown_container';
import NavBarContainer from './nav_bar/nav_bar_container';

import { Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router';

const App = (props) => {
  debugger
  return(
    <div>
      <ModalContainer />
      <DropdownContainer />
      <ProtectedRoute path="/" component={ NavBarContainer } />
      <AuthRoute exact path="/" component={ SessionLoginFormContainer } />
      <AuthRoute exact path="/" component={ SessionSignUpFormContainer } />
      <AuthRoute exact path="/" component={ SessionFooter } />
      <ProtectedRoute exact path="/feed" component={ FeedContainer } />
      <ProtectedRoute exact path="/feed" component={ PostsContainer } />
      <ProtectedRoute exact path="/users/:userId" component={ ProfileContainer } />
    </div>
  );
};

export default App;
