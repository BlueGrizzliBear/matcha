import { useState, useEffect } from 'react';
import { Box, Chip, Stack, Tooltip, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';

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

function Figures(props) {

	const classes = useStyles();

	const [user, setUser] = useState(props.user);
	const [editable, setEditable] = useState(false);

	useEffect(() => {
		if (props.user.isAuth === true)
			setEditable(true);
		setUser(props.user);
	}, [props.user]);

	const changeAdress = (locationMode) => {
		if (locationMode === true)
			return ("Ecully, France");
		return ("Lyon 7eme, France");
	}

	const handleLocation = (e) => {
		console.log(typeof user.location_mode);
		console.log(user.location_mode);
		console.log(!user.location_mode);

		fetch('http://localhost:9000/user', {
			method: 'POST',
			headers: {
				'Authorization': "Bearer " + localStorage.getItem("token"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				location_mode: !user.location_mode,
				address: changeAdress(!user.location_mode)
			})
		})
			.then(res => {
				if (res.ok) {
					return res.json().then((data) => {
						setUser(data);
						props.setValue('user', data)
					})
				}
			})
			.catch(() => {
				console.log("Fail to register user to server");
			})
	}

	return (
		<>
			<p>Profile is {editable ? 'editable' : 'not editable'}</p>
			<Box sx={{ maxWidth: 1552 }} className={classes.root}>
				<Stack direction="column" spacing={1}>
					<h2 style={{ 'margin': '4px', 'textAlign': 'left', 'paddingLeft': '8px' }} >{user.firstname} {user.lastname}{user.birth_date ? ", " + calculateAge(user.birth_date) : ''}</h2>
					<Box className={classes.FigureRoot} style={{ 'margin': '4px' }}>
						<Tooltip title={user.location_mode ? "Automatic" : "Manual"}>
							<IconButton sx={{ 'padding': '2px 8px' }} aria-label="Activate/Desactive Automatic Location" color={user.location_mode ? "primary" : "inherit"} clickable="true" onClick={handleLocation}>
								<LocationOnIcon />
							</IconButton>
						</Tooltip>
						<Box>{user.address}</Box>
					</Box>
				</Stack>
				<Stack direction="row" spacing={2} justifyContent='flex-start' alignItems="center">
					<Tooltip title="Who liked you">
						<Chip icon={<FavoriteIcon />} color="primary" label={user.likes} clickable sx={{ fontSize: "20px" }} />
					</Tooltip>
					<Tooltip title="Who saw your profile">
						<Chip icon={<VisibilityIcon />} color="secondary" label={user.watches} clickable sx={{ fontSize: "20px" }} />
					</Tooltip>
				</Stack>
			</Box>
		</>
	);
}

export default Figures;
