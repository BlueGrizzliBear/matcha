import React from 'react';
import { useEffect, useRef } from 'react';
import { Paper, TextField, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '13px',
    background: '#fcddec',
    border: '1px solid #e5e8ec',
    borderRadius: '15px',
    padding: '6px 10px',
    color: '#20262d',
    width: 200,
    m: '5px',
  },
}));

const parser = new DOMParser();

function Biography(props) {

  const history = useHistory();

  const classes = useStyles();
  const { bio, editable } =
    props;
  const [value, setValue] = React.useState('');
  const [editBio, setEditBio] = React.useState(true);
  let textInput = useRef(null);

  const handleEditBio = () => {
    if (editBio) {
      setEditBio(false);
    }
    else {
      fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
        method: 'POST',
        headers: {
          'Authorization': "Bearer " + localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bio: value,
        })
      })
        .then(res => {
          if (res.ok) {
            setEditBio(true);
          }
          else if (res.status === 401) {
            props.logout();
            history.push(`/`);
          }
          else {
            props.setErrorSnack('Profile biography: Wrong querry sent to the server')
            // console.log("Fail to add bio");
          }
        })
        .catch((error) => {
          props.setErrorSnack("Profile biography: Can't communicate with server")
          // console.log("Fail to add bio");
        })
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  useEffect(() => {
    if (bio) {
      const decodedString = parser.parseFromString(`<!doctype html><body>${bio}`, 'text/html').body.textContent;
      setValue(decodedString);
    }
  }, [bio]);

  useEffect(() => {
    if (!editBio) {
      textInput.current.focus();
    }
  }, [editBio])

  return (
    <Box sx={{ maxWidth: 1552, m: '0px auto' }}>
      <Paper sx={{ paddingBottom: '10px' }} >
        <h3>Biography :</h3>
        {editable ?
          <Box
            display='flex'
            sx={{
              m: '0px 15px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ width: '70px' }} />
            <Box sx={{ width: '242px' }}>
              <TextField
                fullWidth
                sx={{
                  m: '10px',
                }}
                inputRef={textInput}
                disabled={editBio}
                className={classes.root}
                id="filled-multiline-static"
                label="Biography"
                multiline
                rows={4}
                value={value}
                variant="filled"
                onChange={handleChange}
              />
            </Box>
            <Button sx={{ width: '70px' }} variant="contained" onClick={handleEditBio} >{editBio ? 'EDIT' : 'OK'}</Button>
          </Box>
          :
          <Box
            display='flex'
            sx={{
              m: '0px 15px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            {value}
          </Box>
        }
      </Paper>
    </Box>
  );
}

export default Biography;
