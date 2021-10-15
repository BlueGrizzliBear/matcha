import React from 'react';
import { useState, useEffect } from 'react';
import Notifications from './Notifications'
import Chats from './Chats'
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

  const chatData = [
    {
      "sender_user_id": null,
      "sender": null,
      "read": 1,
    }
  ];

  const history = useHistory();
  const [notificationsAreLoading, setNotificationsAreLoading] = useState(false);
  const [chatsAreLoading, setChatsAreLoading] = useState(false);
  const [chats, setChats] = useState(chatData);
  const [notifications, setNotifications] = useState(notificationData);
  const [anchorNotifEl, setAnchorNotifEl] = useState(null);
  const [anchorChatEl, setAnchorChatEl] = useState(null);
  const openNotifications = Boolean(anchorNotifEl);
  const openChats = Boolean(anchorChatEl);

  const handleNotificationsClick = (event) => {
    setAnchorNotifEl(event.currentTarget);
    setNotificationsAreLoading(true);
    fetch("http://localhost:9000/notification/read", {
      method: 'GET',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          setNotifications(changeNotificationsToRead(notifications));
          setNotificationsAreLoading(false);
        }
        else {
          console.log("Fail to put status read on notifications");
          setNotificationsAreLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to fetch");
        setNotificationsAreLoading(false);
      })
  };

  const handleConversationClick = (data, conversation) => {
    data.forEach((item, i) => {
      if (item.read === 0 && item === conversation)
        item.read = 1;
    });
    setChats(data);
  }

  const handleNotificationsClose = () => {
    setAnchorNotifEl(null);
  };

  const handleChatsClick = (event) => {
    setAnchorChatEl(event.currentTarget);
  };

  const handleChatsClose = () => {
    setAnchorChatEl(null);
  };

  const changeNotificationsToRead = (data) => {
    data.forEach((item, i) => {
      if (item.read === 0)
        item.read = 1;
    });
    return data;
  };

  const countNotificationBadgeNumber = (data) => {
    let number = 0;
    data.forEach((item, i) => {
      if (item.read === 0)
        number++;
    });
    return number;
  };

  const countChatBadgeNumber = (data) => {
    let number = 0;
    data.forEach((item, i) => {
      if (item.read === 0 && item.user_id !== item.sender_user_id)
        number++;
    });
    return number;
  };

  useEffect(() => {
    setNotificationsAreLoading(true);
    fetch("http://localhost:9000/notification", {
      method: 'GET',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          return res.json().then((data) => {
            if (data)
              setNotifications(data);
            setNotificationsAreLoading(false);
          })
        }
        else {
          console.log("Fail to get notifications");
          setNotificationsAreLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to fetch");
        setNotificationsAreLoading(false);
      })
  }, []);

  useEffect(() => {
    setChatsAreLoading(true);
    fetch("http://localhost:9000/chat", {
      method: 'GET',
      headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          return res.json().then((data) => {
            if (data)
              setChats(data);
            setChatsAreLoading(false);
          })
        }
        else {
          console.log("Fail to get notifications");
          setChatsAreLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to fetch");
        setChatsAreLoading(false);
      })
  }, []);

  // useEffect(() => {
  //   props.websocket.onmessage = evt => {
  //     // listen to data sent from the websocket server
  //     console.log(evt.data)
  //   }

  // }, [props.websocket]);

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
                    aria-expanded={openNotifications ? 'true' : undefined}
                    onClick={handleNotificationsClick}
                  >
                    <Badge badgeContent={countNotificationBadgeNumber(notifications)} color="primary">
                      <Tooltip title="notifications">
                        <NotificationsIcon />
                      </Tooltip>
                    </Badge>
                  </IconButton>
                  <Notifications
                    anchorEl={anchorNotifEl}
                    open={openNotifications}
                    onClose={handleNotificationsClose}
                    isloading={notificationsAreLoading.toString()}
                    notifications={notifications}
                  />
                  <IconButton
                    aria-label="show chat"
                    style={{ height: "48px" }}
                    color="inherit"
                    aria-controls="chats-menu"
                    aria-haspopup="true"
                    aria-expanded={openChats ? 'true' : undefined}
                    onClick={handleChatsClick}
                  >
                    <Badge badgeContent={countChatBadgeNumber(chats)} color="primary">
                      <Tooltip title="chat">
                        <ChatIcon />
                      </Tooltip>
                    </Badge>
                  </IconButton>
                  <Chats
                    anchorEl={anchorChatEl}
                    open={openChats}
                    onClose={handleChatsClose}
                    isloading={chatsAreLoading.toString()}
                    chats={chats}
                    footerref={props.footerref}
                    handleconversationclick={handleConversationClick}
                  />
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
