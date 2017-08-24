import React from 'react';
import SessionLoginFormContainer from './session/session_form_container_login';
import SessionSignUpFormContainer from './session/session_form_container_signup';
import SessionFooter from './session/session_footer';
import PostsContainer from './posts/posts_container';

import { Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';

const App = (props) => {

  return(
    <div>
      <AuthRoute exact path="/" component={ SessionLoginFormContainer } />
      <AuthRoute exact path="/" component={ SessionSignUpFormContainer } />
      <AuthRoute exact path="/" component={ SessionFooter } />
      <ProtectedRoute exact path="/feed" component={ PostsContainer } />
    </div>
  );
};

// will add a route to /feed, and that will be posts component.
// next route should go to users/:userId which should include
        // posts component as well.

export default App;
