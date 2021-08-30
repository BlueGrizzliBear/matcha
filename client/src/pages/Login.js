import { Button, Box } from '@material-ui/core';
import InputForm from '../components/InputForm';

function Login() {	
	return (
		<>
			<Box className="formBox" style={{borderRadius: 10}}>
				<form noValidate autoComplete="off">
						<InputForm label="Username"/>
						<InputForm label="Password" type="password"/>
						<Button	id="createAccount"
								variant="contained"
								color="primary"
								type="submit"
								value="submit"
								style={{ margin: "16px 0px 8px 0px" }}>
							Sign in
						</Button>
				</form>
			</Box>
		</>
	);

}

export default Login;
