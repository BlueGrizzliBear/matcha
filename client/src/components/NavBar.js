import React from 'react';
import Notifications from './Notifications'
import Messages from './Messages'
import { IconButton, Button, Box, Tooltip } from '@mui/material';

import { Switch, Route, Link } from "react-router-dom";

import '../assets/stylesheets/Components.css';

import { ReactComponent as ProfileIcon } from "../assets/images/profile.svg";
import { ReactComponent as LogoutIcon } from "../assets/images/logout.svg";

import { useHistory } from "react-router-dom";

function NavBar(props) {

  const history = useHistory();

  const handleLogout = () => {
    props.logout();
    history.push(`/`);
  }

  return (
    <Box id="NavBar">
      <IconButton aria-label="search with Matcha" color="inherit" component={Link} to="/" style={{ height: "48px" }}>
        <img id="Logo" alt="logo" />
      </IconButton>
      <Switch>
        <Route path="/">
          {props.auth ?
            <Switch>
              <Route path="/login">
                <></>
              </Route>
              <Route path="/register">
                <></>
              </Route>
              <Route path="/">
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <Notifications />
                  <Messages footerref={props.footerref} />
                  <IconButton aria-label="show profile" color="inherit" component={Link} to="/profile" style={{ height: "24px" }}>
                    <Tooltip title="Profile">
                      <ProfileIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton aria-label="log out" color="inherit" onClick={handleLogout} style={{ height: "48px" }}>
                    <Tooltip title="Logout">
                      <LogoutIcon />
                    </Tooltip>
                  </IconButton>
                </Box>
              </Route>
            </Switch>
            :
            <Button variant="contained" color="primary" component={Link} to="/login" style={{ margin: "6px 8px" }}>
              Sign in
            </Button>
          }
        </Route>
      </Switch>
    </Box>
  );
}

export default NavBar;
