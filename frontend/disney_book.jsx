import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', () => { 
  let preLoadedState = {};
  const { currentUser: user } = window;
  if (user) {
    preLoadedState = { 
      session: { currentUser: user },
      entities: { users: { [user.id]: user }}
    };
    delete window.currentUser;
  };

  const store = configureStore(preLoadedState);
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});
