import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ImageList, ImageListItem } from '@material-ui/core';

import image1 from '../assets/images/no_img.svg';
import selfy from '../assets/images/selfy_example.jpg';
import selfy2 from '../assets/images/selfy2_example.jpg';
import selfy3 from '../assets/images/selfy3_example.jpg';
import selfy4 from '../assets/images/selfy4_example.jpg';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
	},
	imageList: {
		justifyContent: "center",
		alignItems: "flex-start",
		flexDirection: 'column',
		height: 530,
		// Profile image is 640x480 and small images are 320x240
		// Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
		transform: 'translateZ(0)',
	},
}));

const itemData = [
	{
		img: selfy,
		title: 'ProfileImage',
		author: 'author',
		profile: true,
	},
	{
		img: selfy2,
		title: 'Image',
		author: 'author',
	},
	{
		img: selfy3,
		title: 'Image',
		author: 'author',
	},
	{
		img: selfy4,
		title: 'Image',
		author: 'author',
	},
	{
		img: image1,
		title: 'Image',
		author: 'author',
	},
];

function ImageGallery() {

	const classes = useStyles();

	return (
		<Box className={classes.root}>
			<ImageList id="ImageList" className={classes.imageList} rowHeight={240} gap={16} cols={4} style={{ 'margin': '8px' }}>
				{itemData.map((item) => (
					<ImageListItem
						key={item.img}
						cols={item.profile ? 2 : 1}
						rows={item.profile ? 2 : 1}
						style={{
							'padding': (item.profile ? '0px 8px' : '8px'),
							width: (item.profile ? '800px' : '400px'),
							minWidth: '250px',
							maxWidth: '100%'
						}}
					>
						<img src={item.img} alt={item.title} style={{ 'object-fit': 'cover' }} />
					</ImageListItem>
				))}
			</ImageList>
		</Box>
	);
}

export default ImageGallery;
