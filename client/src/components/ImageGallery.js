import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';

import OptionButton from '../components/OptionButton'

import image1 from '../assets/images/no_img.svg';
// import selfy from '../assets/images/selfy_example.jpg';
// import selfy2 from '../assets/images/selfy2_example.jpg';
// import selfy3 from '../assets/images/selfy3_example.jpg';
// import selfy4 from '../assets/images/selfy4_example.jpg';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
	},
	imageList: {
		// justifyContent: "flex-start",
		// alignItems: "flex-start",
		// flexDirection: 'column',
		height: 480,
		// width: "100%",
		// Profile image is 640x480 and small images are 320x240
		// Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
		transform: 'translateZ(0)',
	},
}));

const itemData = [
	{
		id: 0,
		img: image1,
		title: 'img0',
		profile: true,
	},
	{
		id: 1,
		img: image1,
		title: 'img1',
	},
	{
		id: 2,
		img: image1,
		title: 'img2',
	},
	{
		id: 3,
		img: image1,
		title: 'img3',
	},
	{
		id: 4,
		img: image1,
		title: 'img4',
	},
]

function ImageGallery() {

	const classes = useStyles();

	// const [isLoading, setisLoading] = useState(true);
	const [imageArr, setImageArr] = useState(itemData);
	const inputFile = useRef(itemData.map(() => React.createRef()));

	const fetchImage = (path, tag) => {
		fetch(path, {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			// Error handling if not any success code
			.then(res => {
				if (!res.ok)
					throw new Error('Reques: did not receive success code between 200-299.');
				return res.blob();
			})
			.then(res => {
				let tempImgArr = itemData.slice();
				tempImgArr[itemData.findIndex(x => x.title === tag)]["img"] = URL.createObjectURL(res);
				setImageArr(tempImgArr);
			})
			// Error handling if not any success code
			.catch(error => {
				console.log(error);
				console.log("Fail to GET image from server");
			})
	}

	useEffect(() => {
		fetch('http://localhost:9000/user', {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => res.json())
			.then(data => {
				for (let tag in data.images) {
					if (data.images[tag]) {
						fetchImage('http://localhost:9000/upload/' + data.images[tag], tag);
					}
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to GET user from server");
			})
		// .then(setisLoading(false));
	}, []);

	const handleFileUpload = (e) => {
		const { files } = e.target;
		if (files && files.length) {
			const formData = new FormData()
			formData.append('uploadedImage', files[0], files[0].name);
			fetch('http://localhost:9000/upload?img=' + e.target.title, {
				method: 'POST',
				headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
				body: formData
			})
				.then(res => res.json())
				.then(res => {
					fetchImage('http://localhost:9000/upload/' + res.image, e.target.title);
				})
				.catch(error => {
					console.log(error);
					console.log("Fail to POST image to server");
				})
		}
	};

	return (
		<Box className={classes.root} >
			<ImageList id="ImageList" className={classes.imageList} rowHeight={240} gap={0} cols={4} style={{ 'margin': '0px 8px' }}>
				{imageArr.map((item, i) => (
					<ImageListItem
						key={i}
						cols={item.profile ? 2 : 1}
						rows={item.profile ? 2 : 1}
						style={{
							// padding: (item.profile ? '0px 8px' : '8px'),
							width: (item.profile ? '800px' : '400px'),
							minWidth: '100%',
							// maxWidth: '100%',
							// width: '100%',
							// maxWidth: (item.profile ? 400 : 200),
							justifyContent: 'center',
							// alignItems: 'center',
							overflow: 'hidden',

						}}
					>
						<img src={item.img} alt={item.title} style={{ 'objectFit': 'cover' }} />
						<input
							title={item.title}
							style={{ display: "none" }}
							// accept=".zip,.rar"
							ref={inputFile.current[i]}
							onChange={handleFileUpload}
							type="file"
						/>
						<ImageListItemBar
							position="top"
							actionposition="right"
							style={{ background: 'rgba(0,0,0,0)' }}
							className={classes.titleBar}
							actionIcon={<OptionButton item={item} ref={inputFile.current[i]} />}
						/>
					</ImageListItem>
				))}
			</ImageList>
		</Box>
	);
}

export default ImageGallery;
