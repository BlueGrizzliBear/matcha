import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import { Favorite as FavoriteIcon } from '@mui/icons-material';

function LikeButton({ match = 'match', isLiked = 'primary', standard = 'secondary', ...props }) {
  const [selected, setSelected] = React.useState(props.liking);

	const fetchLike = (path) => {
		fetch(path, {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
    .then(res => {
      if (res.ok && res.status === 200) {
        setSelected(!selected);
      }
      else {
        console.log("Error in liking the profile");
      }
    })
    .catch(error => {
      console.log(error);
      console.log("Fail to fetch");
    })
  }

	const likeProfile = () => {
    fetchLike(process.env.REACT_APP_API_URL + 'user/' + props.computedMatch.params.username + '/like');
  }

	const unlikeProfile = () => {
    fetchLike(process.env.REACT_APP_API_URL + 'user/' + props.computedMatch.params.username + '/unlike');
  }

  return (
    <ToggleButton
    value="check"
    selected={true}
    size='large'
    color={selected ? match : (props.user.liked ? isLiked : standard) }
    sx={{ borderRadius: '50%' }}
    onChange={() => {
      if (!selected)
        likeProfile();
      else
        unlikeProfile();
      setSelected(!selected);
      }
    }
    >
      <FavoriteIcon sx={{
        fontSize: '36px',
        animation: (selected ? 'heartbeat 1.5s infinite' : '')
        }} />
    </ToggleButton>
  );
}

export default LikeButton;
