import React, { Component } from 'react';
import '../assets/stylesheets/Components.css';
import { Switch, Route, Redirect } from "react-router-dom";

import UserHomepage from './UserHomepage';
import Notifications from './Notifications';
import Chat from './Chat';
import Profile from './Profile';

import PublicHomepage from './PublicHomepage';
import Login from './Login';
import Register from './Register';
import NavBar from '../components/NavBar';

function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) staticContext.status = code;
        return children;
      }}
    />
  );
}

function NotFound() {
  return (
    <Status code={404}>
      <h1>Sorry, can’t find that.</h1>
    </Status>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", dbResponse: "", userAuth: false };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    // console.log(this.state.userAuth);
    this.setState({ userAuth: true }, () => {
      // console.log(this.state.userAuth);
      return (
        <Redirect to="/" />
      );
    });
  }

  logout() {
    // console.log(this.state.userAuth);
    localStorage.removeItem("token");
    this.setState({ userAuth: false }, () => {
      // console.log(this.state.userAuth);
      return (
        <Redirect to="/" />
      );
    });
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  callDB() {
    fetch("http://localhost:9000/testDB")
      .then(res => res.text())
      .then(res => this.setState({ dbResponse: res }))
      .catch(err => err);
  }

  callUserIsAuth() {
    // catch the username if exist or null
    fetch("http://localhost:9000/check_token", {
      method: 'POST',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })
      .then(res => {
        if (res.ok) {
          console.log("Token is valid");
          this.setState({ userAuth: true })
        }
        else {
          console.log("Invalid token");
          this.setState({ userAuth: false })
        }
      })
  }

  componentDidMount() {
    this.callAPI();
    this.callDB();
    this.callUserIsAuth();
  }

  render() {
    return (
      <>
        <header>
          <NavBar auth={this.state.userAuth} logout={this.logout} />
        </header>
        <main>
          {this.state.userAuth ?
            <>
              <Switch>
                <Route exact path="/"><UserHomepage /></Route>
                <Route exact path="/notifications"><Notifications /></Route>
                <Route exact path="/chat"><Chat /></Route>
                <Route exact path="/profile"><Profile /></Route>
                <Route path="/"><NotFound /></Route>
              </Switch>
            </>
            :
            <>
              <Switch>
                <Route exact path="/"><PublicHomepage /></Route>
                <Route exact push path="/login"><Login auth={this.state.userAuth} login={this.login} /></Route>
                <Route exact push path="/register"><Register /></Route>
                <Route path="/"><NotFound /></Route>
              </Switch>
            </>
          }
        </main>
        <footer>
          <p id="notice">All photos are of professional models and used for illustrative purposes only</p>
          <div className="App-intro">{this.state.apiResponse}</div>
          <div className="App-intro">{this.state.dbResponse}</div>
        </footer>
      </>
    );
  }
}

export default App;
