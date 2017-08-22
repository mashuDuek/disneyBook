import React from 'react';
import SessionFormContainer from './session/session_form_container';
import { Route } from 'react-router-dom';
import { AuthRoute } from '../util/route_util';

const App = (props) => {
  return(
    <div>
      <header>
        <h1>Bench BnB</h1>
      </header>

      <AuthRoute path="/login" component={ SessionFormContainer } />
      <AuthRoute path="/signup" component={ SessionFormContainer } />
      <Route exact path="/" component={ SearchContainer } />

    </div>
  );
};


export default App;
