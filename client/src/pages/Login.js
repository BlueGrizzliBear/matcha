import { useState } from 'react';
import { Button, TextField, InputLabel, FilledInput, InputAdornment, Box, IconButton, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';

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

function Login() {

	const classes = formStyle();

	const [values, setValues] = useState({
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
			<Box className="formBox" style={{ borderRadius: 10 }}>
				<form onSubmit={handleLogin} noValidate autoComplete="off">
					<TextField id="filled-required"
						required
						label="Username"
						autoComplete="username"
						autoFocus={true}
						value={values.username}
						onChange={handleChange('username')}
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
						Sign in
					</Button>
				</form>
			</Box>
		</>
	);
}

export default Login;
