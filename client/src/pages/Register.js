import { Button, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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

	return (
		<>
			<Box className="formBox" style={{borderRadius: 10}}>
				<form noValidate autoComplete="off">
						{/* <InputForm label="Email"/> */}
						<TextField	id="filled-required"
									required
									label="Email"
									variant="filled"
									InputProps={{ classes, disableUnderline: true }}
									style={{ width: '90%', margin: "8px" }}/>
						<TextField	id="filled-required"
									required
									label="Lastname"
									variant="filled"
									InputProps={{ classes, disableUnderline: true }}
									style={{ width: '90%', margin: "8px" }}/>
						<TextField	id="filled-required"
									required
									label="Firstname"
									variant="filled"
									InputProps={{ classes, disableUnderline: true }}
									style={{ width: '90%', margin: "8px 8px 40px 8px" }}/>

						<TextField	id="filled-required"
									required
									label="Username"
									variant="filled"
									InputProps={{ classes, disableUnderline: true }}
									style={{ width: '90%', margin: "8px" }}/>
						<TextField	id="filled-required"
									required
									label="Password"
									variant="filled"
									type="password"
									InputProps={{ classes, disableUnderline: true }}
									style={{ width: '90%', margin: "8px" }}/>
						<Button	id="createAccount"
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