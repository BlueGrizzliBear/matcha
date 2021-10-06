import Figures from '../components/Figures'
import ImageGallery from '../components/ImageGallery'
import Interests from '../components/Interests'
import Biography from '../components/Biography'
import Gender from '../components/Gender'
import SexualPreferences from '../components/SexualPreferences'

// const useStyles = makeStyles((theme) => ({

// }));

function Profile(props) {

	// const classes = useStyles();

	// console.log(props.match);
	if (props.match && props.match.params)
		console.log(props.match.params.username);

	return (
		<>
			<Figures {...props} />
			<ImageGallery {...props} />
			<Interests />
			<Biography />
			<Gender />
			<SexualPreferences />
		</>
	);
}

export default Profile;
