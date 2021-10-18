import React from 'react';
// import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { TextField, IconButton, Typography, Box, Chip, MenuItem, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { Send as SendIcon, Close as CloseIcon, Visibility as VisibilityIcon, Favorite as FavoriteIcon, Comment as CommentIcon } from '@mui/icons-material';
import { LoadingMenu } from './Loading';

// const formStyle = (props) => makeStyles((theme) => ({
// 	root: {
// 		border: 'none',
// 		width: "90%",
// 		background: '#fff',
// 		// 	'&:hover': {
// 		// 		border: 'none',
// 		// 	},
// 		// 	'&$focused': {
// 		// 		backgroundColor: '#fff',
// 		// 		borderColor: (props.error ? theme.palette.error.main : theme.palette.primary.main),
// 		// 	},
// 	},
// 	input: {
// 		border: 'none',
// 	},
// 	// focused: {},
// }));

var parser = new DOMParser();
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

export function MenuItemMessage(props) {

	// const classes = formStyle(props)();
	return (
		<MenuItem
			{...props}
			sx={{ width: 328, whiteSpace: "normal" }}
			component={Link}
			divider={props.i + 1 !== props.notifications.length ? true : false}
		>
			<ListItemAvatar>
				<Avatar alt={props.item.sender} src={props.item.sender_img} />
			</ListItemAvatar>
			<ListItemText
				primary={"New message from " + props.item.sender}
				secondary={parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent.substr(0, 25) + ' - ' + new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
			/>
			<Divider orientation="vertical" variant="middle" flexItem sx={{ margin: '10px' }} />
			<CommentIcon />
		</MenuItem>
	);
}

export function MenuItemChat(props) {

	// const classes = formStyle(props)();
	return (
		<MenuItem
			{...props}
			sx={{ width: 328, whiteSpace: "normal" }}
			divider={props.i + 1 !== props.chats.length ? true : false}
		>
			<ListItemAvatar>
				<Avatar alt={props.item.user_id === props.item.receiver_user_id ? props.item.sender : props.item.receiver} src={props.item.user_id === props.item.receiver_user_id ? props.item.sender_img : props.item.receiver_img} />
			</ListItemAvatar>
			<ListItemText
				primary={props.item.user_id === props.item.receiver_user_id ? props.item.sender : props.item.receiver}
				secondary={(props.item.user_id === props.item.sender_user_id ? 'You: ' : '') + parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent.substr(0, props.item.user_id === props.item.sender_user_id ? 30 : 35) + ' - ' + new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
			/>
		</MenuItem>
	);
}

export function MenuItemLike(props) {

	// const classes = formStyle(props)();
	return (
		<MenuItem
			{...props}
			sx={{ width: 328, whiteSpace: "normal" }}
			component={Link}
			divider={props.i + 1 !== props.notifications.length ? true : false}
		>
			<ListItemAvatar>
				<Avatar alt={props.item.sender} src={props.item.sender_img} />
			</ListItemAvatar>
			<ListItemText
				primary={"New like from " + props.item.sender}
				secondary={new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
			/>
			<Divider orientation="vertical" variant="middle" flexItem sx={{ margin: '10px' }} />
			<FavoriteIcon />
		</MenuItem>
	);
}

export function MenuItemWatch(props) {

	// const classes = formStyle(props)();
	return (
		<MenuItem
			{...props}
			sx={{ width: 328, whiteSpace: "normal" }}
			component={Link}
			divider={props.i + 1 !== props.notifications.length ? true : false}
		>
			<ListItemAvatar>
				<Avatar alt={props.item.sender} src={props.item.sender_img} />
			</ListItemAvatar>
			<ListItemText
				primary={"New like from " + props.item.sender}
				secondary={new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
			/>
			<Divider orientation="vertical" variant="middle" flexItem sx={{ margin: '10px' }} />
			<VisibilityIcon />
		</MenuItem>
	);
}

export function MenuItemLoad() {

	// const classes = formStyle(props)();
	return (
		<MenuItem
			sx={{ width: 328, whiteSpace: "normal", display: 'flex', justifyContent: 'center' }}
		>
			{LoadingMenu()}
		</MenuItem>
	);
}

export function MenuItemEmpty() {

	// const classes = formStyle(props)();
	return (
		<MenuItem sx={{ width: 328, whiteSpace: "normal" }}>
			<ListItemText
				primary="You don't have any notifications"
			/>
		</MenuItem>
	);
}

export function ListItemConversation(props) {

	// const classes = formStyle(props)();
	return (
		<ListItem
			key={props.keybis}
			sx={{ padding: "0 8px", width: 328, whiteSpace: "normal" }}
		>
			<Box sx={{ dislpay: "flex", justifyContent: "flex-end" }}>
				<Typography
					sx={{ fontSize: "10px", whiteSpace: "normal", marginLeft: props.item.sender_user_id === props.item.user_id ? "10px" : '23%' }}
				>
					{props.item.sender ? props.item.sender : props.item.receiver}
				</Typography>
				<Chip
					color={props.item.sender_user_id === props.item.user_id ? 'primary' : 'secondary'}
					sx={{ height: "100%", maxWidth: "80%", marginLeft: props.item.sender_user_id === props.item.user_id ? 0 : '20%' }}
					label={<Typography
						sx={{ overflowWrap: "anywhere", whiteSpace: "normal" }}
					>
						{parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent}
					</Typography>}
				/>
				<Typography
					sx={{ minWidth: "160px", fontSize: "10px", textAlign: "right", marginRight: props.item.sender_user_id === props.item.user_id ? '23%' : '10px' }}
				>
					{new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions) + ' - ' + (props.item.read ? '✓' : 'Sent')}
				</Typography>
			</Box>
		</ListItem>
	);
}

export function ListItemHeader(props) {

	// const classes = formStyle(props)();
	return (

		<ListItem
			key={props.keybis}
			disableGutters
			sx={{ borderRadius: "4px 4px 0 0", zIndex: 5, whiteSpace: "normal", padding: "5px 15px", margin: 0, backgroundColor: "primary.main" }}
			secondaryAction={
				<IconButton onClick={props.conversationclose}>
					<CloseIcon />
				</IconButton>
			}
		>
			<ListItemText primary={props.sendername} />
		</ListItem>
	);
}


export function ListItemSendMessage(props, senderIDm, fetchConversation) {

	const [values, setValues] = useState({
		message: '',
	});

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const textFieldRef = React.useRef(null)

	const sendMessage = (event, senderId, fetchConversation, scrollToBottom) => {
		if (values.message) {
			fetch("http://" + process.env.REACT_APP_API_URL + "chat/" + (senderId).toString() + "/send", {
				method: 'POST',
				headers: {
					'Authorization': "Bearer " + localStorage.getItem("token"),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: values.message,
				})
			})
				.then(res => {
					if (res.ok && res.status === 200) {
						fetchConversation(senderId, function (results) {
							if (results === true)
								scrollToBottom()
							return;
						});
					}
					else {
						console.log("Fail to send message");
					}
				})
				.catch(error => {
					console.log(error);
					console.log("Fail to fetch");
				})
		}
	}

	// const classes = formStyle(props)();
	return (

		<ListItem
			key={props.keybis}
			disableGutters
			sx={{ borderRadius: "0 0 4px 4px", zIndex: 5, whiteSpace: "normal", padding: "5px 15px", margin: 0, backgroundColor: "primary.main" }}
			secondaryAction={
				<IconButton
					onClick={(e) => {
						textFieldRef.current.focus();
						sendMessage(e, props.senderid, props.fetchconversation, props.scrollbottom);
					}}
				>
					<SendIcon />
				</IconButton>
			}
		>
			<TextField
				// classes={classes}
				inputRef={textFieldRef}
				size="small"
				hiddenLabel
				id="filled-hidden-label-normal"
				placeholder="Write a message"
				multiline
				maxRows={2}
				onChange={handleChange('message')}
				// InputProps={classes.input}
				sx={{ width: "90%", backgroundColor: '#fff' }}
			/>
		</ListItem>
	);
}
