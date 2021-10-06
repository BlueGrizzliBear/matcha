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

import ReactLoading from 'react-loading';
// import { sleep } from '../utility/utilities'

import { Box } from '@mui/material';

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

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ReactLoading
        type={"spinningBubbles"}
        color={"#ffffff"}
        height={100}
        width={100}
      />
    </Box>
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

    console.log("GOING TO ");
    console.log(this.props.path);
    console.log("Inside protected route");
    console.log(this.props.toRedirect);

    return (
      <Route
        {...props}
        render={props => (
          this.props.condition ? <Redirect to={this.props.toRedirect} /> : <Component {...this.props} />
        )}
      />
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isAuth: false,
      isActivated: false,
      isProfileComplete: false,
      isSent: false,
      hasToken: localStorage.getItem("token"),
      user: {}
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  login() {
    this.setState({ hasToken: localStorage.getItem("token") })
    this.fetchUser();
  }

  logout() {
    localStorage.removeItem("token");
    this.setState({ hasToken: null })
    this.cleanUser();
  }

  setValue(key, value) {
    this.setState({ [key]: value });
  }

  cleanUser() {
    this.setState({
      isAuth: false,
      isActivated: false,
      isProfileComplete: false,
      user: {}
    }, console.log("Finished cleaning values"));
  }

  fetchUser() {
    this.setState({ isLoading: true }, () => {
      console.log("Inside setState isLoading True");

      fetch("http://localhost:9000/user", {
        method: 'GET',
        headers: { 'Authorization': "Bearer " + this.state.hasToken },
      })
        .then(res => {
          if (res.ok && res.status === 200) {
            return res.json().then((data) => {
              this.setState({
                isAuth: data.isAuth,
                isActivated: data.isActivated,
                isProfileComplete: data.isProfileComplete,
                user: data,
                isLoading: false
              });
              // }, () => {
              //   sleep(2000).then(() => {
              //     console.log("Profile is complete ? :");
              //     console.log(this.state.isProfileComplete);
              //     this.setState({ isLoading: false });
              //   });
              // });
            })
          }
          else {
            localStorage.removeItem("token");
            this.setState({ isLoading: false, hasToken: null });
          }
        })
        .catch(error => {
          console.log(error);
          console.log("Fail to fetch");
        })

    });
    console.log("End off fetchUser");
  }

  componentDidMount() {
    if (this.state.hasToken)
      this.fetchUser();
  }

  render() {
    return (
      <>
        <header>
          <NavBar auth={this.state.isAuth} logout={this.logout} />
        </header>
        <main>

          {this.state.isLoading === true ?
            Loading()
            :
            this.state.isAuth ?
              <>
                <Switch>
                  <ProtectedRoute exact path='/' component={UserHomepage} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  <ProtectedRoute exact path='/notifications' component={Notifications} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  <ProtectedRoute exact path='/chat' component={Chat} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  <ProtectedRoute exact path='/profile' component={Profile} user={this.state.user} setValue={this.setValue} />
                  <ProtectedRoute exact path='/profile/:username' component={Profile} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  <ProtectedRoute path='/' component={NotFound} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                </Switch>
              </>
              :
              <>
                <Switch>
                  <Route exact path='/' component={PublicHomepage} />
                  <Route exact push path='/login'><Login auth={this.state.isAuth} login={this.login} isSent={this.state.isSent} /></Route>
                  <Route exact push path='/register'><Register setValue={this.setValue} /></Route>
                  {/* <Route push path='/'><Redirect to={"/"} /></Route> */}
                  {this.state.hasToken ? <Route path='/' component={NotFound} /> : <Route push path='/'><Redirect to={"/"} /></Route>}

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
