import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { IconButton, Menu, Badge, Tooltip, MenuItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Circle as CircleIcon, Chat as ChatIcon } from '@mui/icons-material';
import { LoadingMenu } from './Loading';
import Chat from './Chat'

// import { sleep } from '../utility/utilities'

var parser = new DOMParser();
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
const data = [
	{
		"sender_user_id": null,
		"sender": null,
		"read": 1,
	}
];

export default function MessagesMenu(props) {

	/* MessagesMenu */
	const [menuIsLoading, setMenuIsLoading] = useState(false);
	const [messages, setMessages] = useState(data);
	const [anchorMessagesEl, setAnchorMessagesEl] = useState(null);
	const openMessages = Boolean(anchorMessagesEl);
	/* Chat */
	const [anchorChatEl, setAnchorChatEl] = useState(null);
	const [receiverId, setReceiverId] = useState(null);
	const openChat = Boolean(anchorChatEl);
	const [isOnline, setIsOnline] = useState({ id: null, online: false });

	/* MessagesMenu */
	const setChatToRead = (messages, chat) => {
		messages.forEach((item, i) => {
			if (item.read === 0 && item === chat)
				item.read = 1;
		});
		setMessages(messages);
	}

	const requestIsOnline = useCallback((messages) => {
		messages.forEach((item, i) => {
			if (props.websocket)
				props.websocket.send(JSON.stringify({ isUserOnline: item.user_id === item.sender_user_id ? item.receiver_user_id : item.sender_user_id }))
		})
	}, [props.websocket])

	const handleMessageClick = (event) => {
		setAnchorMessagesEl(event.currentTarget);
	};

	const handleMessagesClose = () => {
		setAnchorMessagesEl(null);
	};

	const countMessagesMenuBadgeNumber = (messages) => {
		let number = 0;
		messages.forEach((item, i) => {
			if (item.read === 0 && item.user_id !== item.sender_user_id)
				number++;
		});
		return number;
	};

	function MenuItemMessage(props) {
		return (
			<MenuItem
				{...props}
				sx={{ width: 328, whiteSpace: "normal" }}
				divider={props.i + 1 !== messages.length ? true : false}
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
		return (
			<MenuItem
				sx={{ width: 328, whiteSpace: "normal", display: 'flex', justifyContent: 'center' }}
			>
				{LoadingMenu()}
			</MenuItem>
		);
	}

	function MenuItemEmpty() {
		return (
			<MenuItem sx={{ width: 328, whiteSpace: "normal" }}>
				<ListItemText
					primary="You don't have any messages"
				/>
			</MenuItem>
		);
	}

	const handleChatClick = (event, chat) => {
		handleMessagesClose();
		setAnchorChatEl(props.footerref.current);
		setReceiverId(chat.sender_user_id === chat.user_id ? chat.receiver_user_id : chat.sender_user_id);
		setChatToRead(messages, chat);
	};

	const handleChatClose = () => {
		setReceiverId(null);
		setAnchorChatEl(null);
	};

	const fetchMessages = useCallback(() => {
		setMenuIsLoading(true);
		// sleep(2000).then(() => {
		fetch("http://" + process.env.REACT_APP_API_URL + "chat", {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						if (data.length) {
							setMessages(data);
							requestIsOnline(data);
						}
						setMenuIsLoading(false);
					})
				}
				else {
					console.log("Fail to get notifications");
					setMenuIsLoading(false);
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to fetch");
				setMenuIsLoading(false);
			})
		// })
	}, [requestIsOnline]);

	useEffect(() => {
		if (props.websocket != null) {
			props.websocket.addEventListener('message', function (msg) {
				msg = JSON.parse(msg.data);
				if (msg && msg.type === 'Message') {
					fetchMessages();
				}
				else if (msg && msg.type === "Online" && msg.user) {
					setIsOnline(msg);
				}
			});
		}
		fetchMessages();
	}, [props.websocket, fetchMessages]);

	return (
		<>
			<IconButton
				aria-label="show messages"
				style={{ height: "48px" }}
				color="inherit"
				aria-controls="messages-menu"
				aria-haspopup="true"
				aria-expanded={openMessages ? 'true' : undefined}
				onClick={handleMessageClick}
			>
				<Badge badgeContent={countMessagesMenuBadgeNumber(messages)} color="primary">
					<Tooltip title="Chat">
						<ChatIcon />
					</Tooltip>
				</Badge>
			</IconButton>
			<Menu
				id="messages-menu"
				anchorEl={anchorMessagesEl}
				open={openMessages}
				onClose={handleMessagesClose}
				footerref={props.footerref}

				sx={{ width: '100%', maxWidth: 360 }}>
				{
					menuIsLoading === true ?
						<MenuItemLoad key="1" />
						:
						messages.slice().reverse().map((item, i) => (
							(item.sender_user_id ?
								<MenuItemMessage
									i={i}
									key={i}
									item={item}
									aria-controls="chat-menu"
									aria-haspopup="true"
									aria-expanded={openChat ? 'true' : undefined}
									onClick={(e) => {
										handleChatClick(e, item);
									}}
								/>
								:
								<MenuItemEmpty key={i} />
							)
						))
				}
			</Menu >
			<Chat
				anchorel={anchorChatEl}
				open={openChat}
				receiverid={receiverId}
				handleclose={handleChatClose}
				websocket={props.websocket}
			/>
		</>
	)
}
