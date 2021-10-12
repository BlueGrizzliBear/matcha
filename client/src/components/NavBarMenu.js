// import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import { MenuItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, Comment as CommentIcon } from '@mui/icons-material';
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
				secondary={parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent + ' ' + new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions)}
			/>
			<Divider orientation="vertical" variant="middle" flexItem sx={{ margin: '10px' }} />
			<CommentIcon />
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
