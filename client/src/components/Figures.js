
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box, Chip, Stack, Tooltip, IconButton, Button, TextField, Menu, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LikeButton from './LikeButton';
import { MoreVert as MoreVertIcon, Chat as ChatIcon, Visibility as VisibilityIcon, Favorite as FavoriteIcon, LocationOn as LocationOnIcon, Block as BlockIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import calculateAge from '../utility/utilities'
import Chat from './Chat'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		overflow: 'hidden',
		margin: '0px 11px',
		'@media screen and (min-width: 768px)': {
			margin: '0px 18px',
		},
		'@media screen and (min-width: 1552px)': {
			margin: '0px auto',
		}
	},
	FigureRoot: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignItems: 'center',
		overflow: 'hidden',
	},
}));

function Figures({ user, editable, likeable, updateUser, ...props }) {

	const classes = useStyles();
	const [editLoc, setEditLoc] = React.useState(true);
	const [ipAdress, setIpAdress] = React.useState(null);
	const [values, setValues] = useState({
		city: '',
		country: '',
		report: ''
	});
	const [anchorChatEl, setAnchorChatEl] = useState(null);
	const [anchorOptionsEl, setAnchorOptionsEl] = useState(null);
	const openChat = Boolean(anchorChatEl);
	const openOptions = Boolean(anchorOptionsEl);
	const [receiverId, setReceiverId] = useState(null);
	const [websocket, setWebsocket] = useState(null);
	const [blocked, setBlocked] = useState(false);
	const [openReport, setOpenReport] = React.useState(false);

	let textInput = useRef(null);

	const estimateAddress = (value, placeholder) => {
		return (value ? value : placeholder);
	}

	const handleEditLocation = () => {
		if (editLoc) {
			setEditLoc(false);
		}
		else {
			console.log(values);
			fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
				method: 'POST',
				headers: {
					'Authorization': "Bearer " + localStorage.getItem("token"),
					'Content-Type': 'application/json',
					'x-forwarded-for': ipAdress
				},
				body: JSON.stringify({
					location_mode: false,
					city: values.city,
					country: values.country
				})
			})
				.then(res => {
					if (res.ok) {
						return res.json().then((data) => {
							updateUser(data);
							setEditLoc(true);
						})
					}
					else {
						console.log("Fail to add bio");
					}
				})
				.catch(() => {
					console.log("Fail to add bio");
				})
		}
	};

	const handleBlock = (e) => {
		fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + user.username + (blocked ? '/unblock' : '/block'), {
			method: 'GET',
			headers: {
				'Authorization': "Bearer " + localStorage.getItem("token"),
			},
		})
			.then(res => {
				if (res.ok) {
					fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + user.username, {
						method: 'GET',
						headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
					})
						.then(res => {
							if (res.ok && res.status === 200) {
								return res.json().then((data) => {
									updateUser(data);
								})
							}
						})
						.catch(error => {
							console.log(error);
							console.log("Fail to fetch user data");
						})
					setBlocked(!blocked);
				}
				else {
					console.log("Fail to block user");
				}
			})
			.catch((error) => {
				console.log(error);
				console.log("Fail to block user");
			})
	}

	const handleLocation = (e) => {
		if (!user.location_mode) {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(function (position) {
					fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
						method: 'POST',
						headers: {
							'Authorization': "Bearer " + localStorage.getItem("token"),
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							location_mode: !user.location_mode,
							gps_long: position.coords.longitude,
							gps_lat: position.coords.latitude
						})
					})
						.then(res => {
							if (res.ok) {
								return res.json().then((data) => {
									updateUser(data);
								})
							}
						})
						.catch(() => {
							console.log("Fail to update user location to server");
						})
				});
			}
			else {
				console.log("Geolocation is Not Available on navigator");
			}
		}
		else {
			fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
				method: 'POST',
				headers: {
					'Authorization': "Bearer " + localStorage.getItem("token"),
					'Content-Type': 'application/json',
					'x-forwarded-for': ipAdress
				},
				body: JSON.stringify({
					location_mode: !user.location_mode,
					city: user.city,
					country: user.country,
				})
			})
				.then(res => {
					if (res.ok) {
						return res.json().then((data) => {
							updateUser(data);
						})
					}
				})
				.catch(() => {
					console.log("Fail to update user location to server");
				})
		}
	}

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleChatClick = (event) => {
		setAnchorChatEl(props.footerref.current);
		setReceiverId(user.id);
	};

	const handleOptionsClick = (event) => {
		setAnchorOptionsEl(event.currentTarget);
	};

	const handleChatClose = () => {
		setReceiverId(null);
		setAnchorChatEl(null);
	};

	const handleOptionsClose = () => {
		setAnchorOptionsEl(null);
	};

	const handleClickOpenReport = () => {
		setOpenReport(true);
		setAnchorOptionsEl(null);
	};

	const handleCloseReport = () => {
		setOpenReport(false);
	};

	const handleSendReport = () => {
		fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + user.username + '/report', {
			method: 'POST',
			headers: {
				'Authorization': "Bearer " + localStorage.getItem("token"),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				reason: values.report,
			})
		})
			.then(res => {
				if (res.ok) {
					setOpenReport(false);
				}
				else {
					console.log("Fail to report user");
				}
			})
			.catch((error) => {
				console.log(error);
			})
	};

	useEffect(() => {
		if (user.city && user.country)
			setValues({ city: user.city, country: user.country });
	}, [user.city, user.country]);

	useEffect(() => {
		setBlocked(user.blocked);
	}, [user.blocked]);

	useEffect(() => {
		if (!editLoc) {
			textInput.current.focus();
		}
	}, [editLoc])

	useEffect(() => {
		if (user) {
			fetch("http://api6.ipify.org/?format=json", {
				method: 'GET',
			})
				.then(res => {
					if (res.ok) {
						return res.json().then((data) => {
							setIpAdress(data.ip);
						})
					}
				})
				.catch(() => {
					console.log("Fail to get client ip adress");
				})
		}
	}, [user])

	useEffect(() => {
		setWebsocket(props.websocket);
	}, [props.websocket])

	return (
		<>
			<Box sx={{ maxWidth: 1552 }} className={classes.root}>
				<Stack direction="column" spacing={1}>
					<h2 style={{ 'margin': '4px', 'textAlign': 'left', 'paddingLeft': '8px' }} >{user.firstname} {user.lastname}{user.birth_date ? ", " + calculateAge(user.birth_date) : ''}</h2>
					<Box className={classes.FigureRoot} style={{ 'margin': '4px' }}>
						{editable ?
							<Tooltip title={user.location_mode ? "Automatic" : "Manual"}>
								<IconButton sx={{ 'padding': '2px 8px' }} aria-label="Activate/Desactive Automatic Location" color={user.location_mode ? "primary" : "inherit"} clickable="true" onClick={handleLocation}>
									<LocationOnIcon />
								</IconButton>
							</Tooltip>
							:
							<Box sx={{ 'padding': '2px 8px' }}>
								<LocationOnIcon />
							</Box>

						}
						{editable && !user.location_mode ?
							<Box display="flex" direction="row" sx={{ m: 0, p: 0, gap: '5px', width: '300px', alignItems: 'center' }}>
								<TextField
									disabled={editLoc}
									inputRef={textInput}
									id="filled-static"
									label="City"
									value={values.city === null ? '' : values.city}
									variant="filled"
									onChange={handleChange('city')}
								/>
								<TextField
									disabled={editLoc}
									id="filled-static"
									label="Country"
									value={values.country === null ? '' : values.country}
									variant="filled"
									onChange={handleChange('country')}
								/>
								<Button sx={{ width: '70px' }} variant="contained" onClick={handleEditLocation} >{editLoc ? 'EDIT' : 'OK'}</Button>
							</Box>
							:
							<Box>{estimateAddress(user.city, 'cityPlaceholder')}, {estimateAddress(user.country, 'countryPlaceholder')}</Box>
						}
					</Box>
				</Stack>
				{likeable ?
					<Stack>
						<LikeButton liking={user.liking} {...props} />
					</Stack>
					:
					<></>
				}
				<Stack sx={{ 'marginRight': '12px' }} direction="row" spacing={2} justifyContent='flex-start' alignItems="center">
					{editable ?
						<>
							<Tooltip title="Who liked you">
								<Chip icon={<FavoriteIcon />} color={"primary"} label={user.likes} clickable sx={{ fontSize: "20px" }} />
							</Tooltip>
							<Tooltip title="Who saw your profile">
								<Chip icon={<VisibilityIcon />} color="secondary" label={user.watches} clickable sx={{ fontSize: "20px" }} />
							</Tooltip>
						</>
						:
						<Box>
							<IconButton
								aria-label="send messages"
								color="inherit"
								aria-controls="send-message"
								aria-haspopup="true"
								aria-expanded={openChat ? 'true' : undefined}
								onClick={handleChatClick}
							>
								<Tooltip title="Send Message">
									<ChatIcon />
								</Tooltip>
							</IconButton>
							<Chat
								anchorel={anchorChatEl}
								open={openChat}
								receiverid={receiverId}
								handleclose={handleChatClose}
								websocket={websocket}
							/>
							<IconButton
								aria-label="options menu"
								sx={{ p: 0 }}
								color="inherit"
								aria-controls="options-menu"
								aria-haspopup="true"
								aria-expanded={openOptions ? 'true' : undefined}
								onClick={handleOptionsClick}
							>
								<Tooltip title="Options">
									<MoreVertIcon />
								</Tooltip>
							</IconButton>
							<Menu
								id="messages-menu"
								anchorEl={anchorOptionsEl}
								open={openOptions}
								onClose={handleOptionsClose}
								sx={{ width: '100%', maxWidth: 360 }}
							>
								<MenuItem onClick={handleClickOpenReport}>
									<ErrorOutlineIcon /> Report
								</MenuItem >
								<MenuItem selected={blocked} onClick={handleBlock}>
									<BlockIcon /> Block
								</MenuItem >
							</Menu>
							<Dialog open={openReport} onClose={handleCloseReport}>
								<DialogTitle>Report</DialogTitle>
								<DialogContent>
									<DialogContentText>
										To report this user, please enter the reason.
									</DialogContentText>
									<TextField
										autoFocus
										margin="dense"
										id="report"
										label="Reason"
										type="text"
										fullWidth
										variant="standard"
										value={values.report}
										onChange={handleChange('report')}
									/>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleCloseReport}>Cancel</Button>
									<Button onClick={handleSendReport}>Submit</Button>
								</DialogActions>
							</Dialog>
						</Box>
					}
				</Stack>
			</Box>
		</>
	);
}

export default Figures;
