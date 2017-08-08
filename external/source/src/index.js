import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'whatwg-fetch';

// Components
import App from './components/App';

// Root reducer
import rootReducer from './store/reducers/rootReducer';

// Styles
import './styles/index.css';
import './styles/tracks.css';
import './styles/filters.css';
import './styles/topbar.css';
import './styles/sidebar.css';
import './styles/loading.css';
import './styles/select.css';
import './styles/statistic.css';
import './styles/skills.css';
import './styles/skills-user.css';
import './styles/range-slider.css';
import './styles/stats.css';
import './styles/mobile.css';
import './styles/general.css';

// Service worker
import registerServiceWorker from './registerServiceWorker';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

registerServiceWorker();
