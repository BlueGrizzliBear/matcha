import React from 'react';
import { useState, useEffect } from 'react';
import { Snackbar, Button, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { PasswordInputForm } from '../components/InputForm';

import { useHistory } from "react-router-dom";

function Register(props) {

	const history = useHistory();

	const [errors, setErrors] = useState({});
	const [showPassword, setPasswordState] = useState(false);
	const [errorSnack, setErrorSnack] = React.useState(null);
	const [openSnack, setOpenSnack] = React.useState(false);
	const [values, setValues] = useState({
		password: '',
	});

	const handleOpenSnack = () => {
		setOpenSnack(true);
	};

	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnack(false);
	};

	const regexMatch = function (value, regex) {
		if (typeof value === 'string' && value.match(regex))
			return true;
		return false;
	}

	const isValidPassword = function (value) {
		// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
		if (regexMatch(value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/\\])[A-Za-z\d@$!%*?&/\\]{8,}$/))
			return true;
		return false;
	}

	const validateFields = (values) => {
		let errorsArr = { ...errors };
		let formIsValid = true;

		for (let field in values) {
			if ((field === 'password' && !isValidPassword(values[field]))) {
				errorsArr[field] = "Incorrect entry.";
				formIsValid = false;
			}
			else
				delete errorsArr[field];
		}
		setErrors(errorsArr);
		return (formIsValid);
	}

	const handleRegister = (e) => {
		e.preventDefault();

		if (validateFields(values)) {
			fetch("http://" + process.env.REACT_APP_API_URL + 'user/reset_password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': "Bearer " + props.computedMatch.params.token
				},
				body: JSON.stringify({
					password: values.password
				})
			})
				.then(res => {
					if (res.ok) {
						// console.log("User successfully reset password");
						// console.log("code: " + res.status + ", status: " + res.statusText);
						// props.setValue('isSent');
						history.push(`/login`);
						// const test = { sent: true }
						// props.register("/login", test);
					}
					else {
						setErrorSnack("Reset password: Wrong querry sent to the server")
						history.push(`/login`);
					}
				})
				.catch(() => {
					setErrorSnack("Reset password: Can't communicate with server")
				})
		}
	}

	const handleChange = (prop) => (event) => {
		validateFields({ [event.target.name]: event.target.value });
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
				<Box component="form" noValidate={true} autoComplete="off" onSubmit={handleRegister}>
					<PasswordInputForm
						error={'password' in errors}
						helpertext={errors['password']}
						filledInputProps={{
							name: "password",
							label: "New Password",
							value: values.password,
							type: showPassword ? 'text' : 'password',
							onChange: handleChange('password')
						}}
						iconButtonProps={{
							onClick: handleClickShowPassword,
							onMouseDown: handleMouseDownPassword,
						}}
						visibility={showPassword ? <Visibility /> : <VisibilityOff />}
					/>
					<Button variant="contained"
						type="submit"
						style={{ margin: "16px 0px 4px 0px" }}
					>
						Reset Password
					</Button>
				</Box>
			</Box>
		</>
	);

}

export default Register;
