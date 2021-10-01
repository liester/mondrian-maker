import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import store from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';

import './css/styles.scss';
import LandingPage from './components/landing-page/LandingPage';
import FlexContainer from './components/common/flex-container/FlexContainer';
import Header from './components/header/Header';

ReactDOM.render(
  <Provider store={store}>
    <FlexContainer flexDirection="column" style={{ height: '100%' }}>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    </FlexContainer>
  </Provider>,
  document.getElementById('root'),
);
