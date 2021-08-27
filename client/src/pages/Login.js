// import { Component } from 'react';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

function Login() {

	const [values, setValues] = React.useState({
		username: '',
		password: '',
		showPassword: false,
	});

	const handleLogin = () => {
		fetch('http://localhost:9000/process_login', {
			method: 'POST',
			body: JSON.stringify({ values }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then(res => res.json())
			.then(json => json.values)
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
			<form className="sign-in form" noValidate autoComplete="off">
				<fieldset id="sign-in">
					<legend>Sign in to Matcha</legend>
					<TextField value={values.username} onChange={handleChange('username')} id="outlined-basic" autoComplete="username" autoFocus={true} label="Username or email adress" variant="outlined" />
					<FormControl variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
						<OutlinedInput
							id="outlined-adornment-password"
							autoComplete="current-password"
							type={values.showPassword ? 'text' : 'password'}
							value={values.password}
							onChange={handleChange('password')}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{values.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
					<Button onClick={handleLogin} id="createAccount" variant="contained" color="primary">Sign in</Button>
				</fieldset>
			</form>
		</>
	);
}

export default Login;
