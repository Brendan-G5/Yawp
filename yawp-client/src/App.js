import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
//Components
import NavBar from './components/Navbar'

//Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'


const theme = createMuiTheme({
  palette: {
    primary:{
      light: '#6ec6ff',
      main: '#2196f3',
      dark: '#0069c0',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ffe54c',
      main: '#ffb300',
      dark: '#c68400',
      contrastText: '#fff'
    }
  }
})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
    <div className="App">
      <Router>
        <NavBar/>
        <div className="container">
          <Switch>
            <Route exact path="/" component={home}/>
            <Route exact path="/login" component={login}/>
            <Route exact path="/signup" component={signup}/>
          </Switch>
        </div>
      </Router>
    </div>
    </MuiThemeProvider>
  );
}

export default App;
