import React from 'react';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { Paper, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, ListItemButton } from '@mui/material';
import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, Comment as CommentIcon } from '@mui/icons-material';

function Notifications() {

	var parser = new DOMParser();
	const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	const notificationData = [
		{
			"message_id": null,
			"like_id": null,
			"watch_id": null,
		}
	]

	const [isLoading, setIsLoading] = useState(false);
	const [notifications, setNotifications] = useState(notificationData);

	useEffect(() => {
		setIsLoading(true);
		fetch("http://localhost:9000/notification", {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						setNotifications(data);
						console.log(data);
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
	}, []);

	return (
		<>

			{
				isLoading === true ?
					Loading()
					:
					<>
						<Paper
							// id="basic-menu"
							// anchorEl={anchorEl}
							// open={open}
							// onClose={handleClose}
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
						</Paper>
					</>
			}
		</>
	);
}

export default Notifications;
