import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Main from './pages/Main';
import store from './redux/store';
import './App.global.scss';
import 'typeface-roboto';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" component={Main} />
        </Switch>
      </Router>
    </Provider>
  );
}
