import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'

import configureStore from './store/configureStore';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create browser history to use in the Redux store
const history = createBrowserHistory();

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <ConnectedRouter history={history} >
            <App />
        </ConnectedRouter>
    </Provider>,

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
