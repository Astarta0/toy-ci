/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '/src/client/reducers/root';

/* global window */
const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk)
);

export const store = createStore(rootReducer, enhancer);

window.store = store;
/* eslint-enable */
