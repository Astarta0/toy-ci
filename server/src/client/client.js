import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import './css/index.css';

import App from './components/App';
import { history } from './history';
import { store } from './store/configureStore';


const MainApp = () => (
    <Provider store={store}>
        <Router history={history} >
            <App />
        </Router>
    </Provider>
);

ReactDOM.render(<MainApp />, document.getElementById('root'));
