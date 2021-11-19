import React from 'react';
import { useEffect } from 'react';
import { Paper, Chip, Box, Button } from '@mui/material';
import { ChipsArray, ChipsAdderWithAddOption } from './Chips'

function Interests(props) {

  const [chipData, setChipData] = React.useState([]);
  const [chipAdderDisplay, setChipAdderDisplay] = React.useState(false)
  const { user } =
    props;

  const handleChipArrayDelete = (chipToDelete) => () => {
    fetch("http://" + process.env.REACT_APP_API_URL + 'tag', {
      method: 'DELETE',
      headers: {
        'Authorization': "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tag: chipToDelete.label,
      })
    })
      .then(res => {
        if (res.ok) {
          setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
          return;
        }
      })
      .catch(() => {
        console.log("Fail to delete tag");
      })
  };

  const handleChipArrayAdd = (event) => (chipToAdd) => {
    for (const data of chipData) {
      if (data.label === chipToAdd)
        return;
    }

    fetch("http://" + process.env.REACT_APP_API_URL + 'tag', {
      method: 'POST',
      headers: {
        'Authorization': "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tag: chipToAdd,
      })
    })
      .then(res => {
        if (res.ok) {
          let newChipData = chipData
          newChipData.push(({
            key: (chipData[chipData.length - 1] ? chipData[chipData.length - 1].key : -1) + 1,
            label: chipToAdd
          }));
          setChipData(newChipData);
          showChipAdd();
        }
      })
      .catch(() => {
        console.log("Fail to add tag");
      })
  };

  const showChipAdd = () => {
    if (chipAdderDisplay)
      setChipAdderDisplay(false);
    else
      setChipAdderDisplay(true);
  };

  useEffect(() => {
    if (user) {
      fetch("http://" + process.env.REACT_APP_API_URL + 'tag' + (!user.isAuth ? ('/user/' + user.id) : ''), {
        method: 'GET',
        headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
      })
        .then(res => {
          if (res.ok) {
            res.json().then((data) => {
              let newChipData = []
              data.forEach((tag, i) => {
                newChipData.push({ key: i, label: tag.tag })
              })
              setChipData(newChipData)
            })
          }
        })
        .catch(() => {
          console.log("Fail to register user to server");
        })
    }
  }, [user]);

  return (
    <Paper >
      <h3>Interests :</h3>
      <ChipsArray handleChipDelete={user.isAuth ? handleChipArrayDelete : null} chipData={chipData} />
      {user.isAuth &&
        <>
          {/* TODO : mettre animation et remplacer chip par la box (changer le format de la box pour ressemble a un chip avec textfield) */}
          <Box display={chipAdderDisplay ? 'none' : 'block'}>
            <Chip
              label='+ Add interest'
              sx={{
                width: 200,
                m: '0px 0px',
                p: '13px 0px'
              }}
              key='add-interests-link'
              color="secondary"
              onClick={showChipAdd}
            />
          </Box>
          <Box
            key='add-interests-field'
            display={chipAdderDisplay ? 'flex' : 'none'}
            sx={{
              m: '0px 15px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ width: '64px' }}></Box>
            <ChipsAdderWithAddOption handleChipArrayAdd={handleChipArrayAdd()} />
            <Button variant="contained" onClick={showChipAdd} >OK</Button>
          </Box>
        </>
      }
    </Paper>
  );
}

export default Interests;
