import React, { Component } from 'react';
import '../assets/stylesheets/Components.css';
import { Switch, Route } from "react-router-dom";

import Homepage from './Homepage';
import UserHome from './UserHome';
import Login from './Login';
import Register from './Register';
import NavBar from '../components/NavBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", dbResponse: "" };
    
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

  componentWillMount() {
      this.callAPI();
      this.callDB();
  }

  render () {
    return (
      <>
        <header>
					<NavBar />
				</header>
				<main>
          <Switch>
            <Route exact path="/">
              <Homepage />
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
