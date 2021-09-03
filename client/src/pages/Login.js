import { useState } from 'react';
import { Button, Box } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import InputForm, { PasswordInputForm } from '../components/InputForm';

import { useHistory } from "react-router-dom";

function Login(props) {

	const history = useHistory();

	const [values, setValues] = useState({
		username: '',
		password: '',
		showPassword: false,
	});

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
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.status === "200") {
					console.log("code: " + data.status + ", status: " + data.success);
					localStorage.setItem("token", data.token);
					props.login();
					let path = `/`;
					history.push(path);
				}
				else {
					console.log("code: " + data.status + ", status: " + data.error);
				}
			})
	}

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<Box className="FormBox">
				<form onSubmit={handleLogin} noValidate>
					<InputForm label="Username" value={values.username} autoFocus={true} onChange={handleChange('username')} />
					<PasswordInputForm
						label="Password"
						value={values.password}
						type={values.showPassword ? 'text' : 'password'}
						onChange={handleChange('password')}
						onClick={handleClickShowPassword}
						onMouseDown={handleMouseDownPassword}
						visibility={values.showPassword ? <Visibility /> : <VisibilityOff />}
					/>
					<Button id="createAccount"
						variant="contained"
						color="primary"
						type="submit"
						value="submit"
						style={{ margin: "16px 0px 4px 0px" }}>
						Sign in
					</Button>
					{/* Ajouter etat pour mettre texte "Email not verified" et bouton pour renvoyer un mail de verification */}
				</form>
			</Box>
		</>
	);
}

export default Login;
