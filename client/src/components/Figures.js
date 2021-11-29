
import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Typography, Box, Chip, Stack, Tooltip, IconButton, Button, TextField, Menu, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LikeButton from './LikeButton';
import { MoreVert as MoreVertIcon, Chat as ChatIcon, Visibility as VisibilityIcon, Favorite as FavoriteIcon, LocationOn as LocationOnIcon, Block as BlockIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import calculateAge from '../utility/utilities'
import Chat from './Chat'
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useHistory } from "react-router-dom";

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
	const [editName, setEditName] = React.useState(true);
	const [ipAdress, setIpAdress] = React.useState(0);
	const [values, setValues] = useState({
		city: 'Unknown',
		country: 'Location',
		report: '',
		email: '',
		firstname: 'Unknown',
		lastname: 'Name',
	});
	const [birthdate, setBirthdate] = React.useState(new Date());
	const [anchorChatEl, setAnchorChatEl] = useState(null);
	const [anchorOptionsEl, setAnchorOptionsEl] = useState(null);
	const openChat = Boolean(anchorChatEl);
	const openOptions = Boolean(anchorOptionsEl);
	const [receiverId, setReceiverId] = useState(null);
	// const [websocket, setWebsocket] = useState(null);
	const [blocked, setBlocked] = useState(false);
	const [openReport, setOpenReport] = React.useState(false);
	const [openEmailEdit, setOpenEmailEdit] = React.useState(false);
	const [isOnline, setIsOnline] = useState({ id: null, online: false });
	const [mutualLike, setMutualLike] = useState(false);
	const [liking, setLiking] = useState(false);
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(0);
	const [watches, setWatches] = useState(0);
	const history = useHistory();
	const [errors, setErrors] = useState({});

	let textInput = useRef(null);
	let textInputName = useRef(null);

	const handleLogout = () => {
		props.logout();
		history.push(`/`);
	}

	const regexMatch = function (value, regex) {
		if (typeof value === 'string' && value.match(regex))
			return true;
		return false;
	}

	const isEmail = function (value) {
		if (value === '')
			return true
		// eslint-disable-next-line
		if (regexMatch(value, /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i))
			return true;
		return false;
	}


	const isAddress = function (value) {
		if (regexMatch(value, /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/))
			return true;
		return false;
	}

	const isAlpha = function (value) {
		if (regexMatch(value, /^[a-zA-Z]+$/))
			return true;
		return false;
	}

	const validateFields = (values) => {
		let errorsArr = { ...errors };
		let formIsValid = true;

		for (let field in values) {
			if ((field === 'email' && !isEmail(values[field])) ||
				(field === 'city' && !isAddress(values[field])) ||
				(field === 'country' && !isAddress(values[field])) ||
				(field === 'lastname' && !isAlpha(values[field])) ||
				(field === 'firstname' && !isAlpha(values[field]))) {
				errorsArr[field] = "Incorrect entry.";
				formIsValid = false;
			}
			else
				delete errorsArr[field];
		}
		setErrors(errorsArr);
		return (formIsValid);
	}

	const handleEditLocation = () => {
		if (validateFields(values)) {

			if (editLoc) {
				setEditLoc(false);
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
							console.log("Fail to add location");
						}
					})
					.catch(() => {
						console.log("Fail to add location");
					})
			}
		}
	};

	const handleOpenEmailEdit = () => {
		setOpenEmailEdit(true);
	}

	const handleCloseEmailEdit = () => {
		let newValues = { city: values.city, country: values.country, firstname: values.firstname, lastname: values.lastname, report: values.report, email: '' };

		setValues(newValues);
		setOpenEmailEdit(false);
	};

	const handleEditName = () => {
		if (validateFields(values)) {
			if (editName) {
				setEditName(false);
			}
			else {
				fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
					method: 'POST',
					headers: {
						'Authorization': "Bearer " + localStorage.getItem("token"),
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						firstname: values.firstname,
						lastname: values.lastname,
						birth_date: birthdate.toJSON().split('T')[0]
					})
				})
					.then(res => {
						if (res.ok) {
							return res.json().then((data) => {
								updateUser(data);
								setEditName(true);
							})
						}
						else {
							console.log("Fail to change name or birthdate");
						}
					})
					.catch(() => {
						console.log("Fail to change name or birthdate");
					})
			}
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
		validateFields({ [event.target.name]: event.target.value });
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

	const handleSendEmailEdit = () => {
		if (validateFields(values)) {

			fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
				method: 'POST',
				headers: {
					'Authorization': "Bearer " + localStorage.getItem("token"),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: values.email,
				})
			})
				.then(res => {
					if (res.ok) {
						setOpenEmailEdit(false);
						handleLogout();
					}
					else if (res.status === 409) {
						let errorsArr = { ...errors };
						errorsArr['email'] = "Email already exists on another account.";
						setErrors(errorsArr);
					}
					else {
						console.log("Fail to change Email");
					}
				})
				.catch((error) => {
					console.log(error);
				})
		}
	};

	useEffect(() => {
		if (user.city && user.country)
			setValues({ city: user.city, country: user.country, firstname: user.firstname, lastname: user.lastname, report: '', email: '' });
		else
			setValues({ city: 'Unknown', country: 'Location', firstname: user.firstname, lastname: user.lastname, report: '', email: '' });
	}, [user.city, user.country, user.firstname, user.lastname, user.lastConnection]);

	useEffect(() => {
		if (user.liking)
			setLiking(user.liking);
	}, [user.liking]);

	useEffect(() => {
		if (user.liked)
			setLiked(user.liked);
	}, [user.liked]);

	useEffect(() => {
		if (liking && liked)
			setMutualLike(true);
		else
			setMutualLike(false);
	}, [liking, liked]);

	useEffect(() => {
		if (user.watches)
			setWatches(user.watches);
	}, [user.watches]);

	useEffect(() => {
		if (user.likes)
			setLikes(user.likes);
	}, [user.likes]);

	useEffect(() => {
		if (user.birth_date)
			setBirthdate(new Date(user.birth_date));
	}, [user.birth_date]);

	useEffect(() => {
		setBlocked(user.blocked);
	}, [user.blocked]);

	useEffect(() => {
		if (!editLoc) {
			textInput.current.focus();
		}
	}, [editLoc])

	useEffect(() => {
		if (!editName) {
			textInputName.current.focus();
		}
	}, [editName])

	useEffect(() => {
		let isCancelled = false;
		fetch("http://api6.ipify.org/?format=json", {
			method: 'GET',
		})
			.then(res => {
				if (res.ok) {
					return res.json().then((data) => {
						if (!isCancelled)
							setIpAdress(data.ip);
					})
				}
			})
			.catch(() => {
				console.log("Fail to get client ip adress");
			})
		return () => {
			isCancelled = true;
		};
	}, [])

	const listenMessages = useCallback((msg, isCancelled) => {
		msg = JSON.parse(msg.data);
		if (!isCancelled && msg && msg.type === "Online" && msg.user) {
			setIsOnline(msg);
		}
		if (!isCancelled && msg && msg.type === "Like") {
			setLikes(prevLikes => prevLikes + 1);
		}

		if (!isCancelled && msg && msg.type === "Like" && msg.from === user.id) {
			setLiked(true);
		}
		if (!isCancelled && msg && msg.type === "Unlike" && msg.from === user.id) {
			setLiked(false);
		}
		if (!isCancelled && msg && msg.type === "Unlike") {
			setLikes(prevLikes => prevLikes - 1);
		}
		if (!isCancelled && msg && msg.type === "Watches") {
			setWatches(prevWatches => prevWatches + 1);
		}
	}, [user.id])

	useEffect(() => {
		let isCancelled = false;
		if (props.websocket != null) {
			props.websocket.addEventListener('message', (event) => {
				listenMessages(event, isCancelled)
			});
		}
		if (user.id && props.websocket != null)
			props.websocket.send(JSON.stringify({ isUserOnline: user.id }))
		return () => {
			isCancelled = true;
		};
	}, [props.websocket, listenMessages, user.id]);

	return (
		<>
			<Box sx={{ maxWidth: 1552 }} className={classes.root}>
				<Stack direction="column" spacing={1}>
					{editable ?
						<Box display="flex" flexWrap='wrap' sx={{ m: 0, p: 0, gap: '5px', width: '100%', alignItems: 'center' }}>
							<TextField
								error={'firstname' in errors}
								helperText={'firstname' in errors && errors['firstname']}
								disabled={editName}
								inputRef={textInputName}
								id="filled-static"
								label="Firstname"
								value={values.firstname === null ? '' : values.firstname}
								variant="filled"
								onChange={handleChange('firstname')}
							/>
							<TextField
								disabled={editName}
								error={'lastname' in errors}
								helperText={'lastname' in errors && errors['lastname']}
								id="filled-static"
								label="Lastname"
								value={values.lastname === null ? '' : values.lastname}
								variant="filled"
								onChange={handleChange('lastname')}
							/>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker

									disableFuture
									disabled={editName}
									label="Birth Date"
									openTo="year"
									views={['year', 'day']} //can't put month for now, DatePicker is still in development mod
									value={birthdate}
									onChange={(newValue) => {
										setBirthdate(newValue);
									}}
									renderInput={(params) => <TextField variant="filled" sx={{ width: '140px' }} {...params} helperText={null} />}
								/>
							</LocalizationProvider>
							<Button sx={{ width: '70px' }} variant="contained" onClick={handleEditName} >{editName ? 'EDIT' : 'OK'}</Button>
							<Button sx={{ width: '120px' }} variant="contained" onClick={handleOpenEmailEdit} >edit email</Button>
							<Dialog open={openEmailEdit} onClose={handleCloseEmailEdit}>
								<DialogTitle>Change Email address</DialogTitle>
								<DialogContent>
									<DialogContentText>
										Your current email is {user.email ? user.email : 'Unknown'}. You're about to change your Email adress, this action will disconnect you from your account. Please check your mails to validate your new Email address.
									</DialogContentText>
									<TextField
										error={'email' in errors}
										helperText={'email' in errors && errors['email']}
										autoFocus
										margin="dense"
										id="email-standard"
										label="New Email"
										type="email"
										fullWidth
										variant="standard"
										value={values.email === null ? '' : values.email}
										onChange={handleChange('email')}
									/>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleCloseEmailEdit}>Cancel</Button>
									<Button onClick={handleSendEmailEdit}>Change Email</Button>
								</DialogActions>
							</Dialog>
						</Box>
						:
						<Box display="flex" direction="row" sx={{ m: 0, p: 0, gap: '5px', alignItems: 'end' }}>
							<h2
								style={{
									margin: '4px',
									textAlign: 'left',
									paddingLeft: '8px'
								}}
							>
								{user.firstname} {user.lastname}{user.birth_date ? ", " + calculateAge(user.birth_date) : ''}
							</h2>
							<Typography sx={{ m: '4px', p: '0 0 0 8px', fontSize: '12px' }}>
								{' Last activity: ' + (isOnline.online ? 'Just now' : (user.lastConnection ? (new Date(user.lastConnection)).toLocaleString() : 'Never'))}
							</Typography>
						</Box>
					}
					<Box className={classes.FigureRoot} style={{ 'margin': '4px' }}>
						{editable ?
							<Tooltip title={user.location_mode ? "Automatic" : "Manual"}>
								<IconButton
									sx={{ padding: '2px 8px' }}
									aria-label="Activate/Desactive Automatic Location"
									color={user.location_mode ? "primary" : "inherit"}
									clickable="true"
									onClick={handleLocation}
								>
									<LocationOnIcon />
								</IconButton>
							</Tooltip>
							:
							<Box sx={{ 'padding': '2px 8px' }}>
								<LocationOnIcon />
							</Box>

						}
						{editable && !user.location_mode ?
							<Box display="flex" direction="row" flexWrap='wrap' sx={{ m: 0, p: 0, gap: '5px', width: '90%', alignItems: 'center' }}>
								<TextField
									sx={{ width: '150px' }}
									error={'city' in errors}
									helperText={'city' in errors && errors['city']}
									disabled={editLoc}
									inputRef={textInput}
									id="filled-static"
									label="City"
									value={values.city === null ? '' : values.city}
									variant="filled"
									onChange={handleChange('city')}
								/>
								<TextField
									sx={{ width: '150px' }}
									error={'country' in errors}
									helperText={'country' in errors && errors['country']}
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
							<Box>{user.city ? user.city : 'Unknown'}, {user.country ? user.country : 'Location'}</Box>
						}
					</Box>
				</Stack>
				{likeable ?
					<Stack>
						<LikeButton liking={user.liking} setliking={setLiking} {...props} />
					</Stack>
					:
					<></>
				}
				<Stack sx={{ 'marginRight': '12px' }} direction="row" spacing={2} justifyContent='flex-start' alignItems="center">
					{editable ?
						<>
							<Tooltip title="Who liked you">
								<Chip icon={<FavoriteIcon />} color={"primary"} label={likes} clickable sx={{ fontSize: "20px" }} />
							</Tooltip>
							<Tooltip title="Who saw your profile">
								<Chip icon={<VisibilityIcon />} color="secondary" label={watches} clickable sx={{ fontSize: "20px" }} />
							</Tooltip>
						</>
						:
						<Box display='flex' direction="row">
							{mutualLike ?
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
										websocket={props.websocket}
									/>
								</Box>
								:
								<>
								</>
							}
							<IconButton
								aria-label="options menu"
								sx={{ p: 1 }}
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
