import React from 'react';

import SessionLoginForm from './session/session_form_login';
import SessionSignUpForm from './session/session_form_signup';
import SessionFooter from './session/session_footer';
import FeedComponent from './posts/feed_component';
import PostsComponent from './posts/posts_component';
import Modal from './modals/modal_component';
import Profile from './users/profile_component';
import Dropdown from './dropdowns/dropdown_component';
import NavBar from './nav_bar/nav_bar_component';

import { AuthRoute, ProtectedRoute } from '../util/route_util';

const App = props => {
  return(
    <div>
      <Modal />
      <Dropdown />
      <ProtectedRoute path="/" component={ NavBar } />
      <AuthRoute exact path="/" component={ SessionLoginForm } />
      <AuthRoute exact path="/" component={ SessionSignUpForm } />
      <AuthRoute exact path="/" component={ SessionFooter } />
      <ProtectedRoute path="/feed" component={ FeedComponent } />
      <ProtectedRoute path="/feed" component={ PostsComponent } />
      <ProtectedRoute path="/users/:userId" component={ Profile } />
    </div>
  );
};

export default App;
