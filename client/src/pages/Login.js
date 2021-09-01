import { useState } from 'react';
import { Button, Box } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import InputForm, { PasswordInputForm } from '../components/InputForm';

function Login() {

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
			.then(res => {
				if (res.ok) {
					console.log("code: " + res.status + ", status: " + res.statusText);

					// const jwtToken = res.headers.get('Authorization');
					// sessionStorage.setItem("jwt", jwtToken);
					// this.setState({ isAuthenticated: true });
				}
				else {
					console.log("code: " + res.status + ", status: " + res.statusText);
				}
				console.log(res.json());
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
				</form>
			</Box>
		</>
	);
}

export default Login;
