import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
  },
}));

function Biography() {

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <p>Biography</p>
    </Box>
  );
}

export default Biography;