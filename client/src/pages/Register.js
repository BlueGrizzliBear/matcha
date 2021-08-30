import { useState } from 'react';
import { Button, TextField, InputLabel, FilledInput, InputAdornment, Box, IconButton, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import InputForm from '../components/InputForm';

const formStyle = makeStyles((theme) => ({
	root: {
		border: '1px solid #e2e2e1',
		overflow: 'hidden',
		borderRadius: 10,
		backgroundColor: '#fff',
		'&:hover': {
			backgroundColor: '#fff',
		},
		'&$focused': {
			backgroundColor: '#fff',
			borderColor: theme.palette.primary.main,
		},
	},
	focused: {},
}));

function Register() {

	const classes = formStyle();

	const [values, setValues] = useState({
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
			<Box className="formBox" style={{ borderRadius: 10 }}>
				<form noValidate autoComplete="off">
					{/* <InputForm label="Email"/> */}
					<TextField id="filled-required"
						required
						label="Email"
						variant="filled"
						InputProps={{ classes, disableUnderline: true }}
						style={{ width: '90%', margin: "8px" }} />
					<TextField id="filled-required"
						required
						label="Lastname"
						variant="filled"
						InputProps={{ classes, disableUnderline: true }}
						style={{ width: '90%', margin: "8px" }} />
					<TextField id="filled-required"
						required
						label="Firstname"
						variant="filled"
						InputProps={{ classes, disableUnderline: true }}
						style={{ width: '90%', margin: "8px 8px 40px 8px" }} />

					<TextField id="filled-required"
						required
						label="Username"
						variant="filled"
						InputProps={{ classes, disableUnderline: true }}
						style={{ width: '90%', margin: "8px" }} />
					<FormControl
						variant="filled"
						style={{ width: '90%', margin: "8px" }}>
						<InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
						<FilledInput
							classes={classes}
							disableUnderline={true}
							id="filled-adornment-password"
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
