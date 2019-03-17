import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App from "./src/App";
import About from "./src/About";
import reducers from "./src/reducers";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={App}/>
        <Route exact path='/about' component={About}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
