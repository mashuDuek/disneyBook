import React from 'react';
import SessionLoginFormContainer from './session/session_form_container_login';
import SessionSignUpFormContainer from './session/session_form_container_signup';
import SessionFooter from './session/session_footer';
import PostsContainer from './posts/posts_container';

import { Route } from 'react-router-dom';
import { AuthRoute } from '../util/route_util';

const App = (props) => {

  return(
    <div>
      <Route exact path="/" component={ SessionLoginFormContainer } />
      <Route exact path="/" component={ SessionSignUpFormContainer } />
      <Route exact path="/" component={ SessionFooter } />
      <Route exact path="/feed" component={ PostsContainer } />
    </div>
  );
};

// will add a route to /feed, and that will be posts component.
// next route should go to users/:userId which should include
        // posts component as well.

export default App;
