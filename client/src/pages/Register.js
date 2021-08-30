import { Button, Box } from '@material-ui/core';
import InputForm from '../components/InputForm';

function Register() {
	
	return (
		<>
			<Box className="formBox" style={{borderRadius: 10}}>
				<form noValidate autoComplete="off">
						<InputForm label="Email"/>
						<InputForm label="Lastname"/>
						<InputForm label="Firstname" margin="8px 8px 40px 8px"/>
						<InputForm label="Username"/>
						<InputForm label="Password" type="password"/>
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