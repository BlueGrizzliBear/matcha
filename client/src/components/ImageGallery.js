import React from 'react';
import { useState, useEffect, useRef } from 'react';
import update from 'react-addons-update';

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
		img: selfy,
		title: 'ProfileImage',
		author: 'author',
		profile: true,
	},
	{
		img: selfy2,
		title: 'Image1',
		author: 'author',
	},
	{
		img: selfy3,
		title: 'Image2',
		author: 'author',
	},
	{
		img: selfy4,
		title: 'Image3',
		author: 'author',
	},
	{
		img: image1,
		title: 'Image4',
		author: 'author',
	},
]

function ImageGallery() {

	const classes = useStyles();

	// const [isLoading, setisLoading] = useState(true);
	const [imageArr, setImageArr] = useState(itemData);
	const inputFile = useRef(null);

	useEffect(() => {
		console.log("will fetch data later");
		// 	fetch('http://127.0.0.1:9000/user', {
		// 		method: 'GET',
		// 		headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		// 	})
		// 		.then((res) => res.json())
		// 		.then((data) => setImageArr([...data]))
		// 	// .then(setisLoading(false));
	}, []);

	const uploadImage = (tag, i, image) => {

		const formData = new FormData()
		formData.append('uploadedImage', image, image.name);

		fetch('http://localhost:9000/upload?img=' + tag, {
			method: 'POST',
			headers: {
				'Authorization': "Bearer " + localStorage.getItem("token"),
			},
			body: formData
		})
			.then(res => res.json())
			.then(res => {
				fetch('http://localhost:9000/' + res.image, {
					method: 'GET',
					headers: {
						'Authorization': "Bearer " + localStorage.getItem("token"),
					},
				})
					.then(function (response) {
						return (response.blob());
					})
					.then(img => {

						const myImage = document.querySelector('img');
						const objectURL = URL.createObjectURL(img);
						myImage.src = objectURL;

						console.log(res);
						console.log(res.body);
						setImageArr(update(imageArr, {
							[i]: {
								img: {
									$set: myImage.src
								}
							}
						}));
					})
			})
			.catch(res => {
				console.log("Fail to fetch");
				console.log(formData);
			})
	}

	const handleFileUpload = e => {
		const { files } = e.target;
		if (files && files.length) {
			const tag = "profile";
			uploadImage(tag, 0, files[0]);
		}
	};

	return (
		<Box className={classes.root} >
			<ImageList id="ImageList" className={classes.imageList} rowHeight={240} gap={16} cols={4} style={{ 'margin': '8px' }}>
				{imageArr.map((item, i) => (
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
						<img src={item.img} alt={item.title} style={{ 'objectFit': 'cover' }} />
						<input
							style={{ display: "none" }}
							// accept=".zip,.rar"
							ref={inputFile}
							onChange={handleFileUpload}
							type="file"
						/>
						<ImageListItemBar
							position="top"
							actionposition="right"
							style={{ background: 'rgba(0,0,0,0)' }}
							className={classes.titleBar}
							actionIcon={<OptionButton item={item} ref={inputFile} />}
						/>
					</ImageListItem>
				))}
			</ImageList>
		</Box>
	);
}

export default ImageGallery;
