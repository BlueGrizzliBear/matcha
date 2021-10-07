import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';

import OptionButton from '../components/OptionButton'

import placeholder from '../assets/images/no_img.svg';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		'@media screen and (min-width: 804px)': {
			margin: '0px 18px',
		}
	},
}));

const itemData = [
	{
		id: 0,
		img: placeholder,
		title: 'img0',
		profile: true,
	},
	{
		id: 1,
		img: placeholder,
		title: 'img1',
	},
	{
		id: 2,
		img: placeholder,
		title: 'img2',
	},
	{
		id: 3,
		img: placeholder,
		title: 'img3',
	},
	{
		id: 4,
		img: placeholder,
		title: 'img4',
	},
]

function ImageGallery(props) {

	const classes = useStyles();
	const [imageArr, setImageArr] = useState(itemData);
	const inputFile = useRef(itemData.map(() => React.createRef()));

	const fetchImage = (path, tag, link, mounted) => {
		fetch(path, {
			method: 'GET',
			headers: (link ? {} : { 'Authorization': "Bearer " + localStorage.getItem("token") }),
		})
			// Error handling if not any success code
			.then(res => {
				if (!res.ok)
					throw new Error('Request: did not receive success code between 200-299.');
				return res.blob();
			})
			.then(res => {
				if (mounted) {
					let tempImgArr = itemData.slice();
					tempImgArr[itemData.findIndex(x => x.title === tag)]['img'] = URL.createObjectURL(res);
					setImageArr(tempImgArr);
				}
			})
			// Error handling if not any success code
			.catch(error => {
				console.log(error);
				console.log("Fail to GET image from server");
			})
	}

	useEffect(() => {
		let mounted = true;
		fetch('http://localhost:9000/user/' + (props.path === '/profile' ? '' : props.user.username), {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => res.json())
			.then(data => {
				for (let tag in data.images) {
					if (data.images[tag]) {
						fetchImage(data.images[tag], tag, false, mounted);
					}
					else {
						if (mounted) {
							let tempImgArr = itemData.slice();
							tempImgArr[itemData.findIndex(x => x.title === tag)]['img'] = placeholder;
							setImageArr(tempImgArr);
						}
					}
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to GET user from server");
			})
		// .then(setisLoading(false));

		// Anything in here is fired on component unmount.
		return () => {
			mounted = false;
        }
	}, [props.path, props.user]);

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
					props.setValue('isProfileComplete', res.isProfileComplete);
					fetchImage('http://localhost:9000/upload/' + res.image, e.target.title);
				})
				.catch(error => {
					console.log(error);
					console.log("Fail to POST image to server");
				})
		}
	};

	const handleFileDelete = (imgTitle) => {
		fetch('http://localhost:9000/upload?img=' + imgTitle, {
			method: 'DELETE',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				props.setValue('isProfileComplete', res.isProfileComplete);
				let tempImgArr = itemData.slice();
				tempImgArr[itemData.findIndex(x => x.title === imgTitle)]["img"] = placeholder;
				setImageArr(tempImgArr);
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to POST image to server");
			})
	};

	return (
		<Box className={classes.root} >
			<ImageList sx={{ height: 576, maxWidth: 1552 }} rowHeight={'auto'} gap={8} cols={3} >
				{imageArr.map((item, i) => (
					<ImageListItem
						key={i}
						cols={1}
						rows={item.profile ? 2 : 1}
						sx={{
							width: '100vw',
							justifyContent: 'center',
							alignContent: 'center',
							overflow: 'hidden',
							'@media screen and (min-width: 768px)': {
								width: (item.profile ? 768 : 384),
							}
						}}
					>
						<img src={item.img} alt={item.title} style={{ objectFit: 'cover' }} />
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
							actionIcon={<OptionButton item={item} ref={inputFile.current[i]} handleFileDelete={handleFileDelete} />}
						/>
					</ImageListItem>
				))}
			</ImageList>
		</Box>
	);
}

export default ImageGallery;
