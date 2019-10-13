import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFoundPage from '/src/client/pages/NotFoundPage';
import IndexPage from '/src/client/pages/IndexPage';
import BuildPage from '/src/client/pages/BuildPage';

import s from './App.css';

class App extends Component {
    render() {

        return (
            <main className={s.root}>
                <Switch>
                    <Route exact path="/" component={IndexPage} />
                    <Route path="/build/:id" component={BuildPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </main>
        );
    }
}

export default App;
