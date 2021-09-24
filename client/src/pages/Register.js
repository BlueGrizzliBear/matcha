import React from 'react';
import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import InputForm, { PasswordInputForm } from '../components/InputForm';

import { useHistory } from "react-router-dom";

function Register() {

	const history = useHistory();

	const [errors, setErrors] = useState({});

	const [showPassword, setPasswordState] = useState(false);

	const [values, setValues] = useState({
		email: '',
		lastname: '',
		firstname: '',
		username: '',
		password: '',
	});

	const regexMatch = function (value, regex) {
		if (typeof value === 'string' && value.match(regex))
			return true;
		return false;
	}

	const isEmail = function (value) {
		if (regexMatch(value, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/))
			return true;
		return false;
	}

	const isAlphanum = function (value) {
		if (regexMatch(value, /^[a-zA-Z0-9]+$/))
			return true;
		return false;
	}	

	const isAlpha = function (value) {
		if (regexMatch(value, /^[a-zA-Z]+$/))
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
		
		console.log("Validating fields");
		let errorsArr = {};
		let formIsValid = true;

		for (let field in values)
		{
			if ((field ==='email' && !isEmail(values[field])) ||
				(field ==='lastname' && !isAlpha(values[field])) ||
				(field ==='firstname' && !isAlpha(values[field])) ||
				(field ==='username' && !isAlphanum(values[field])) ||
				(field ==='password' && !isValidPassword(values[field])))
			{
				errorsArr[field] = "Incorrect entry.";
				formIsValid = false;
			}
			else
				delete errorsArr[field];
		}

		console.log(errorsArr);
		setErrors(errorsArr);
		return (formIsValid);
	}

	const handleRegister = (e) => {
		e.preventDefault();

		if (validateFields(values))
		{
			console.log("VALIDATED")
			fetch('http://localhost:9000/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: values.email,
					lastname: values.lastname,
					firstname: values.firstname,
					username: values.username,
					password: values.password
				})
			})
				.then(res => {
					if (res.ok) {
						console.log("User successfully registered");
						console.log("code: " + res.status + ", status: " + res.statusText);
						history.push(`/`);
					}
					else {
						console.log("Username or email already exists");
						console.log("code: " + res.status + ", status: " + res.statusText);
					}
				})
				.catch(() => {
					console.log("Fail to register user to server");
				})
		}
	}



	const handleChange = (prop) => (event) => {
		validateFields({[event.target.name]: event.target.value});
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
				<InputForm name="email" error={'email' in errors} /* helperText={errors['email']} */ label="Email" value={values.email} onChange={handleChange('email')} autoFocus={true} />
				<InputForm name="lastname" error={'lastname' in errors} /* helperText={errors['lastname']} */ label="Lastname" value={values.lastname} onChange={handleChange('lastname')} />
				<InputForm name="firstname" error={'firstname' in errors} /* helperText={errors['firstname']} */ label="Firstname" value={values.firstname} onChange={handleChange('firstname')} />
				<InputForm name="username" error={'username' in errors} /* helperText={errors['username']} */label="Username" value={values.username} onChange={handleChange('username')} />
				<PasswordInputForm
					error={'password' in errors}
					/* helperText={errors['password']} */
					filledInputProps={{
						name: "password",
						label: "Password",
						value: values.password,
						type: showPassword ? 'text' : 'password',
						onChange: handleChange('password')
					}}
					iconButtonProps={{
						onClick: handleClickShowPassword,
						onMouseDown: handleMouseDownPassword,	
					}}
					// visibility={values.showPassword ? <Visibility /> : <VisibilityOff />}
					visibility={showPassword ? <Visibility /> : <VisibilityOff />}
				/>
				<Button variant="contained"
					type="submit"
					style={{ margin: "16px 0px 4px 0px" }}
				>
					Register
				</Button>
			</Box>
		</Box>
	);

}

export default Register;
