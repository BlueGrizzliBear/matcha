import React from 'react';
import { IconButton, Button, Box, Badge } from '@material-ui/core';
import { Switch, Route, Link } from "react-router-dom";
import '../assets/stylesheets/Components.css';

import { useHistory } from "react-router-dom";

import { ReactComponent as ProfileIcon } from "../assets/images/profile.svg";
import { ReactComponent as LogoutIcon } from "../assets/images/logout.svg";
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChatIcon from '@material-ui/icons/Chat';

function NavBar(props) {

  const history = useHistory();

  const handleLogout = () => {
    props.logout();
    let path = `/`; 
    history.push(path);
  }

  return (
    <Box id="NavBar">
      <IconButton aria-label="search with Matcha" color="inherit" component={Link} to="/" style={{ height: "48px" }}>
      {/* <Button color="inherit" aria-label="search with Matcha" component={Link} to="/"> */}
        <img id="Logo" alt="logo" />
      {/* </Button> */}
      </IconButton>
      <Switch>
        <Route path="/">
          { props.auth ? 
            <Switch>
              <Route path="/login">
                <></>
              </Route>
              <Route path="/register">
                <></>
              </Route>
              <Route path="/">
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <IconButton aria-label="show 11 new notifications" color="inherit" component={Link} to="/notifications" style={{ height: "48px" }}>
                    <Badge badgeContent={11} color="primary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton aria-label="show chat" color="inherit" component={Link} to="/chat" style={{ height: "48px" }}>
                    <Badge badgeContent={3} color="primary">
                      <ChatIcon />
                    </Badge>
                  </IconButton>
                  <IconButton aria-label="show profile" color="inherit" component={Link} to="/profile" style={{ height: "24px" }}>
                    <ProfileIcon />
                  </IconButton>
                  <IconButton aria-label="log out" color="inherit" onClick={handleLogout} style={{ height: "48px" }}>
                    <LogoutIcon />
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
