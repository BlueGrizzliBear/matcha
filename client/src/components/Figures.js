import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
	root: {
		// display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
  },
}));

function Figures() {

	const classes = useStyles();

  return (
		<>
			<Box className={classes.root}>
				<Box className={classes.root}>
					<h2>Firstname Lastname, age</h2>
				</Box>
				<Box className={classes.root}>
					<LocationOnIcon />
					<p>Location</p>
				</Box>
			</Box>
			<Box className={classes.root}>
				<Box className={classes.root}>
					<FavoriteIcon />
					<p>4</p>
				</Box>
				<Box className={classes.root}>
					<VisibilityIcon />
					<p>15</p>
				</Box>
			</Box>
		</>
  );
}

export default Figures;
