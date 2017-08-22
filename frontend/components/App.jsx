import React from 'react';
import SessionLoginFormContainer from './session/session_form_container_login';
import SessionSignUpFormContainer from './session/session_form_container_signup';
import SessionFooter from './session/session_footer';
import { Route } from 'react-router-dom';
import { AuthRoute } from '../util/route_util';

const App = (props) => {

  return(
    <div>
      <Route path="/disney" component={ SessionLoginFormContainer } />
      <Route path="/disney" component={ SessionSignUpFormContainer } />
      <Route path="/disney" component={ SessionFooter } />
    </div>
  );
};


export default App;
