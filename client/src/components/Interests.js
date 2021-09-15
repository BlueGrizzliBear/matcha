import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
  },
}));

function Interests() {

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <p>Interests</p>
    </Box>
  );
}

export default Interests;
