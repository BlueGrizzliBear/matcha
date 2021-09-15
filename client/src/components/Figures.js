import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		// margin: 'auto'
	},
	Profileroot: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		overflow: 'hidden',
		// margin: 'auto'
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
				<Box id="Profile" className={classes.Profileroot} style={{ 'margin': '8px' }}>
					<Box className={classes.LeftRoot} style={{ 'margin': '8px' }}>
						<Box className={classes.UpperRoot}>
							<h2 style={{ 'margin': '8px' }} >Firstname Lastname, age</h2>
						</Box>
						<Box className={classes.FigureRoot} style={{ 'margin': '8px' }}>
							<LocationOnIcon />
							<Box style={{ 'marginLeft': '8px' }}>Location</Box>
						</Box>
					</Box>

					<Box className={classes.RightRoot} style={{ 'margin': '8px' }}>
						<Box className={classes.FigureRoot} style={{ 'margin': '8px' }}>
							<FavoriteIcon />
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
