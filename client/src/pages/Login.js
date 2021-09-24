import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import InputForm, { PasswordInputForm } from '../components/InputForm';

import { useHistory } from "react-router-dom";

function Login(props) {

	const history = useHistory();

	const [error, setError] = useState(false);

	const [values, setValues] = useState({
		username: '',
		password: '',
	});

	const [showPassword, setPasswordState] = useState(false);

	const handleLogin = (e) => {
		e.preventDefault();
		fetch('http://localhost:9000/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({
				username: values.username,
				password: values.password
			}),
		})
			.then(res => {
				console.log(res.status);
				if (res.ok && res.status !== 204) {
					return res.json().then((data) => {
						console.log("code: " + data.status);
						console.log(typeof data.token);

						localStorage.setItem("token", data.token);
						console.log("before login");
						props.login();
						history.push(`/`);
					})
				}
				else {
					console.log("Incorrect username or password.");
					setError(true);
				}
			})
			// .then(res => res.json())
			// .then(data => {
			// 	console.log(data);
			// 	if (data.status === "200") {
			// 		console.log("code: " + data.status);
			// 		localStorage.setItem("token", data.token);
			// 		props.login();
			// 		history.push(`/`);
			// 	}
			// 	else {
			// 		console.log("Incorrect username or password");
			// 		setError(true);
			// 		console.log("code: " + data.status + ", status: " + data.error);
			// 		return ;
			// 	}
			// })
			.catch(() => {
				console.log("Fail to login to server");
			})
	}

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleClickShowPassword = () => {
		setPasswordState(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<Box className="FormBox">
				<Box component="form" noValidate={true} autoComplete="off" onSubmit={handleLogin}>
					<InputForm error={error} helperText={error ? "Gross error" : ''} label="Username" value={values.username} autoFocus={true} onChange={handleChange('username')} />
					<PasswordInputForm
						error={error}
						filledInputProps={{
							label: "Password",
							value: values.password,
							type: showPassword ? 'text' : 'password',
							onChange: handleChange('password')
						}}
						iconButtonProps={{
							onClick: handleClickShowPassword,
							onMouseDown: handleMouseDownPassword
						}}
						visibility={showPassword ? <Visibility /> : <VisibilityOff />}
					/>
					<Button id="createAccount"
						variant="contained"
						type="submit"
						style={{ margin: "16px 0px 4px 0px" }}
					>
						Sign in
					</Button>
					{/* Ajouter etat pour mettre texte "Email not verified" et bouton pour renvoyer un mail de verification */}
				</Box>
			</Box>
		</>
	);
}

export default Login;
