import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', () => {
  let store;
  if (window.currentUser) {
    const preloadedState = { session: { currentUser: window.currentUser }};
    store = configureStore(preloadedState);
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});

// MISSING STUFF

// - ENTIRE USER ON THE FRONTEND - fix
// - FRIENDSHIPS - fix pending friends, accepting, etc.
// - HANDLING ERRORS - add error handling
// COVER PHOTO GOES BEHIND NAV BAR - add image uploading to profile and posts
