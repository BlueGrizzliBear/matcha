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

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          this.props.condition ? <Redirect to={this.props.toRedirect} /> : <Component {...props} />
        )}
      />
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", dbResponse: "", userAuth: "", profileIncomplete: true };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    this.setState({ userAuth: "cb" }, () => {
    });
  }

  logout() {
    this.setState({ userAuth: "" }, () => {
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

  componentDidMount() {
    this.callAPI();
    this.callDB();
    // this.setState({ profileIncomplete: false });
  }

  render() {
    return (
      <>
        <header>
          <NavBar auth={this.state.userAuth} logout={this.logout}/>
        </header>
        <main>
          { this.state.userAuth ?
            <>
              <Switch>
                <ProtectedRoute exact path='/' component={UserHomepage} toRedirect="/profile" condition={ this.state.profileIncomplete === true } />
                <ProtectedRoute exact path='/notifications' component={Notifications} toRedirect="/profile" condition={ this.state.profileIncomplete === true } />
                <ProtectedRoute exact path='/chat' component={Chat} toRedirect="/profile" condition={ this.state.profileIncomplete === true } />
                <ProtectedRoute exact path='/profile' component={Profile} />
                <ProtectedRoute path='/' component={NotFound} toRedirect="/profile" condition={ this.state.profileIncomplete === true } />
              </Switch>
            </>
            :
            <>
              <Switch> 
                <Route exact path="/" component={PublicHomepage} />
                <Route exact push path="/login"><Login auth={this.state.userAuth} login={this.login} /></Route>
                <Route exact push path="/register" component={Register} />
                <ProtectedRoute path='/' component={NotFound} toRedirect="/" condition={!this.state.userAuth} />
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
