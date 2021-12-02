import React from 'react';
import { useState, useEffect } from 'react';

import { useHistory } from "react-router-dom";
import { Snackbar } from '@mui/material';

import Figures from '../components/Figures'
import ImageGallery from '../components/ImageGallery'
import Interests from '../components/Interests'
import Biography from '../components/Biography'
import Gender from '../components/Gender'
import SexualPreferences from '../components/SexualPreferences'
import Loading from '../components/Loading'

function Profile(props) {

	const history = useHistory();
	const [user, setUser] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorSnack, setErrorSnack] = React.useState(null);
	const [openSnack, setOpenSnack] = React.useState(false);
	const { logout } =
		props;

	const handleOpenSnack = () => {
		setOpenSnack(true);
	};

	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnack(false);
	};

	useEffect(() => {
		let isCancelled = false;
		if (!isCancelled)
			setIsLoading(true);

		fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + (props.path === '/profile' ? '' : props.computedMatch.params.username), {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						if (!isCancelled) {
							setUser(data);
							setIsLoading(false);
						}
					})
				}
				else if (res.status === 401 && !isCancelled) {
					setIsLoading(false);
					logout();
					history.push(`/`);
				}
				else {
					setIsLoading(false);
					setErrorSnack('Profile: Wrong querry sent to the server')
				}
			})
			.catch(error => {
				// console.log(error);
				setIsLoading(false);
				setErrorSnack("Profile: Can't communicate with server")
			})
		return () => {
			isCancelled = true;
		};
	}, [props.path, props.computedMatch, history, props.user, logout]);

	useEffect(() => {
		if (errorSnack)
			handleOpenSnack();
	}, [errorSnack])

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={openSnack}
				onClose={handleCloseSnack}
				message={errorSnack}
				autoHideDuration={6000}
				key={'top-center'}
			/>
			{
				isLoading === true ?
					<Loading />
					:
					<>
						<Figures {...props} setErrorSnack={setErrorSnack} user={user} updateUser={setUser} editable={user.isAuth} likeable={!user.isAuth} />
						<ImageGallery {...props} setErrorSnack={setErrorSnack} user={user} editable={user.isAuth} />
						<Interests {...props} setErrorSnack={setErrorSnack} user={user} />
						<Biography {...props} setErrorSnack={setErrorSnack} bio={user.bio} editable={user.isAuth} />
						<Gender {...props} setErrorSnack={setErrorSnack} gender={user.gender} editable={user.isAuth} />
						<SexualPreferences {...props} setErrorSnack={setErrorSnack} preference={user.preference} editable={user.isAuth} />
					</>
			}
		</>
	);
}

export default Profile;
