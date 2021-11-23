import React from 'react';
import { useState, useEffect } from 'react';

import { useHistory } from "react-router-dom";

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

	useEffect(() => {
		// document.title = 'MATCHA - Profile'
		setIsLoading(true);

		fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + (props.path === '/profile' ? '' : props.computedMatch.params.username), {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						setUser(data);
						setIsLoading(false);
					})
				}
				else {
					localStorage.removeItem("token");
					setIsLoading(false);
					history.push(`/`);
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to fetch");
				setIsLoading(false);
				history.push(`/`);
			})
	}, [props.path, props.computedMatch, history, props.user]);

	return (
		<>
			{
				isLoading === true ?
					<Loading />
					:
					<>
						<Figures {...props} user={user} updateUser={setUser} editable={user.isAuth} likeable={!user.isAuth} />
						<ImageGallery {...props} user={user} editable={user.isAuth} />
						<Interests user={user} />
						<Biography bio={user.bio} editable={user.isAuth} />
						<Gender gender={user.gender} editable={user.isAuth} />
						<SexualPreferences preference={user.preference} editable={user.isAuth} />
					</>
			}
		</>
	);
}

export default Profile;
