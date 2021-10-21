import React, { Component } from 'react';
import '../assets/stylesheets/Components.css';
import { Switch, Route, Redirect } from "react-router-dom";

import UserHomepage from './UserHomepage';
import ResetPassword from './ResetPassword';
import Chat from './Chat';
import Profile from './Profile';

import PublicHomepage from './PublicHomepage';
import Login from './Login';
import Register from './Register';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading'

// import { sleep } from '../utility/utilities'

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
          this.props.condition ? <Redirect to={this.props.toRedirect} /> : <Component {...this.props} />
        )}
      />
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.footerRef = React.createRef();
    this.state = {
      isLoading: false,
      isAuth: false,
      isActivated: false,
      isProfileComplete: false,
      isSent: false,
      hasToken: localStorage.getItem("token"),
      user: {},
      websocket: null,
      websocketEvent: null,
      socketMessage: null
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  websocketEventListener(websocket) {
    websocket.onmessage = (msg) => {
      msg = JSON.parse(msg.data);
      this.setState({ socketMessage: msg })
      console.log("Client received message from websocket :")
      console.log(msg)
    };
  }

  login() {
    this.setState({
      hasToken: localStorage.getItem("token"),
    }, () => {
      let websocket = new WebSocket('ws://' + process.env.REACT_APP_API_URL + '?token=' + localStorage.getItem("token"));
      this.websocketEventListener(websocket);
      this.setState({
        websocket: websocket
      })
    })
    this.fetchUser();
  }

  logout() {
    localStorage.removeItem("token");
    if (this.state.websocket)
      this.state.websocket.close();
    this.setState({ websocket: null });
    this.setState({ hasToken: null });
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
    });
  }

  fetchUser() {
    this.setState({ isLoading: true }, () => {
      fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
        method: 'GET',
        headers: { 'Authorization': "Bearer " + this.state.hasToken },
      })
        .then(res => {
          if (res.ok && res.status === 200) {
            return res.json().then((data) => {
              if (!this.state.websocket) {
                var websocket = new WebSocket('ws://' + process.env.REACT_APP_API_URL + '?token=' + localStorage.getItem("token"));
                this.websocketEventListener(websocket);
                console.log("WEBSOCKET")
              }
              this.setState({
                isAuth: data.isAuth,
                isActivated: data.isActivated,
                isProfileComplete: data.isProfileComplete,
                user: data,
                isLoading: false,
                websocket: websocket
              });
              // }, () => {
              //   sleep(2000).then(() => {
              //     this.setState({ isLoading: false });
              //   });
              // });
            })
          }
          else {
            localStorage.removeItem("token");
            if (this.state.websocket)
              this.state.websocket.close();
            this.setState({ isLoading: false, hasToken: null, websocket: null });
          }
        })
        .catch(error => {
          console.log(error);
          console.log("Fail to fetch");
          localStorage.removeItem("token");
          if (this.state.websocket)
            this.state.websocket.close();
          this.setState({ isLoading: false, hasToken: null, websocket: null });
        })
    });
  }

  componentDidMount() {
    if (this.state.hasToken)
      this.fetchUser();
  }

  shouldComponentUpdate() {
    if (this.state.socketMessage) {
      this.setState({ websocketEvent: this.state.socketMessage, socketMessage: null });
      return false;
    }
    return true;
  }

  render() {
    return (
      <>
        <header>
          <NavBar auth={this.state.isAuth} logout={this.logout} footerref={this.footerRef} websocket={this.state.websocket} websocketevent={this.state.websocketEvent} />
        </header>
        <main>

          {this.state.isLoading === true ?
            Loading()
            :
            this.state.isAuth ?
              <>
                <Switch>
                  <ProtectedRoute exact path='/' component={UserHomepage} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  {/* <ProtectedRoute exact path='/notifications' component={Notifications} toRedirect="/profile" condition={!this.state.isProfileComplete} /> */}
                  <ProtectedRoute exact path='/chat' component={Chat} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  <ProtectedRoute exact path='/profile' component={Profile} setValue={this.setValue} />
                  <ProtectedRoute path='/reset_password/:token' component={ResetPassword} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  <ProtectedRoute path='/profile/:username' component={Profile} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                  <ProtectedRoute path='/' component={NotFound} toRedirect="/profile" condition={!this.state.isProfileComplete} />
                </Switch>
              </>
              :
              <>
                <Switch>
                  <Route exact path='/' component={PublicHomepage} />
                  <ProtectedRoute path='/reset_password/:token' component={ResetPassword} />
                  <Route exact push path='/login'><Login auth={this.state.isAuth} login={this.login} isSent={this.state.isSent} /></Route>
                  <Route exact push path='/register'><Register setValue={this.setValue} /></Route>
                  {/* <Route push path='/'><Redirect to={"/"} /></Route> */}
                  {this.state.hasToken ? <Route path='/' component={NotFound} /> : <Route push path='/'><Redirect to={"/"} /></Route>}

                </Switch>
              </>
          }
        </main>
        <footer >
          <p id="notice">All photos are of professional models and used for illustrative purposes only</p>
          <p ref={this.footerRef}></p>
        </footer>
      </>
    );
  }
}

export default App;
