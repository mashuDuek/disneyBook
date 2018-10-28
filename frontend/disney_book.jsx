import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', () => { 
  let preLoadedState = {};
  if (window.currentUser) {
    preLoadedState = { session: { currentUser: window.currentUser }};
    delete window.currentUser;
  }
  const store = configureStore(preLoadedState);
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});
