import * as React from 'react';
import Button from '@mui/material/Button';
// import { makeStyles } from '@mui/styles';

import { Link } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		backgroundColor: theme.palette.primary.main,
// 	// display: 'flex',
// 	  // flexWrap: 'wrap',
// 	  // justifyContent: 'space-around',
// 	  // overflow: 'hidden',
// 	},
//   }));  

function PublicHomepage() {

	// const classes = useStyles();

	return (
		<>
			<h1 id="catchphrase">For people searching for love</h1>
			<Button	variant="contained" color="primary" component={Link} to="/register">
				Create account
			</Button>
		</>
	);
}

export default PublicHomepage;

