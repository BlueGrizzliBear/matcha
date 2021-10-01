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
          this.props.condition ? <Redirect to={this.props.toRedirect} /> : <Component {...props} {...this.props.user}/>
        )}
      />
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      isActivated: false,
      isProfileComplete: false,
      user: {}
    };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    this.setState({ isAuth: true });
  }

  logout() {
    localStorage.removeItem("token");
    this.setState({ isAuth: false });
  }

  callUserIsAuth() {
    console.log("Inside CallUserisAuth");
    // catch the username if exist or null
    fetch("http://localhost:9000/user", {
      method: 'GET',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })

      .then(res => {
        if (res.ok && res.status === 200) {
          return res.json().then((data) => {
            this.setState({ isAuth: data.isAuth });
            this.setState({ isActivated: data.isActivated });
            this.setState({ isProfileComplete: data.isProfileComplete });
            this.setState({ user: data });
					})
        }
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to fetch");
      })
  }

  componentDidMount() {
    this.callUserIsAuth();
  }

  render() {
    return (
      <>
        <header>
          <NavBar auth={this.state.isAuth} logout={this.logout} />
        </header>
        <main>
          {this.state.isAuth ?
            <>
              <Switch>
                <ProtectedRoute exact path='/' component={UserHomepage} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                <ProtectedRoute exact path='/notifications' component={Notifications} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                <ProtectedRoute exact path='/chat' component={Chat} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                <ProtectedRoute exact path='/profile' component={Profile} user={this.state.user}/>
                <ProtectedRoute path='/' component={NotFound} toRedirect="/profile" condition={!this.state.isProfileComplete} />
              </Switch>
            </>
            :
            <>
              <Switch>
                <Route exact path="/" component={PublicHomepage} />
                <Route exact push path="/login"><Login auth={this.state.isAuth} login={this.login} /></Route>
                <Route exact push path="/register" component={Register} />
                <ProtectedRoute path='/' component={NotFound} toRedirect="/" condition={!this.state.isAuth} />
              </Switch>
            </>
          }
        </main>
        <footer>
          <p id="notice">All photos are of professional models and used for illustrative purposes only</p>
        </footer>
      </>
    );
  }
}

export default App;
