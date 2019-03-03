import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from "redux";
import { Provider } from "react-redux";
import App from "./src/App";
import reducers from "./src/reducers";

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
<Provider store={store}>
  <App />
</Provider>, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
