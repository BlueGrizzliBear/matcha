import { Component } from 'react';
import NavBar from '../components/NavBar';
import Button from '@material-ui/core/Button';

class Homepage extends Component {
	// constructor(props) {
	// 	super(props);
	// 	// this.state = { apiResponse: "", dbResponse: "" };		
	// }

	render () {
		return (
			<>
				<header>
					<NavBar />
				</header>
				<main>
					<Button id="createAccount" variant="contained" color="primary">Create account</Button>
				</main>
				<footer>
					<p id="notice">All photos are of professional models and used for illustrative purposes only</p>
				</footer>
			</>
		);
	}
}

export default Homepage;
