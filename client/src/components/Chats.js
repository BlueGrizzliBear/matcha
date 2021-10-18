import React from 'react';
import { useState } from 'react';
import { Box, Paper, Popper, Menu } from '@mui/material';
import { ListItemSendMessage, ListItemHeader, MenuItemChat, MenuItemLoad, MenuItemEmpty, ListItemConversation } from './NavBarMenu'

export default function Chats(props) {

	const data = [
		{
			"sender_user_id": null,
			"sender": null,
			"read": 1,
		}
	];
	const messagesEndRef = React.useRef(null)

	const [isLoading, setIsLoading] = useState(false);
	const [conversation, setConversation] = useState(data);
	const [senderName, setSenderName] = useState('Loading');
	const [senderId, setSenderId] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const fetchConversation = (senderId, ret) => {
		fetch("http://" + process.env.REACT_APP_API_URL + "chat/" + (senderId).toString(), {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						if (data)
							setConversation(data);
						setIsLoading(false);
						ret(true);
					})
				}
				else {
					console.log("Fail to get notifications");
					setIsLoading(false);
					ret(false);
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to fetch");
				setIsLoading(false);
				ret(false);
			})
	}

	const handleClick = (event, closeChats, conversations, chats, handleConversationClick) => {
		closeChats();
		setAnchorEl(props.footerref.current);
		setSenderName((chats.sender_user_id === chats.user_id ? chats.receiver : chats.sender).toString());
		setSenderId(chats.sender_user_id === chats.user_id ? chats.receiver_user_id : chats.sender_user_id);
		setIsLoading(true);
		fetchConversation(chats.sender_user_id === chats.user_id ? chats.receiver_user_id : chats.sender_user_id, function (results) {
			if (results === true) {
				handleConversationClick(conversations, chats);
				scrollToBottom();
			}
		});
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView(true);
	}

	return (
		<>
			<Menu
				id="chats-menu"
				anchorEl={props.anchorEl}
				open={props.open}
				onClose={props.onClose}
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
										handleClick(e, props.onClose, props.chats, item, props.handleconversationclick);
									}}
								/>
								:
								<MenuItemEmpty key={i} />
							)
						))
				}
			</Menu >
			<Popper
				key={"popper" + conversation[0].id}
				id="conversation-menu"
				anchorEl={anchorEl}
				// anchorReference={"none"}
				open={open}
				elevation={5}
				disablePortal={false}
				placement='bottom-end'
				modifiers={[
					{
						name: 'flip',
						enabled: true,
						options: {
							altBoundary: true,
							rootBoundary: 'viewport',
							padding: 8,
						},
					},
					{
						name: 'preventOverflow',
						enabled: true,
						options: {
							altAxis: true,
							altBoundary: true,
							tether: true,
							rootBoundary: 'viewport',
							padding: 8,
						},
					},
				]}
				sx={{ zIndex: 4 }}
			>
				<Paper>
					{
						isLoading === true ?
							<MenuItemLoad key="1" />
							:
							[
								<ListItemHeader key={"conversationHeader" + senderName} keybis={"conversationHeaderBis" + senderName} sendername={senderName} conversationclose={handleClose} />,
								<Box key="boxkey" sx={{ width: '100%', minWidth: 150, Width: 360, maxHeight: 450, overflow: "auto", }}>
									{conversation.slice().reverse().map((item, i) => (
										<ListItemConversation
											key={i + "bis"}
											keybis={i}
											item={item}
										/>
									))}
									<div
										style={{ float: "left", clear: "both" }}
										ref={messagesEndRef}
									>
									</div>
								</Box>,
								<ListItemSendMessage key={"conversationSender" + senderName} keybis={"conversationSenderBis" + senderName} senderid={senderId} fetchconversation={fetchConversation} scrollbottom={scrollToBottom} />
							]
					}
				</Paper>
			</Popper >
		</>
	)
}
