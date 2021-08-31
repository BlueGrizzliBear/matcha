import { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";

class PublicHomepage extends Component {
	// constructor(props) {
	// 	super(props);
	// 	// this.state = { apiResponse: "", dbResponse: "" };		
	// }

	render () {
		return (
			<>
				<h1 id="catchphrase">For people searching for love</h1>
				<Button	variant="contained" color="primary" component={Link} to="/register">
					Create account
				</Button>
			</>
		);
	}
}

export default PublicHomepage;
