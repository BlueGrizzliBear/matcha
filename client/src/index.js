import React from 'react';
import ReactDOM from 'react-dom';
import './assets/stylesheets/index.css';
import App from './pages/App';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ef5da8',
    },
    secondary: {
      main: '#fcddec',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
