import React from 'react';
import SessionLoginFormContainer from './session/session_form_container_login';
import SessionSignUpFormContainer from './session/session_form_container_signup';
import SessionFooter from './session/session_footer';
import { Route } from 'react-router-dom';
import { AuthRoute } from '../util/route_util';

const App = (props) => {

  return(
    <div>
      <Route exact path="/" component={ SessionLoginFormContainer } />
      <Route exact path="/" component={ SessionSignUpFormContainer } />
      <Route exact path="/" component={ SessionFooter } />
    </div>
  );
};


export default App;
