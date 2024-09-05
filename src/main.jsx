import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import { Provider } from 'react-redux'; // Import Provider
import { store } from './redux/store'; // Import your Redux store
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>  {/* Wrap App with Provider */}
      <Router>  {/* Wrap App with Router */}
        <App />
      </Router>
    </Provider>
  </StrictMode>
);
