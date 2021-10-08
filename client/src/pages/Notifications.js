import { useState, useEffect } from 'react';
import Loading from '../components/Loading'

function Notifications() {

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		fetch("http://localhost:9000/notification", {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						setIsLoading(false);
					})
				}
				else {
					console.log("Fail to get notifications");
					setIsLoading(false);
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to fetch");
				setIsLoading(false);
			})
	}, []);

	return (
		<>
			<p>THIS IS YOUR NOTIFICATIONS</p>
			<p>ADD notification list here</p>

			{
				isLoading === true ?
					Loading()
					:
					<>

					</>
			}
		</>
	);
}

export default Notifications;
