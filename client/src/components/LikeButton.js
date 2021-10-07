import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import { Favorite as FavoriteIcon } from '@mui/icons-material';

function LikeButton({ firstColor = 'primary', secondColor = 'secondary', ...props }) {
  const [selected, setSelected] = React.useState(props.liking);

	const fetchLike = (path) => {
    console.log(path);
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
    console.log(process.env.API);
    fetchLike(process.env.API + props.computedMatch.params.username + '/like');
  }

	const unlikeProfile = () => {
    console.log(props);
    console.log(props.location);
    // fetchLike();
  }

  return (
    <ToggleButton
    value="check"
    selected={true}
    size='large'
    color={selected ? firstColor : secondColor }
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
        animation: (selected ? 'heartbeat 2s infinite' : '')
        }} />
    </ToggleButton>
  );
}

export default LikeButton;
