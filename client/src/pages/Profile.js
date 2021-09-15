// import { makeStyles } from '@material-ui/core/styles';

import Figures from '../components/Figures'
import ImageGallery from '../components/ImageGallery'
import Interests from '../components/Interests'
import Biography from '../components/Biography'
import Gender from '../components/Gender'
import SexualPreferences from '../components/SexualPreferences'

// const useStyles = makeStyles((theme) => ({

// }));

function Profile() {

	// const classes = useStyles();

	return (
		<>
			<Figures />
			<ImageGallery />
			<Interests />
			<Biography />
			<Gender />
			<SexualPreferences />
		</>
	);
}

export default Profile;
