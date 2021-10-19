import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IconButton, Menu, Badge, Tooltip, MenuItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, Comment as CommentIcon } from '@mui/icons-material';
import { sleep } from '../utility/utilities'
import { LoadingMenu } from './Loading';

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function MenuItemMessage(props) {
	var parser = new DOMParser();

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

function MenuItemLike(props) {

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

function MenuItemWatch(props) {

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
				primary="You don't have any notifications"
			/>
		</MenuItem>
	);
}

export default function Notifications(props) {

	const notificationData = [
		{
			"message_id": null,
			"like_id": null,
			"watch_id": null,
			"read": 1
		}
	];

	const [isLoading, setIsLoading] = useState(false);
	const [notifications, setNotifications] = useState(notificationData);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleNotificationsClick = (event) => {
		setAnchorEl(event.currentTarget);
		setIsLoading(true);
		sleep(2000).then(() => {

			fetch("http://" + process.env.REACT_APP_API_URL + "notification/read", {
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
		})
	};

	const handleNotificationsClose = () => {
		setAnchorEl(null);
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

	useEffect(() => {
		setIsLoading(true);
		sleep(2000).then(() => {

			fetch("http://" + process.env.REACT_APP_API_URL + "notification", {
				method: 'GET',
				headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
			})
				.then(res => {
					if (res.ok && res.status === 200) {
						return res.json().then((data) => {
							if (data.length)
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
		})
	}, []);

	return (
		<>
			<IconButton
				aria-label="show new notifications"
				style={{ height: "48px" }}
				color="inherit"
				aria-controls="notifications-menu"
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleNotificationsClick}
			>
				<Badge badgeContent={countNotificationBadgeNumber(notifications)} color="primary">
					<Tooltip title="Notifications">
						<NotificationsIcon />
					</Tooltip>
				</Badge>
			</IconButton>
			<Menu
				id="notifications-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleNotificationsClose}

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
		</>
	)
}
