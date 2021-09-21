import { Box, Badge } from '@mui/material';

import { makeStyles } from '@mui/styles';

import { Visibility as VisibilityIcon, Favorite as FavoriteIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
	},
	Profileroot: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		overflow: 'hidden',
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
		justifyContent: 'space-around',
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

function Figures() {

	const classes = useStyles();

	return (
		<>
			<Box className={classes.root}>
				<Box id="Profile" sx={{ width: '100%', maxWidth: 1552 }} className={classes.Profileroot} style={{ 'margin': '8px 8px 0px' }}>
					<Box className={classes.LeftRoot} style={{ 'margin': '0px 8px' }}>
						<Box className={classes.UpperRoot}>
							<h2 style={{ 'margin': '4px' }} >Firstname Lastname, age</h2>
						</Box>
						<Box className={classes.FigureRoot} style={{ 'margin': '4px' }}>
							<LocationOnIcon />
							<Box style={{ 'marginLeft': '8px' }}>Location</Box>
						</Box>
					</Box>

					<Box className={classes.RightRoot} style={{ 'margin': '0px 8px' }}>
						<Box className={classes.FigureRoot} style={{ 'margin': '8px' }}>
							<Badge badgeContent={3} color="primary">
								<FavoriteIcon />
							</Badge>
							<Box style={{ 'marginLeft': '8px' }}>4</Box>
						</Box>
						<Box className={classes.FigureRoot} style={{ 'margin': '8px' }}>
							<VisibilityIcon />
							<Box style={{ 'marginLeft': '8px' }}>15</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
}

export default Figures;
