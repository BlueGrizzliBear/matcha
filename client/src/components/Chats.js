import React from 'react';
import { useState } from 'react';
import { Menu } from '@mui/material';
import { ListItemSendMessage, ListItemHeader, MenuItemChat, MenuItemLoad, MenuItemEmpty, ListItemConversation } from './NavBarMenu'

export default function Chats(props) {
	const data = [
		{
			"sender_user_id": null,
			"sender": null,
			"read": 1,
		}
	];

	const [isLoading, setIsLoading] = useState(false);
	const [conversation, setConversation] = useState(data);
	const [senderName, setSenderName] = useState('Loading');
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event, closeChats, chats) => {
		closeChats();
		setAnchorEl(props.footerref.current);
		setSenderName((chats.sender_user_id === chats.user_id ? chats.receiver : chats.sender).toString());
		setIsLoading(true);
		fetch("http://localhost:9000/chat/" + (chats.sender_user_id === chats.user_id ? chats.receiver_user_id : chats.sender_user_id).toString(), {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						if (data)
							setConversation(data);
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
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Menu
				id="chats-menu"
				{...props}
				sx={{ width: '100%', maxWidth: 360 }}>
				{
					props.isloading === true ?
						<MenuItemLoad key="1" />
						:
						props.chats.slice().reverse().map((item, i) => (
							(item.sender_user_id ?
								<MenuItemChat
									i={i}
									key={i}
									chats={props.chats}
									item={item}
									aria-controls="conversation-menu"
									aria-haspopup="true"
									aria-expanded={open ? 'true' : undefined}
									onClick={(e) => {
										handleClick(e, props.onClose, item);
									}}
								/>
								:
								<MenuItemEmpty key={i} />
							)
						))
				}
			</Menu >
			<Menu
				id="conversation-menu"
				anchorEl={anchorEl}
				open={open}
				// onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center"
				}}
				sx={{ width: '100%', Width: 360, maxHeight: 600 }}
			>
				{
					isLoading === true ?
						<MenuItemLoad key="1" />
						:
						[
							<ListItemHeader key={"conversationHeader" + senderName} sendername={senderName} handleclose={handleClose} />,
							conversation.slice().reverse().map((item, i) => (
								<ListItemConversation
									key={i}
									item={item}
								/>
							)),
							<ListItemSendMessage key={"conversationSender" + senderName} />
						]
				}
			</Menu >
		</>
	)
}
