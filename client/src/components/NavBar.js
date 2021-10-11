import React from 'react';
import { useState, useEffect } from 'react';
import { Menu, Paper, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, ListItemButton } from '@mui/material';

import { IconButton, Button, Box, Badge, Tooltip } from '@mui/material';
import { Notifications as NotificationsIcon, Chat as ChatIcon } from '@mui/icons-material';
import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, Comment as CommentIcon } from '@mui/icons-material';

import { Switch, Route, Link } from "react-router-dom";

import '../assets/stylesheets/Components.css';

import { ReactComponent as ProfileIcon } from "../assets/images/profile.svg";
import { ReactComponent as LogoutIcon } from "../assets/images/logout.svg";

import { useHistory } from "react-router-dom";

function NavBar(props) {

  var parser = new DOMParser();
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const notificationData = [
    {
      "message_id": null,
      "like_id": null,
      "watch_id": null,
    }
  ];

  const history = useHistory();
  const [notifications, setNotifications] = useState(notificationData);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetch("http://localhost:9000/notification", {
      method: 'GET',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          return res.json().then((data) => {
            setNotifications(data);
            console.log(data);
          })
        }
        else {
          console.log("Fail to get notifications");
        }
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to fetch");
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
                  // component={Link} to="/notifications"
                  >
                    <Badge badgeContent={notifications.length} color="primary">
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
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'placeholder.main' }}>
                    {notifications.map((item, i) => (
                      (item.message_id) ?
                        <ListItem
                          key={i}
                          alignItems="flex-start"
                          divider={i + 1 !== notifications.length ? true : false}
                          disablePadding
                        >
                          <ListItemButton>
                            <ListItemAvatar>
                              <Avatar alt={item.sender} src={item.sender_img} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={"New message from " + item.sender}
                              secondary={parser.parseFromString('<!doctype html><body>' + item.message, 'text/html').body.textContent + ' ' + new Date(item.sent_date).toLocaleDateString("en-US", dateOptions)}
                            />
                            <Divider orientation="vertical" variant="middle" flexItem sx={{ margin: '10px' }} />
                            <CommentIcon />
                          </ListItemButton>
                        </ListItem>
                        : (item.like_id ?
                          <ListItem
                            key={i}
                            alignItems="flex-start"
                            divider={i + 1 !== notifications.length ? true : false}
                            disablePadding
                          >
                            <ListItemButton>
                              <ListItemAvatar>
                                <Avatar alt={item.sender} src={item.sender_img} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={"New like from " + item.sender}
                                secondary={new Date(item.sent_date).toLocaleDateString("en-US", dateOptions)}
                              />
                              <Divider orientation="vertical" variant="middle" flexItem sx={{ margin: '10px' }} />
                              <FavoriteIcon />
                            </ListItemButton>
                          </ListItem>
                          : (item.watch_id ?
                            <ListItem
                              key={i}
                              alignItems="flex-start"
                              divider={i + 1 !== notifications.length ? true : false}
                              disablePadding
                            >
                              <ListItemButton>
                                <ListItemAvatar>
                                  <Avatar alt={item.sender} src={item.sender_img} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={item.sender + " watched your profile"}
                                  secondary={new Date(item.sent_date).toLocaleDateString("en-US", dateOptions)}
                                />
                                <Divider orientation="vertical" variant="middle" flexItem sx={{ margin: '10px' }} />
                                <VisibilityIcon />
                              </ListItemButton>
                            </ListItem>
                            :
                            <ListItem key={i} alignItems="flex-start" divider={i + 1 !== notifications.length ? true : false}>
                              <ListItemButton>
                                <ListItemText
                                  primary="You don't have any notifications"
                                />
                              </ListItemButton>
                            </ListItem>
                          )
                        )
                    ))}
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
