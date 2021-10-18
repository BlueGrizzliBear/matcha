import React from 'react';
import { useState, useEffect, useRef, createRef, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';

import OptionButton from '../components/OptionButton'
import Loading from '../components/Loading'

import placeholder from '../assets/images/no_img.svg';
import { sleep } from '../utility/utilities'

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
		title: 'img0',
		profile: true,
	},
	{
		title: 'img1',
	},
	{
		title: 'img2',
	},
	{
		title: 'img3',
	},
	{
		title: 'img4',
	}
]

function ImageGallery(props) {

	const classes = useStyles();
	const [mounted, setMounted] = useState(true);
	const [imageArr, setImageArr] = useState(itemData);
	const [isLoading, setIsLoading] = useState(itemData.map(() => true));
	const inputFile = useRef(itemData.map(() => createRef()));

	const fetchImage = useCallback(
		(path, index, withoutHeader) => {
			fetch(path, {
				method: 'GET',
				headers: (withoutHeader ? {} : { 'Authorization': "Bearer " + localStorage.getItem("token") }),
			})
				.then(res => {
					if (!res.ok)
						throw new Error('Request: did not receive success code between 200-299.');
					return res.blob();
				})
				.then(res => {
					setImageArr((imgArr) => {
						imgArr[index]['img'] = URL.createObjectURL(res);
						return (imgArr);
					});
					setIsLoading((arr) => {
						let tmpArr = arr.slice();
						tmpArr[index] = false;
						return (tmpArr);
					});
				})
				.catch(error => {
					console.log(error);
					console.log("Fail to GET image from server");
				})
		},
		[],
	);

	useEffect(() => {
		if (mounted) {
			sleep(2000).then(() => {

				for (const tag in props.user.images) {
					const index = itemData.findIndex(x => x.title === tag);
					if (props.user.images[tag]) {
						// setIsLoading((arr) => {
						// 	let tmpArr = arr.slice();
						// 	tmpArr[index] = true;
						// 	return (tmpArr);
						// });
						fetchImage(props.user.images[tag], index, props.user.fake);
					}
					else {
						setImageArr((imgArr) => {
							imgArr[index]['img'] = placeholder;
							return (imgArr);
						});
						setIsLoading((arr) => {
							let tmpArr = arr.slice();
							tmpArr[index] = false;
							return (tmpArr);
						});
					}
				}

			});


		}
		// Anything in here is fired on component unmount.
		return () => {
			setMounted(false);
		}

	}, [props.path, props.user, mounted, fetchImage]);

	const handleFileUpload = (e) => {
		const { files } = e.target;
		if (files && files.length) {
			const formData = new FormData()
			formData.append('uploadedImage', files[0], files[0].name);
			fetch("http://" + process.env.REACT_APP_API_URL + 'upload?img=' + e.target.title, {
				method: 'POST',
				headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
				body: formData
			})
				.then(res => res.json())
				.then(res => {
					props.setValue('isProfileComplete', res.isProfileComplete);
					const index = itemData.findIndex(x => x.title === e.target.title);
					fetchImage("http://" + process.env.REACT_APP_API_URL + 'upload/' + res.image, index, props.user.fake);
				})
				.catch(error => {
					console.log(error);
					console.log("Fail to POST image to server");
				})
		}
	};

	const handleFileDelete = (imgTitle) => {
		fetch("http://" + process.env.REACT_APP_API_URL + 'upload?img=' + imgTitle, {
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
							backgroundColor: 'placeholder.main',
							overflow: 'hidden',
							'@media screen and (min-width: 768px)': {
								width: (item.profile ? 768 : 384),
							}
						}}
					>
						{isLoading[i] ?
							<Loading />
							:
							<img src={item.img} alt={item.title} style={{ objectFit: 'cover' }} />
						}
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
