import { useState } from 'react';
import { Button, Box } from '@mui/material';
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

	const [values, setValues] = useState({
		username: '',
		password: '',
	});

	const [showPassword, setPasswordState] = useState(false);

	const handleLogin = (e) => {
		e.preventDefault();
		if (!verification) {
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
					if (res.ok && res.status !== 204) {
						return res.json().then((data) => {
							localStorage.setItem("token", data.token);
							props.login();
							history.push(`/`);
						})
					}
					else if (res.status === 403) {
						console.log("Account not activated.");
						setSent(false);
						setError(true);
						setVerification(true);
					}
					else {
						console.log("Incorrect username or password.");
						setSent(false);
						setError(true);
					}
				})
				.catch(() => {
					console.log("Fail to login to server");
				})
		}
		else {
			fetch('http://localhost:9000/login/activation_link', {
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
						console.log("Incorrect username or password.");
						setError(true);
					}
				})
				.catch(() => {
					console.log("Fail to send verification link");
				})
		}
	};

	const handleForgotPassword = (e) => {
		fetch('http://localhost:9000/login/forgot_password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({
				username: values.username,
			}),
		})
			.then(res => {
				setSent(true);
				setVerification(false);
				setError(false);
			})
			.catch(() => {
				console.log("Fail to send password reset link to email");
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

	return (
		<>
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
					<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: error && !verification ? 'space-between' : 'center' }} style={{ margin: "0px 20px" }}>
						<Button id="createAccount"
							variant="contained"
							type="submit"
							style={{ margin: "16px 0px 4px 0px" }}
						>
							{verification ? 'Send Link' : 'Sign in'}
						</Button>
						<Button href="#text-buttons"
							onClick={handleForgotPassword}
							size='small'
							sx={{ display: error && !verification ? 'block' : 'none' }}
							style={{ margin: "16px 0px 4px 0px" }}
						>
							Forgot Password ?
						</Button>
					</Box>
					{/* Ajouter etat pour mettre texte "Email not verified" et bouton pour renvoyer un mail de verification */}
				</Box>
			</Box>
		</>
	);
}

export default Login;
