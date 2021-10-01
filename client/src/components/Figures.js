import { Box, Chip, Stack, Tooltip } from '@mui/material';

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
		}
	},
	LeftRoot: {
		display: 'inline',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
	},
	RightRoot: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignItems: 'center',
		overflow: 'hidden',
	},
	UpperRoot: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
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

	const locationMode = 'Manual';
	const locationAdress = 'Lyon, France';

	return (
		<Box sx={{ maxWidth: 1552 }} className={classes.root}>
			<Stack direction="column" spacing={1}>
				<h2 style={{ 'margin': '4px' }} >{props.firstname} {props.lastname}{props.birth_date ? ", " + calculateAge(props.birth_date) : ''}</h2>
				<Box className={classes.FigureRoot} style={{ 'margin': '4px' }}>
					<Tooltip title={locationMode}>
						<LocationOnIcon />
					</Tooltip>
					<Box style={{ 'marginLeft': '8px' }}>{locationAdress}</Box>
				</Box>
			</Stack>

			<Stack direction="row" spacing={2} justifyContent='flex-start' alignItems="center">
				<Tooltip title="Who liked you">
					<Chip icon={<FavoriteIcon />} color="primary" label={props.likes} clickable sx={{fontSize: "20px"}}/>
				</Tooltip>
				<Tooltip title="Who saw your profile">
					<Chip icon={<VisibilityIcon />} color="secondary" label={props.watches} clickable sx={{fontSize: "20px"}}/>
				</Tooltip>
			</Stack>
		</Box>
	);
}

export default Figures;
