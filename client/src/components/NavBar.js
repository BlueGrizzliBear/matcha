import React from 'react';
import { useState, useEffect } from 'react';
import { Menu } from '@mui/material';
import { MenuItemMessage, MenuItemLike, MenuItemWatch, MenuItemLoad, MenuItemEmpty } from './NavBarMenu'
import { IconButton, Button, Box, Badge, Tooltip } from '@mui/material';
import { Notifications as NotificationsIcon, Chat as ChatIcon } from '@mui/icons-material';

import { Switch, Route, Link } from "react-router-dom";

import '../assets/stylesheets/Components.css';

import { ReactComponent as ProfileIcon } from "../assets/images/profile.svg";
import { ReactComponent as LogoutIcon } from "../assets/images/logout.svg";

import { useHistory } from "react-router-dom";

function NavBar(props) {

  const notificationData = [
    {
      "message_id": null,
      "like_id": null,
      "watch_id": null,
      "read": 1
    }
  ];

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsLoading(true);
    fetch("http://localhost:9000/notification/read", {
      method: 'GET',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          setNotifications(changeNotificationsToRead(notifications));
          setIsLoading(false);
        }
        else {
          console.log("Fail to put status read on notifications");
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to fetch");
        setIsLoading(false);
      })
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeNotificationsToRead = (data) => {
    data.forEach((item, i) => {
      if (item.read === 0)
        item.read = 1;
    });
    return data;
  };

  const countNotificationsNumber = (data) => {
    let number = 0;
    data.forEach((item, i) => {
      if (item.read === 0)
        number++;
    });
    return number;
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:9000/notification", {
      method: 'GET',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          return res.json().then((data) => {
            if (data)
              setNotifications(data);
            setIsLoading(false);
          })
        }
        else {
          console.log("Fail to get notifications");
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to fetch");
        setIsLoading(false);
      })
  }, []);

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
                  <IconButton
                    aria-label="show new notifications"
                    style={{ height: "48px" }}
                    color="inherit"
                    aria-controls="notifications-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <Badge badgeContent={countNotificationsNumber(notifications)} color="primary">
                      <Tooltip title="notifications">
                        <NotificationsIcon />
                      </Tooltip>
                    </Badge>
                  </IconButton>
                  <Menu
                    id="notifications-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{ width: '100%', maxWidth: 360 }}>
                    {
                      isLoading === true ?
                        <MenuItemLoad key="1" />
                        :
                        notifications.slice().reverse().map((item, i) => (
                          (item.message_id) ?
                            <MenuItemMessage i={i} key={i} to={"/profile/" + item.sender} notifications={notifications} item={item} />
                            : (item.like_id ?
                              <MenuItemLike i={i} key={i} to={"/profile/" + item.sender} notifications={notifications} item={item} />
                              : (item.watch_id ?
                                <MenuItemWatch i={i} key={i} to={"/profile/" + item.sender} notifications={notifications} item={item} />
                                :
                                <MenuItemEmpty key={i} />
                              )
                            )
                        ))
                    }
                  </Menu>
                  <IconButton aria-label="show chat" color="inherit" component={Link} to="/chat" style={{ height: "48px" }}>
                    <Badge badgeContent={3} color="primary">
                      <Tooltip title="chat">
                        <ChatIcon />
                      </Tooltip>
                    </Badge>
                  </IconButton>
                  <IconButton aria-label="show profile" color="inherit" component={Link} to="/profile" style={{ height: "24px" }}>
                    <Tooltip title="profile">
                      <ProfileIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton aria-label="log out" color="inherit" onClick={handleLogout} style={{ height: "48px" }}>
                    <Tooltip title="logout">
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
