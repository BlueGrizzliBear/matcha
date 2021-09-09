import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import image1 from '../assets/images/no_img.svg';
import selfy from '../assets/images/selfy_example.jpg';
import selfy2 from '../assets/images/selfy2_example.jpg';
import selfy3 from '../assets/images/selfy3_example.jpg';
import selfy4 from '../assets/images/selfy4_example.jpg';

import jeff1 from '../assets/images/jeff_1.jpg';
import jeff2 from '../assets/images/jeff_2.jpg';
import jeff3 from '../assets/images/jeff_3.jpg';
import jeff4 from '../assets/images/jeff_4.jpg';
import jeff5 from '../assets/images/jeff_5.jpg';

const options = ['Edit', 'Delete'];

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

const jeffData = [
	{
		img: jeff1,
		title: 'ProfileImage',
		author: 'author',
		profile: true,
	},
	{
		img: jeff2,
		title: 'Image1',
		author: 'author',
	},
	{
		img: jeff3,
		title: 'Image2',
		author: 'author',
	},
	{
		img: jeff4,
		title: 'Image3',
		author: 'author',
	},
	{
		img: jeff5,
		title: 'Image4',
		author: 'author',
	},
];

// const itemData = [
// 	{
// 		img: selfy,
// 		title: 'ProfileImage',
// 		author: 'author',
// 		profile: true,
// 	},
// 	{
// 		img: selfy2,
// 		title: 'Image',
// 		author: 'author',
// 	},
// 	{
// 		img: selfy3,
// 		title: 'Image',
// 		author: 'author',
// 	},
// 	{
// 		img: selfy4,
// 		title: 'Image',
// 		author: 'author',
// 	},
// 	{
// 		img: image1,
// 		title: 'Image',
// 		author: 'author',
// 	},
// ];

function ImageGallery() {

	const classes = useStyles();

	const [open, setOpen] = React.useState(false);
	const [anchorRef, setAnchorRef] = React.useState(null);
	const [selectedIndex, setSelectedIndex] = React.useState(1);

	const handleClick = () => {
		console.info(`You clicked ${options[selectedIndex]}`);
	};

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		setOpen(false);
	};

	const handleToggle = (event) => {
		setAnchorRef(event.currentTarget);
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	return (
		<Box className={classes.root}>
			<ImageList id="ImageList" className={classes.imageList} rowHeight={240} gap={16} cols={4} style={{ 'margin': '8px' }}>
				{/* {itemData.map((item) => ( */}
				{jeffData.map((item) => (
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
						<ImageListItemBar
							position="top"
							actionPosition="right"
							style={{ background: 'rgba(0,0,0,0)' }}
							className={classes.titleBar}
							actionIcon={
								<>
									<IconButton
										aria-controls={open ? 'split-button-menu' : undefined}
										aria-expanded={open ? 'true' : undefined}
										onClick={handleToggle}
										aria-label={`edit ${item.title}`}
										position="top"
										actionPosition="right"
										style={{ background: 'rgba(229,230,235,0.1)', padding: '5px', margin: 'auto 7px' }}
									>
										<MoreVertIcon style={{ color: 'rgba(5,5,5,1)', top: '0' }} />
									</IconButton>
									<Popper
										open={open}
										anchorEl={anchorRef}
										role={undefined}
										placement={'bottom-end'}
										transition
										disablePortal={false}
										modifiers={{
											flip: {
												enabled: false
											},
											preventOverflow: {
												enabled: true,
												boundariesElement: 'scrollParent'
											}
										}}
									>
										{({ TransitionProps, placement }) => (
											<Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'center top' : 'center bottom' }}>
												<Paper>
													<ClickAwayListener onClickAway={handleClose}>
														<MenuList id="split-button-menu">
															{options.map((option, index) => (
																<MenuItem key={option} onClick={(event) => handleMenuItemClick(event, index)}>
																	{option}
																</MenuItem>
															))}
														</MenuList>
													</ClickAwayListener>
												</Paper>
											</Grow>
										)}
									</Popper>
								</>
							}
						/>
					</ImageListItem>
				))}
			</ImageList>
		</Box>
	);
}

/* <ImageListItemBar
				title={item.title}
				position="top"
				actionIcon={
					<IconButton aria-label={`edit ${item.title}`} style={{ color: 'white', top: '0' }}>
						<EditIcon />
					</IconButton>
				}
				actionPosition="right"
				className={classes.titleBar}
			/> */

export default ImageGallery;
