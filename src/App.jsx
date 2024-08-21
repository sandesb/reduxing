import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import BodyLayout from './theme/BodyLayout';
import MyClasses from './pages/MyClasses';
import Account from './pages/Account';
import Messages from './pages/Messges';
import HelpCenter from './pages/HelpCenter';
import HomePage from './pages/HomePage';
import { Provider } from 'react-redux';
import {store} from './redux/store';
import { Toaster } from 'react-hot-toast';

function App() {
  
  return (
    <Provider store={store}>
          <Toaster position="top-right" />

      <Router>
        <Routes>
          <Route path="/" element={<BodyLayout />}>
            <Route index element={<HomePage />} />
            <Route path="my-classes" element={<MyClasses />} />
            <Route path="account" element={<Account />} />
            <Route path="messages" element={<Messages />} />
            <Route path="help-center" element={<HelpCenter />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
