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

function Interests() {

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      Interests
    </Box>
  );
}

export default Interests;
