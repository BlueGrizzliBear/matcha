import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import calculateAge from '../utility/utilities'
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useHistory } from "react-router-dom";

function NameBirthEmail({ user, editable, updateUser, isOnline, ...props }) {

	const history = useHistory();

	const [editName, setEditName] = React.useState(true);
	const [birthdate, setBirthdate] = React.useState(new Date());
	const [openEmailEdit, setOpenEmailEdit] = React.useState(false);
	const [values, setValues] = useState({
		email: '',
		firstname: 'Unknown',
		lastname: 'Name',
	});
	const [errors, setErrors] = useState({});

	let textInputName = useRef(null);

	const regexMatch = function (value, regex) {
		if (typeof value === 'string' && value.match(regex))
			return true;
		return false;
	}

	const isEmail = function (value) {
		if (value === '')
			return true
		// eslint-disable-next-line
		if (regexMatch(value, /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i))
			return true;
		return false;
	}

	const isAlpha = function (value) {
		if (regexMatch(value, /^[a-zA-Z]+$/))
			return true;
		return false;
	}

	const handleLogout = () => {
		props.logout();
		history.push(`/`);
	}

	const validateFields = (values) => {
		let errorsArr = { ...errors };
		let formIsValid = true;

		for (let field in values) {
			if ((field === 'email' && !isEmail(values[field])) ||
				(field === 'lastname' && !isAlpha(values[field])) ||
				(field === 'firstname' && !isAlpha(values[field]))) {
				errorsArr[field] = "Incorrect entry.";
				formIsValid = false;
			}
			else
				delete errorsArr[field];
		}
		setErrors(errorsArr);
		return (formIsValid);
	}


	const handleOpenEmailEdit = () => {
		setOpenEmailEdit(true);
	}

	const handleCloseEmailEdit = () => {
		let newValues = { city: values.city, country: values.country, firstname: values.firstname, lastname: values.lastname, report: values.report, email: '' };

		setValues(newValues);
		setOpenEmailEdit(false);
	};

	const handleChange = (prop) => (event) => {
		validateFields({ [event.target.name]: event.target.value });
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleEditName = () => {
		if (validateFields(values)) {
			if (editName) {
				setEditName(false);
			}
			else {
				fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
					method: 'POST',
					headers: {
						'Authorization': "Bearer " + localStorage.getItem("token"),
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						firstname: values.firstname,
						lastname: values.lastname,
						birth_date: birthdate.toJSON().split('T')[0]
					})
				})
					.then(res => {
						if (res.ok) {
							return res.json().then((data) => {
								updateUser(data);
								setEditName(true);
							})
						}
						else if (res.status === 401) {
							handleLogout();
						}
						else {
							props.setErrorSnack('Profile name/birth update: Wrong querry sent to the server')
							// console.log("Fail to change name or birthdate");
						}
					})
					.catch((error) => {
						// console.log(error);
						props.setErrorSnack("Profile name/birth update: Can't communicate with server")
						// console.log("Fail to change name or birthdate");
					})
			}
		}
	};

	const handleSendEmailEdit = () => {
		if (validateFields(values)) {

			fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
				method: 'POST',
				headers: {
					'Authorization': "Bearer " + localStorage.getItem("token"),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: values.email,
				})
			})
				.then(res => {
					if (res.ok) {
						setOpenEmailEdit(false);
						handleLogout();
					}
					else if (res.status === 401) {
						handleLogout();
					}
					else if (res.status === 409) {
						let errorsArr = { ...errors };
						errorsArr['email'] = "Email already exists on another account.";
						setErrors(errorsArr);
					}
					else {
						props.setErrorSnack('Profile email update: Wrong querry sent to the server')
						// console.log("Fail to change Email");
					}
				})
				.catch((error) => {
					props.setErrorSnack("Profile email update: Can't communicate with server")
					// console.log(error);
					// console.log("Fail to change Email");
				})
		}
	};

	useEffect(() => {
		if (user.firstname && user.lastname)
			setValues({ firstname: user.firstname, lastname: user.lastname, email: '' });
		else
			setValues({ firstname: user.firstname, lastname: user.lastname, email: '' });
	}, [user.firstname, user.lastname, user.lastConnection]);

	useEffect(() => {
		if (user.birth_date)
			setBirthdate(new Date(user.birth_date));
	}, [user.birth_date]);

	useEffect(() => {
		if (!editName) {
			textInputName.current.focus();
		}
	}, [editName])

	return (
		<>
			{editable ?
				<Box display="flex" flexWrap='wrap' sx={{ m: 0, p: 0, gap: '5px', width: '100%', alignItems: 'center' }}>
					<TextField
						error={'firstname' in errors}
						helperText={'firstname' in errors && errors['firstname']}
						disabled={editName}
						inputRef={textInputName}
						id="filled-static"
						label="Firstname"
						value={values.firstname === null ? '' : values.firstname}
						variant="filled"
						onChange={handleChange('firstname')}
					/>
					<TextField
						disabled={editName}
						error={'lastname' in errors}
						helperText={'lastname' in errors && errors['lastname']}
						id="filled-static"
						label="Lastname"
						value={values.lastname === null ? '' : values.lastname}
						variant="filled"
						onChange={handleChange('lastname')}
					/>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker

							disableFuture
							disabled={editName}
							label="Birth Date"
							openTo="year"
							views={['year', 'day']} //can't put month for now, DatePicker is still in development mod
							value={birthdate}
							onChange={(newValue) => {
								setBirthdate(newValue);
							}}
							renderInput={(params) => <TextField variant="filled" sx={{ width: '140px' }} {...params} helperText={null} />}
						/>
					</LocalizationProvider>
					<Button sx={{ width: '70px' }} variant="contained" onClick={handleEditName} >{editName ? 'EDIT' : 'OK'}</Button>
					<Button sx={{ width: '120px' }} variant="contained" onClick={handleOpenEmailEdit} >edit email</Button>
					<Dialog open={openEmailEdit} onClose={handleCloseEmailEdit}>
						<DialogTitle>Change Email address</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Your current email is {user.email ? user.email : 'Unknown'}. You're about to change your Email adress, this action will disconnect you from your account. Please check your mails to validate your new Email address.
							</DialogContentText>
							<TextField
								error={'email' in errors}
								helperText={'email' in errors && errors['email']}
								autoFocus
								margin="dense"
								id="email-standard"
								label="New Email"
								type="email"
								fullWidth
								variant="standard"
								value={values.email === null ? '' : values.email}
								onChange={handleChange('email')}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCloseEmailEdit}>Cancel</Button>
							<Button onClick={handleSendEmailEdit}>Change Email</Button>
						</DialogActions>
					</Dialog>
				</Box>
				:
				<Box display="flex" direction="row" sx={{ m: 0, p: 0, gap: '5px', alignItems: 'end' }}>
					<h2
						style={{
							margin: '4px',
							textAlign: 'left',
							paddingLeft: '8px'
						}}
					>
						{user.firstname} {user.lastname}{user.birth_date ? ", " + calculateAge(user.birth_date) : ''}
					</h2>
					<Typography sx={{ m: '4px', p: '0 0 0 8px', fontSize: '12px' }}>
						{' Last activity: ' + (isOnline.online ? 'Just now' : (user.lastConnection ? (new Date(user.lastConnection)).toLocaleString() : 'Never'))}
					</Typography>
				</Box>
			}
		</>
	)

}

export default NameBirthEmail;
