import React, { Component } from 'react';
import '../assets/stylesheets/Components.css';
import { Redirect, Switch, Route } from "react-router-dom";

import Homepage from './Homepage';
import Login from './Login';
import Register from './Register';
import UserHome from './UserHome';
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
    this.state = { apiResponse: "", dbResponse: "", userHomeResponse: "" };

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

  callUserHome() {
    // catch the username if exist or null
    fetch("http://localhost:9000/")
      .then(res => res.json())
      .then(data => {
        this.setState({ userHomeResponse: data.user })
      })
      .catch(console.error);
  }

  componentDidMount() {
    this.callAPI();
    this.callDB();
    this.callUserHome();
  }

  render() {
    return (
      <>
        <header>
          <NavBar />
        </header>
        <main>
          <Switch>
            <Route exact path="/">
              {this.userHomeResponse ? <Redirect to="/userhome" /> : <Homepage />}
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/userhome">
              <UserHome />
            </Route>
            <Route component={NotFound} />
              {/* <UserHome /> */}
            {/* </Route> */}
          </Switch>
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
