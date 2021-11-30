import React from 'react';
import { useState, useEffect } from 'react';
import { Tooltip, IconButton, Button, TextField, Menu, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { MoreVert as MoreVertIcon, Block as BlockIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { useHistory } from "react-router-dom";

function BlockReportMenu({ user, updateUser, ...props }) {

	const history = useHistory();

	const [values, setValues] = useState({
		report: '',
	});
	const [blocked, setBlocked] = useState(false);
	const [openReport, setOpenReport] = React.useState(false);
	const [anchorOptionsEl, setAnchorOptionsEl] = useState(null);
	const openOptions = Boolean(anchorOptionsEl);

	const handleLogout = () => {
		props.logout();
		history.push(`/`);
	}

	const handleBlock = (e) => {
		fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + user.username + (blocked ? '/unblock' : '/block'), {
			method: 'GET',
			headers: {
				'Authorization': "Bearer " + localStorage.getItem("token"),
			},
		})
			.then(res => {
				if (res.ok) {
					fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + user.username, {
						method: 'GET',
						headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
					})
						.then(res => {
							if (res.ok && res.status === 200) {
								return res.json().then((data) => {
									updateUser(data);
								})
							}
							else if (res.status === 401) {
								handleLogout();
							}
							else {
								console.log("Fail to fetch user data");
							}
						})
						.catch(error => {
							console.log(error);
							console.log("Fail to fetch user data");
						})
					setBlocked(!blocked);
				}
				else if (res.status === 401) {
					handleLogout();
				}
				else {
					console.log("Fail to block user");
				}
			})
			.catch((error) => {
				console.log(error);
				console.log("Fail to block user");
			})
	}

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleOptionsClick = (event) => {
		setAnchorOptionsEl(event.currentTarget);
	};

	const handleOptionsClose = () => {
		setAnchorOptionsEl(null);
	};

	const handleClickOpenReport = () => {
		setOpenReport(true);
		setAnchorOptionsEl(null);
	};

	const handleCloseReport = () => {
		setOpenReport(false);
	};

	const handleSendReport = () => {
		fetch("http://" + process.env.REACT_APP_API_URL + 'user/' + user.username + '/report', {
			method: 'POST',
			headers: {
				'Authorization': "Bearer " + localStorage.getItem("token"),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				reason: values.report,
			})
		})
			.then(res => {
				if (res.ok) {
					setOpenReport(false);
				}
				else if (res.status === 401) {
					handleLogout();
				}
				else {
					console.log("Fail to report user");
				}
			})
			.catch((error) => {
				console.log(error);
			})
	};

	useEffect(() => {
		setValues({ report: '' });
	}, []);


	useEffect(() => {
		setBlocked(user.blocked);
	}, [user.blocked]);

	return (
		<>
			<IconButton
				aria-label="options menu"
				sx={{ p: 1 }}
				color="inherit"
				aria-controls="options-menu"
				aria-haspopup="true"
				aria-expanded={openOptions ? 'true' : undefined}
				onClick={handleOptionsClick}
			>
				<Tooltip title="Options">
					<MoreVertIcon />
				</Tooltip>
			</IconButton>
			<Menu
				id="messages-menu"
				anchorEl={anchorOptionsEl}
				open={openOptions}
				onClose={handleOptionsClose}
				sx={{ width: '100%', maxWidth: 360 }}
			>
				<MenuItem onClick={handleClickOpenReport}>
					<ErrorOutlineIcon /> Report
				</MenuItem >
				<MenuItem selected={blocked} onClick={handleBlock}>
					<BlockIcon /> Block
				</MenuItem >
			</Menu>
			<Dialog open={openReport} onClose={handleCloseReport}>
				<DialogTitle>Report</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To report this user, please enter the reason.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="report"
						label="Reason"
						type="text"
						fullWidth
						variant="standard"
						value={values.report}
						onChange={handleChange('report')}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseReport}>Cancel</Button>
					<Button onClick={handleSendReport}>Submit</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default BlockReportMenu;
