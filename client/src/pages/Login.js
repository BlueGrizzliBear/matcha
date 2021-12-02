import React from 'react';
import { useState, useEffect } from 'react';
import { Snackbar, Button, Box, Link, FormHelperText } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import InputForm, { PasswordInputForm } from '../components/InputForm';

import { useHistory } from "react-router-dom";

function Login(props) {

	// console.log("Rendering Login");

	const history = useHistory();
	// console.log(props);
	// console.log(props.location.state.sent);
	const [error, setError] = useState(false);
	const [sent, setSent] = useState(props.isSent);
	const [verification, setVerification] = useState(false);
	const [errorSnack, setErrorSnack] = React.useState(null);
	const [openSnack, setOpenSnack] = React.useState(false);
	const [values, setValues] = useState({
		username: '',
		password: '',
	});

	const [showPassword, setPasswordState] = useState(false);

	const handleOpenSnack = () => {
		setOpenSnack(true);
	};

	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnack(false);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		if (!verification) {
			fetch("http://" + process.env.REACT_APP_API_URL + 'login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'same-origin',
				body: JSON.stringify({
					username: values.username,
					password: values.password
				}),
			})
				.then(res => {
					if (res.ok && res.status !== 204) {
						return res.json().then((data) => {
							localStorage.setItem("token", data.token);
							props.login();
							history.push(`/`);
						})
					}
					else if (res.status === 403) {
						setErrorSnack("Account not activated.")
						setSent(false);
						setError(true);
						setVerification(true);
					}
					else {
						setErrorSnack("Incorrect username or password.")
						setSent(false);
						setError(true);
					}
				})
				.catch((error) => {
					// console.log(error);
					setErrorSnack("Login: Can't communicate with server")
				})
		}
		else {
			fetch("http://" + process.env.REACT_APP_API_URL + 'login/activation_link', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'same-origin',
				body: JSON.stringify({
					username: values.username,
				}),
			})
				.then(res => {
					if (res.ok && res.status !== 204) {
						setSent(true);
						setVerification(false);
						setError(false);
						console.log("Link sent.");
					}
					else {
						setErrorSnack("Invalid username")
						setError(true);
					}
				})
				.catch((error) => {
					setErrorSnack("Account activation: Can't communicate with server")
					// console.log("Fail to send verification link");
				})
		}
	};

	const handleForgotPassword = (e) => {
		fetch('http://' + process.env.REACT_APP_API_URL + 'login/forgot_password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({
				username: values.username,
			}),
		})
			.then(res => {
				if (res.ok) {
					setSent(true);
					setVerification(false);
					setError(false);
				}
				else {
					setErrorSnack("Invalid username")
					setError(true);
				}
			})
			.catch((error) => {
				setErrorSnack("Account activation: Can't communicate with server")
				// console.log("Fail to send password reset link to email");
			})
	};

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleClickShowPassword = () => {
		setPasswordState(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

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
			<Box className="FormBox">
				<Box component="form" noValidate={true} autoComplete="off" onSubmit={handleLogin}>
					<InputForm disabled={verification} error={error} helperText={error && !verification && "Incorrect username or password"} label="Username" value={values.username} autoFocus={true} onChange={handleChange('username')} />
					<PasswordInputForm
						error={error}
						sent={sent}
						helpertext={sent ? "A link has been sent to your email" : (verification ? "Your account email is not verified" : "Incorrect username or password")}
						filledInputProps={{
							label: "Password",
							value: values.password,
							type: showPassword ? 'text' : 'password',
							onChange: handleChange('password'),
							disabled: verification
						}}
						iconButtonProps={{
							onClick: handleClickShowPassword,
							onMouseDown: handleMouseDownPassword
						}}
						visibility={showPassword ? <Visibility /> : <VisibilityOff />}
					/>
					<FormHelperText style={{ margin: "0px 0px 0px 22px" }}>
						<Link href="#text-buttons"
							onClick={handleForgotPassword}
							sx={{ fontWeight: 'bold' }}
						>
							Forgot Password?
						</Link>
					</FormHelperText>
					<Button id="createAccount"
						variant="contained"
						type="submit"
						style={{ margin: "16px 0px 4px 0px" }}
					>
						{verification ? 'Send Link' : 'Sign in'}
					</Button>
					{/* Ajouter etat pour mettre texte "Email not verified" et bouton pour renvoyer un mail de verification */}
				</Box>
			</Box>
		</>
	);
}

export default Login;
