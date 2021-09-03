// import { useState } from 'react';
import { Box } from '@material-ui/core';
// import { Visibility, VisibilityOff } from '@material-ui/icons';
// import InputForm, { PasswordInputForm } from '../components/InputForm';

// import { useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

import image1 from '../assets/images/no_img.svg';

const useStyles = makeStyles((theme) => ({
	root: {
	  display: 'flex',
	  flexWrap: 'wrap',
	  justifyContent: 'space-around',
	  overflow: 'hidden',
	//   backgroundColor: theme.palette.background.paper,
	},
	imageList: {
	  flexWrap: 'nowrap',
	  // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
	  transform: 'translateZ(0)',
	},
	title: {
	  color: theme.palette.primary.light,
	},
	titleBar: {
	  background:
		'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
	},
}));

const itemData = [
	{
		img: image1,
		title: 'ProfileImage',
		author: 'author',
		cols: 2,
	},
	{
		img: image1,
		title: 'Image',
		author: 'author',
		cols: 1,
	},
	{
		img: image1,
		title: 'Image',
		author: 'author',
		cols: 1,
	},
	{
		img: image1,
		title: 'Image',
		author: 'author',
		cols: 1,
	},
	{
		img: image1,
		title: 'Image',
		author: 'author',
		cols: 1,
	},
];

function Profile() {

	const classes = useStyles();

	// const history = useHistory();

	// const [values, setValues] = useState({
	// 	imageList: '',
	// });

	// const gatherData = () => {
	// 	fetch('http://localhost:9000/:id/images', {
	// 		method: 'GET',
	// 		body: JSON.stringify({ values }),
	// 		headers: { 'Content-Type': 'application/json' },
	// 	})
	// 		.then(res => res.json())
	// 		.then(json => json.values)
		
	// }

	// const handleChange = (prop) => (event) => {
	// 	setValues({ ...values, [prop]: event.target.value });
	// };
	
	return (
		<Box className={classes.root}>
			<ImageList className={classes.imageList} cols={2.5}>
				{itemData.map((item, i) => (
					<ImageListItem key={i}>
						<img src={item.img} alt={item.title} />
						<ImageListItemBar
							title={item.title}
							classes={{
							root: classes.titleBar,
							title: classes.title,
							}}
							// actionIcon={
							// <IconButton aria-label={`star ${item.title}`}>
							// 	<StarBorderIcon className={classes.title} />
							// </IconButton>
							// }
						/>
					</ImageListItem>
				))}
			</ImageList>
		</Box>
	);
}

export default Profile;
