import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box, Tooltip, IconButton, Button, TextField } from '@mui/material';
import { LocationOn as LocationOnIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
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

function Location({ user, editable, updateUser, ...props }) {

	const history = useHistory();
	const classes = useStyles();

	const [editLoc, setEditLoc] = React.useState(true);
	const [ipAdress, setIpAdress] = React.useState(0);
	const [errors, setErrors] = useState({});
	const [values, setValues] = useState({
		city: 'Unknown',
		country: 'Location',
	});
	let textInput = useRef(null);

	const handleLogout = () => {
		props.logout();
		history.push(`/`);
	}

	const regexMatch = function (value, regex) {
		if (typeof value === 'string' && value.match(regex))
			return true;
		return false;
	}

	const isAddress = function (value) {
		if (regexMatch(value, /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/))
			return true;
		return false;
	}

	const validateFields = (values) => {
		let errorsArr = { ...errors };
		let formIsValid = true;

		for (let field in values) {
			if ((field === 'city' && !isAddress(values[field])) ||
				(field === 'country' && !isAddress(values[field]))) {
				errorsArr[field] = "Incorrect entry.";
				formIsValid = false;
			}
			else
				delete errorsArr[field];
		}
		setErrors(errorsArr);
		return (formIsValid);
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
							else if (res.status === 401) {
								handleLogout();
							}
							else {
								console.log("Fail to update user location to server");
							}
						})
						.catch((error) => {
							console.log(error);
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
					else if (res.status === 401) {
						handleLogout();
					}
					else {
						console.log("Fail to update user location to server");
					}
				})
				.catch((error) => {
					console.log(error);
					console.log("Fail to update user location to server");
				})
		}
	}

	const handleChange = (prop) => (event) => {
		validateFields({ [event.target.name]: event.target.value });
		setValues({ ...values, [prop]: event.target.value });
	};

	useEffect(() => {
		if (!editLoc) {
			textInput.current.focus();
		}
	}, [editLoc])

	useEffect(() => {
		if (user.city && user.country)
			setValues({ city: user.city, country: user.country });
		else
			setValues({ city: 'Unknown', country: 'Location' });
	}, [user.city, user.country]);

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
						else if (res.status === 401) {
							handleLogout();
						}
						else {
							console.log("Fail to add location");
						}
					})
					.catch((error) => {
						console.log(error);
						console.log("Fail to add location");
					})
			}
		}
	};

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
			.catch((error) => {
				console.log(error);
				console.log("Fail to get client ip adress");
			})
		return () => {
			isCancelled = true;
		};
	}, [])

	return (
		<>
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
		</>
	)
}

export default Location;
