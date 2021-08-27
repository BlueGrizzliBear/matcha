import { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends Component {

	render() {
		return (
			<>
				<form className="sign-in form" noValidate autoComplete="off">
					<fieldset id="sign-in">
						<legend>Sign in to Matcha</legend>
						<TextField id="outlined-basic" autoFocus="true" label="Username or email adress" variant="outlined" />
						<TextField id="outlined-basic" label="Password" variant="outlined" />
						<Button id="createAccount" variant="contained" color="primary">Sign in</Button>
					</fieldset>
				</form>
			</>
		);
	}
}

export default Login;
