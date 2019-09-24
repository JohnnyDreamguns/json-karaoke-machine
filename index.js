import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import Home from './src/containers/Home';
import About from './src/containers/About';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { store } from './src/store';

window.addEventListener('error', function(e) {
  alert('ERROR');
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
