import React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';

import SessionLoginFormContainer from './session/session_form_container_login';
import SessionSignUpFormContainer from './session/session_form_container_signup';
import SessionFooter from './session/session_footer';
import FeedComponent from './posts/feed_component';
import PostsContainer from './posts/posts_container';
import ModalContainer from './modals/modal_container';
import ProfileContainer from './users/profile_container';
import DropdownContainer from './dropdowns/dropdown_container';
import NavBarContainer from './nav_bar/nav_bar_container';

import { AuthRoute, ProtectedRoute } from '../util/route_util';

const App = (props) => {
  return(
    <div>
      <ModalContainer />
      <DropdownContainer />
      <ProtectedRoute path="/" component={ NavBarContainer } />
      <AuthRoute exact path="/" component={ SessionLoginFormContainer } />
      <AuthRoute exact path="/" component={ SessionSignUpFormContainer } />
      <AuthRoute exact path="/" component={ SessionFooter } />
      <ProtectedRoute path="/feed" component={ FeedComponent } />
      <ProtectedRoute path="/feed" component={ PostsContainer } />
      <ProtectedRoute path="/users/:userId" component={ ProfileContainer } />
    </div>
  );
};

export default App;
