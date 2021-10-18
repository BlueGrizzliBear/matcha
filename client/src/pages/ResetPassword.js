import React from 'react';
import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { PasswordInputForm } from '../components/InputForm';

import { useHistory } from "react-router-dom";

function Register(props) {

	const history = useHistory();

	const [errors, setErrors] = useState({});
	const [showPassword, setPasswordState] = useState(false);
	const [values, setValues] = useState({
		password: '',
	});

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
						console.log("User successfully reset password");
						// console.log("code: " + res.status + ", status: " + res.statusText);
						// props.setValue('isSent');
						history.push(`/login`);
						// const test = { sent: true }
						// props.register("/login", test);
					}
					else {
						console.log("An error occured: please retry later.");
						history.push(`/login`);
					}
				})
				.catch(() => {
					console.log("Fail to register user to server");
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

	return (
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
	);

}

export default Register;
