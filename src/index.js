import React from 'react';
import './index.scss';
import './Fonts/Fonts.scss';
import './Utils/Colors.scss';
import ReactDOM from 'react-dom/client';
import App from './App/App';
import { BrowserRouter } from 'react-router-dom';
import store, { persistedStore } from "./Configs/ReduxStore";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
