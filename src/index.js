import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationProvider } from './context/notifyContext';
import { AuthProvider  } from './context/auth.context';
import { ThemeProvider  } from './context/theme.context';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
