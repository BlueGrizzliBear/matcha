import { useState } from 'react';
import { Button, Box } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import InputForm, { PasswordInputForm } from '../components/InputForm';

function Register() {

	const [values, setValues] = useState({
		email: '',
		lastname: '',
		firstname: '',
		username: '',
		password: '',
		showPassword: false,
	});

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
				<form noValidate autoComplete="off">
					<InputForm label="Email" value={values.email} autoFocus={true} onChange={handleChange('email')} />
					<InputForm label="Lastname" value={values.lastname} onChange={handleChange('lastname')} />
					<InputForm label="Firstname" margin="8px 8px 40px 8px" value={values.firstname} onChange={handleChange('firstname')} />
					<InputForm label="Username" value={values.username} onChange={handleChange('username')} />
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
						Register
					</Button>
				</form>
			</Box>
		</>
	);

}

export default Register;
