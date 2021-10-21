import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { IconButton, Menu, Badge, Tooltip, MenuItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Circle as CircleIcon, Chat as ChatIcon } from '@mui/icons-material';
import { LoadingMenu } from './Loading';
import Chat from './Chat'

import { sleep } from '../utility/utilities'

var parser = new DOMParser();
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

export default function Messages(props) {

	const data = [
		{
			"sender_user_id": null,
			"sender": null,
			"read": 1,
		}
	];
	// const messagesEndRef = React.useRef(null)

	/* chats */
	const [chatsAreLoading, setChatsAreLoading] = useState(false);
	const [chats, setChats] = useState(data);
	const [anchorChatEl, setAnchorChatEl] = useState(null);
	const openChats = Boolean(anchorChatEl);
	/* Conversations */
	const [anchorEl, setAnchorEl] = useState(null);
	const [receiverId, setReceiverId] = useState(null);
	const open = Boolean(anchorEl);
	const [isOnline, setIsOnline] = useState({ id: null, online: false });
	// const [receivedMessage, setReceivedMessage] = useState({ id: null });

	/* Chats */
	const handleConversationClick = (data, conversation) => {
		data.forEach((item, i) => {
			if (item.read === 0 && item === conversation)
				item.read = 1;
		});
		setChats(data);
	}

	const requestIsOnline = useCallback((object) => {
		object.forEach((item, i) => {
			if (props.websocket)
				props.websocket.send(JSON.stringify({ isUserOnline: item.user_id === item.sender_user_id ? item.receiver_user_id : item.sender_user_id }))
		})
	}, [props.websocket])

	const handleChatsClick = (event, object) => {
		setAnchorChatEl(event.currentTarget);
		// requestIsOnline(object);
	};

	const handleChatsClose = () => {
		setReceiverId(null);
		setAnchorChatEl(null);
	};

	const countChatBadgeNumber = (data) => {
		let number = 0;
		data.forEach((item, i) => {
			if (item.read === 0 && item.user_id !== item.sender_user_id)
				number++;
		});
		return number;
	};

	function MenuItemChat(props) {

		// const classes = formStyle(props)();
		return (
			<MenuItem
				{...props}
				sx={{ width: 328, whiteSpace: "normal" }}
				divider={props.i + 1 !== chats.length ? true : false}
			>
				<ListItemAvatar>
					<Avatar alt={props.item.user_id === props.item.receiver_user_id ? props.item.sender : props.item.receiver} src={props.item.user_id === props.item.receiver_user_id ? props.item.sender_img : props.item.receiver_img} />
				</ListItemAvatar>
				<ListItemText
					primary={props.item.user_id === props.item.receiver_user_id ? props.item.sender : props.item.receiver}
					secondary={(props.item.user_id === props.item.sender_user_id ? 'You: ' : '') + parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent.substr(0, props.item.user_id === props.item.sender_user_id ? 30 : 35) + ' - ' + new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
				/>
				<CircleIcon sx={{ width: "12px", marginLeft: "12px", color: ((props.item.user_id === props.item.receiver_user_id && isOnline.user === props.item.sender_user_id) || (props.item.user_id === props.item.sender_user_id && isOnline.user === props.item.receiver_user_id)) && isOnline.online ? "green" : "red" }} />
			</MenuItem>
		);
	}

	function MenuItemLoad() {

		// const classes = formStyle(props)();
		return (
			<MenuItem
				sx={{ width: 328, whiteSpace: "normal", display: 'flex', justifyContent: 'center' }}
			>
				{LoadingMenu()}
			</MenuItem>
		);
	}

	function MenuItemEmpty() {

		// const classes = formStyle(props)();
		return (
			<MenuItem sx={{ width: 328, whiteSpace: "normal" }}>
				<ListItemText
					primary="You don't have any messages"
				/>
			</MenuItem>
		);
	}

	const handleClick = (event, closeChats, conversations, chats, handleConversationClick) => {
		closeChats();
		setAnchorEl(props.footerref.current);
		setReceiverId(chats.sender_user_id === chats.user_id ? chats.receiver_user_id : chats.sender_user_id);
		handleConversationClick(conversations, chats);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const fetchMessages = useCallback(() => {
		console.log('fetching chat')
		setChatsAreLoading(true);
		sleep(2000).then(() => {
			fetch("http://" + process.env.REACT_APP_API_URL + "chat", {
				method: 'GET',
				headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
			})
				.then(res => {
					if (res.ok && res.status === 200) {
						return res.json().then((data) => {
							if (data.length) {
								setChats(data);
								requestIsOnline(data);
							}
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
		})
	}, [requestIsOnline]);

	useEffect(() => {
		fetchMessages();
	}, [fetchMessages]);

	useEffect(() => {
		if (props.websocketevent.type === "Online" && props.websocketevent.user) {
			setIsOnline(props.websocketevent);
		}
	}, [props.websocketevent]);

	useEffect(() => {
		if (props.websocketevent.type === 'Message') {
			console.log("setting receiver id")
			setReceiverId(props.websocketevent.id);
			fetchMessages();
		}
	}, [props.websocketevent, fetchMessages]);

	return (
		<>
			<IconButton
				aria-label="show chat"
				style={{ height: "48px" }}
				color="inherit"
				aria-controls="chats-menu"
				aria-haspopup="true"
				aria-expanded={openChats ? 'true' : undefined}
				onClick={(e) => {
					handleChatsClick(e, chats);
				}}
			>
				<Badge badgeContent={countChatBadgeNumber(chats)} color="primary">
					<Tooltip title="Chat">
						<ChatIcon />
					</Tooltip>
				</Badge>
			</IconButton>
			<Menu
				id="chats-menu"
				anchorEl={anchorChatEl}
				open={openChats}
				onClose={handleChatsClose}
				footerref={props.footerref}

				sx={{ width: '100%', maxWidth: 360 }}>
				{
					chatsAreLoading === true ?
						<MenuItemLoad key="1" />
						:
						chats.slice().reverse().map((item, i) => (
							(item.sender_user_id ?
								<MenuItemChat
									i={i}
									key={i}
									item={item}
									aria-controls="conversation-menu"
									aria-haspopup="true"
									aria-expanded={open ? 'true' : undefined}
									onClick={(e) => {
										handleClick(e, handleChatsClose, chats, item, handleConversationClick);
									}}
								/>
								:
								<MenuItemEmpty key={i} />
							)
						))
				}
			</Menu >
			<Chat
				anchorel={anchorEl}
				open={open}
				receiverid={receiverId}
				handleclose={handleClose}
				websocketevent={props.websocketevent}
			/>
		</>
	)
}
