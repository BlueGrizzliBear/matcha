// import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import { TextField, IconButton, Typography, Box, Chip, MenuItem, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { Send as SendIcon, Close as CloseIcon, Visibility as VisibilityIcon, Favorite as FavoriteIcon, Comment as CommentIcon } from '@mui/icons-material';
import { LoadingMenu } from './Loading';

// const formStyle = (props) => makeStyles((theme) => ({
// root: {
// 	border: '1px solid #e2e2e1',
// 	overflow: 'hidden',
// 	borderRadius: 10,
// 	backgroundColor: '#fff',
// 	'&:hover': {
// 		backgroundColor: '#fff',
// 	},
// 	'&$focused': {
// 		backgroundColor: '#fff',
// 		borderColor: (props.error ? theme.palette.error.main : theme.palette.primary.main),
// 	},
// },
// focused: {},
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
			divider={props.i !== props.notifications.length ? true : false}
		>
			<ListItemAvatar>
				<Avatar alt={props.item.sender} src={props.item.sender_img} />
			</ListItemAvatar>
			<ListItemText
				primary={"New message from " + props.item.sender}
				secondary={parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent.substr(0, 25) + '... ' + new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
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
			divider={props.i !== props.chats.length ? true : false}
		>
			<ListItemAvatar>
				<Avatar alt={props.item.sender} src={props.item.sender_img} />
			</ListItemAvatar>
			<ListItemText
				primary={props.item.sender}
				secondary={parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent.substr(0, 35) + '... ' + new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
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
			{...props}
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
					sx={{ height: "100%", width: "80%", marginLeft: props.item.sender_user_id === props.item.user_id ? 0 : '20%' }}
					label={<Typography
						sx={{ whiteSpace: "normal" }}
					>
						{parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent}
					</Typography>}
				/>
				<Typography
					sx={{ fontSize: "10px", textAlign: "right", marginRight: props.item.sender_user_id === props.item.user_id ? '23%' : '10px' }}
				>
					{new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions) + ' - '}
				</Typography>
			</Box>
		</ListItem>
	);
}

export function ListItemHeader(props) {

	// const classes = formStyle(props)();
	return (

		<ListItem
			{...props}
			disableGutters
			sx={{ position: "sticky", top: 0, zIndex: 5, whiteSpace: "normal", padding: "5px 15px", margin: 0, backgroundColor: "primary.main" }}
			secondaryAction={
				<IconButton onClick={props.handleclose}>
					<CloseIcon />
				</IconButton>
			}
		>
			<ListItemText primary={props.sendername} />
		</ListItem>
	);
}


export function ListItemSendMessage(props) {

	// const classes = formStyle(props)();
	return (

		<ListItem
			{...props}
			disableGutters
			sx={{ position: "sticky", bottom: 0, zIndex: 5, whiteSpace: "normal", padding: "0 15px", margin: 0, backgroundColor: "primary.main" }}
			secondaryAction={
				<IconButton >
					<SendIcon />
				</IconButton>
			}
		>
			<TextField
				id="outlined-multiline-flexible"
				multiline
				maxRows={4}
				label="Send message"
			/>
		</ListItem>
	);
}
