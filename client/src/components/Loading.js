import ReactLoading from 'react-loading';
import { Box } from '@mui/material';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//   },
// }));

function Loading() {

  // const classes = useStyles();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ReactLoading
        type={"spinningBubbles"}
        color={"#ffffff"}
        height={100}
        width={100}
      />
    </Box>
  );
}

export default Loading;
