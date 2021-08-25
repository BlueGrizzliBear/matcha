import { Component } from 'react';
import Button from '@material-ui/core/Button';

class Home extends Component {
	// constructor(props) {
	// 	super(props);
	// 	// this.state = { apiResponse: "", dbResponse: "" };		
	// }

	render () {
		return (
			<div>
				<p>Matcha</p>
				<Button variant="contained" color="secondary">
					Log in
				</Button>
			</div>
		);
	}
}

export default Home;
