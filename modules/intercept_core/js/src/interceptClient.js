import 'babel-polyfill';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import intercept from 'intercept-client';
import thunk from 'redux-thunk';
import * as select from './select';

const reducers = combineReducers({
  ...intercept.reducer,
});

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
const interceptClient = Object.assign({}, intercept, { store, select });
window.interceptClient = interceptClient;
export default interceptClient;