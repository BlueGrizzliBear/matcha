
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box, Chip, Stack, Tooltip, IconButton, Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import StandaloneToggleButton from './ToggleButton';
import LikeButton from './LikeButton';
import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, LocationOn as LocationOnIcon, Block as BlockIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

// import OptionButton from '../components/OptionButton'
// import MoreVertIcon from '@mui/icons-material/MoreVert';

import calculateAge from '../utility/utilities'

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
	let textInput = useRef(null);
	const [values, setValues] = useState({
		city: '',
		country: ''
	});

	// const changeAddress = (locationMode, tag) => {
	// 	if (locationMode === true) {
	// 		if ("geolocation" in navigator) {
	// 			console.log("Geolocation is Available on navigator");
	// 			navigator.geolocation.getCurrentPosition(function (position) {
	// 				console.log("Latitude is :", position.coords.latitude);
	// 				console.log("Longitude is :", position.coords.longitude);
	// 				return (tag === 'city' ? 'Ecully' : 'France');
	// 			});
	// 		} else {
	// 			console.log("Geolocation is Not Available on navigator");
	// 		}
	// 	}
	// 	return (tag === 'country' ? 'France' : 'Lyon');
	// }

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

	const handleLocation = (e) => {
		if (!user.location_mode) {
			if ("geolocation" in navigator) {
				console.log("Geolocation is Available on navigator");
				navigator.geolocation.getCurrentPosition(function (position) {
					console.log("Latitude is :", position.coords.latitude);
					console.log("Longitude is :", position.coords.longitude);
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

	useEffect(() => {
		setValues({ city: user.city, country: user.country });
	}, [user.city, user.country]);

	useEffect(() => {
		if (!editLoc) {
			textInput.current.focus();
		}
	}, [editLoc])

	useEffect(() => {
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
	}, [])


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
									value={values.city}
									variant="filled"
									onChange={handleChange('city')}
								/>
								<TextField
									disabled={editLoc}
									id="filled-static"
									label="Country"
									value={values.country}
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
						<>
							<StandaloneToggleButton component={<ErrorOutlineIcon />} firstColor='warning' />
							<StandaloneToggleButton component={<BlockIcon />} firstColor='error' />
						</>
					}
				</Stack>
			</Box>
		</>
	);
}

export default Figures;
