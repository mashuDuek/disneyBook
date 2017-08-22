import React from 'react';
import SessionLoginFormContainer from './session/session_form_container_login';
import SessionSignUpFormContainer from './session/session_form_container_signup';
import { Route } from 'react-router-dom';
import { AuthRoute } from '../util/route_util';

const App = (props) => {
  debugger
  return(
    <div>
      <header>
        <h1>disneyBook</h1>
      </header>

      <Route path="/disney" component={ SessionLoginFormContainer } />
      <Route path="/disney" component={ SessionSignUpFormContainer } />

    </div>
  );
};


export default App;
