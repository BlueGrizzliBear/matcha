import ReactLoading from 'react-loading';
import { Box } from '@mui/material';

export function LoadingMenu() {
  return (
    <ReactLoading
      type={"bubbles"}
      color={"#aaaaaa"}
      height={100}
      width={100}
    />
  );
}

export function LoadingChat() {
  return (
    <ReactLoading
      type={"bubbles"}
      color={"#aaaaaa"}
      height={30}
      width={30}
    />
  );
}

function Loading() {
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
