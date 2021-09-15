import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';

import OptionButton from '../components/OptionButton'

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
			.then(res => res.blob())
			.then(res => {

				const myImage = document.querySelector('img');
				myImage.src = URL.createObjectURL(res);

				let imageIndex = itemData.slice().findIndex(x => x.title === tag);

				if (imageIndex !== -1) {
					let tempImgArr = itemData.slice();
					tempImgArr[imageIndex]["img"] = myImage.src;
					setImageArr(tempImgArr);
					// console.log(tempImgArr);
				}
				else {
					console.log('Did not find a match for this image');
				}

			})
			.catch(function () {
				console.log("Fail to display image from server (GET)");
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
		// .then(setisLoading(false));
	}, []);

	const uploadImage = (tag, image) => {

		const formData = new FormData()
		formData.append('uploadedImage', image, image.name);

		fetch('http://localhost:9000/upload?img=' + tag, {
			method: 'POST',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
			body: formData
		})
			.then(res => res.json())
			.then(res => {
				fetchImage('http://localhost:9000/upload/' + res.image, tag);
			})
			.catch(function () {
				console.log("Fail to fetch image from server (GET)");
			})
	}

	const handleFileUpload = (e) => {
		const { files } = e.target;
		if (files && files.length) {
			uploadImage(e.target.title, files[0]);
		}
	};

	return (
		<Box className={classes.root} >
			<ImageList id="ImageList" className={classes.imageList} rowHeight={240} gap={16} cols={4} style={{ 'margin': '8px' }}>
				{imageArr.map((item, i) => (
					<ImageListItem
						key={i}
						cols={item.profile ? 2 : 1}
						rows={item.profile ? 2 : 1}
						style={{
							'padding': (item.profile ? '0px 8px' : '8px'),
							width: (item.profile ? '800px' : '400px'),
							minWidth: '250px',
							maxWidth: '100%'
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
