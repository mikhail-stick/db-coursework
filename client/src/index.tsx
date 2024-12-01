import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthContextProvider} from "./contexts/Auth/AuthContext";
import {Provider} from 'react-redux';
import {store} from 'store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <AuthContextProvider>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </AuthContextProvider>
    </Provider>

);
