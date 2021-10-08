import React from 'react';
import ReactDOM from 'react-dom';
import './assets/stylesheets/index.css';
import App from './pages/App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { BrowserRouter as Router } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: '#ef5da8',
    },
    secondary: {
      main: '#fcddec',
    },
    match: {
      main: '#ef5c66',
    },
    placeholder: {
      main: '#c4c4c4',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
