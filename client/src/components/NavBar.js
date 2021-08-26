import React from 'react';
import Button from '@material-ui/core/Button';
import { ReactComponent as MatchaIcon } from "../assets/images/logo.svg";
import '../assets/stylesheets/Components.css';
import { Switch, Route, Link } from "react-router-dom";

function NavBar(props) {

  return (
    <div id="NavBar">
      <Button edge="start" color="inherit" aria-label="menu" component={Link} to="/"><MatchaIcon/></Button>
      <Switch>
        <Route exact path="/">
          <Button variant="contained" color="primary" component={Link} to="/login">Sign in</Button>
        </Route>
        <Route path="/login">
          <></>
        </Route>
        <Route path="/register">
          <></>
        </Route>
        <Route path="/">
          <p>You are logged in</p>
        </Route>
      </Switch>
    </div>
  );
}

export default NavBar;
