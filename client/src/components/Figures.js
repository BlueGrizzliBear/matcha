import { useState, useEffect } from 'react';
import { Box, Chip, Stack, Tooltip, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import StandaloneToggleButton from './ToggleButton';
import LikeButton from './LikeButton';
import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, LocationOn as LocationOnIcon, Block as BlockIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

// import OptionButton from '../components/OptionButton'
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
	const [likeable, setLikeable] = useState(false);

	useEffect(() => {
		if (props.user.isAuth === true)
			setEditable(true);
		else
			setLikeable(true);
		setUser(props.user);

	}, [props.user]);

	const changeAddress = (locationMode, tag) => {
		if (locationMode === true)
			return (tag === 'city' ? 'Ecully' : 'France');
		return (tag === 'country' ? 'France' : 'Lyon');
	}

	const handleLocation = (e) => {
		fetch(process.env.REACT_APP_API_URL + 'user', {
			method: 'POST',
			headers: {
				'Authorization': "Bearer " + localStorage.getItem("token"),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				location_mode: !user.location_mode,
				city: changeAddress(!user.location_mode, 'city'),
				country: changeAddress(!user.location_modem, 'country')
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
			<Box sx={{ maxWidth: 1552 }} className={classes.root}>
				<Stack direction="column" spacing={1}>
					<h2 style={{ 'margin': '4px', 'textAlign': 'left', 'paddingLeft': '8px' }} >{user.firstname} {user.lastname}{user.birth_date ? ", " + calculateAge(user.birth_date) : ''}</h2>
					<Box className={classes.FigureRoot} style={{ 'margin': '4px' }}>
						{ editable ?
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
						<Box>{user.city}, {user.country}</Box>
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
					{ editable ?
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
						{/* <StandaloneToggleButton component={<FavoriteIcon sx={{ fontSize: '36px' }} />} /> */}
						<StandaloneToggleButton component={<MoreVertIcon />} firstColor='error' />
						<StandaloneToggleButton component={<BlockIcon />} firstColor='error' />
						<StandaloneToggleButton component={<ErrorOutlineIcon />} firstColor='warning' />

						{/* <Tooltip title="Click to Like Profile">
							<Chip icon={<FavoriteIcon />} color={"secondary"} variant="outlined" clickable sx={{ fontSize: "20px" }} />
						</Tooltip>
						<Tooltip title="Click to Like Profile">
							<Chip icon={<FavoriteIcon />} color={"primary"} variant="outlined" clickable sx={{ fontSize: "20px" }} />
						</Tooltip>
						<Tooltip title="Click to Like Profile">
							<Chip icon={<FavoriteIcon />} color={"secondary"} clickable sx={{ fontSize: "20px" }} />
						</Tooltip>
						<Tooltip title="Click to Like Profile">
							<Chip icon={<FavoriteIcon />} color={"primary"} clickable sx={{ fontSize: "20px" }} />
						</Tooltip>

						<Chip icon={<FavoriteIcon />} color={"secondary"} variant="outlined" clickable sx={{ fontSize: "20px" }} />
						<Chip icon={<BlockIcon />} color={"secondary"} clickable variant="outlined" sx={{ fontSize: "20px" }} />
						<Chip icon={<ErrorOutlineIcon />} color={"secondary"} variant="outlined" clickable sx={{ fontSize: "20px" }} /> */}
					</>
					}
				</Stack>
			</Box>
		</>
	);
}

export default Figures;
