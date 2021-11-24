import React from 'react';
import { useEffect } from 'react';
import { Paper, FormControlLabel, Switch, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
  },
}));

function SexualPreferences(props) {
  const classes = useStyles();

  const { preference, editable } =
    props;
  const [man, setMan] = React.useState(false);
  const [woman, setWoman] = React.useState(false);
  const [nonBinary, setNonBinary] = React.useState(false);
  const [preferences, setPreferences] = React.useState('');

  const handleChange = (setChecked) => (event) => {
    let newPreference = ''
    if ((man && setChecked !== setMan) || (setChecked === setMan && event.target.checked))
      newPreference = 'Man'
    if ((woman && setChecked !== setWoman) || (setChecked === setWoman && event.target.checked)) {
      if (newPreference !== '')
        newPreference += '-Woman'
      else
        newPreference = 'Woman'
    }
    if ((nonBinary && setChecked !== setNonBinary) || (setChecked === setNonBinary && event.target.checked)) {
      if (newPreference !== '')
        newPreference += '-NonBinary'
      else
        newPreference = 'NonBinary'
    }
    if (newPreference === '') {
      if (setChecked === setMan) {
        newPreference = 'Woman-NonBinary'
        setWoman(true);
        setNonBinary(true);
      }
      else if (setChecked === setWoman) {
        newPreference = 'Man-NonBinary'
        setMan(true);
        setNonBinary(true);
      }
      else if (setChecked === setNonBinary) {
        newPreference = 'Man-Woman'
        setMan(true);
        setWoman(true);
      }
    }
    fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
      method: 'POST',
      headers: {
        'Authorization': "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        preference: newPreference,
      })
    })
      .then(res => {
        if (res.ok) {
          setChecked(!event.target.checked);
        }
      })
      .catch(() => {
        console.log("Fail to add tag");
      })
  };

  useEffect(() => {
    let genderText = ''
    if (man)
      genderText = 'Man'
    if (woman) {
      if (genderText === '')
        genderText += 'Woman'
      else
        genderText += ', Woman'
    }
    if (nonBinary) {
      if (genderText === '')
        genderText += 'Non-Binary'
      else
        genderText += ', Non-Binary'
    }
    setPreferences(genderText);
  }, [man, woman, nonBinary]);

  useEffect(() => {
    if (preference) {
      let preferences = preference.split('-')
      for (const orientation of preferences) {
        if (orientation === 'Man')
          setMan(true);
        else if (orientation === 'Woman')
          setWoman(true);
        else if (orientation === 'NonBinary')
          setNonBinary(true);
      }
    }
  }, [preference]);

  return (
    <Box sx={{ maxWidth: 1552, m: '0px auto' }}>
      <Paper className={classes.root}>
        <h3>Interested in :</h3>
        {editable ?
          <>
            <FormControlLabel control={<Switch disabled={!editable} checked={man} onChange={handleChange(setMan)} />} label="Man" />
            <FormControlLabel control={<Switch disabled={!editable} checked={woman} onChange={handleChange(setWoman)} />} label="Woman" />
            <FormControlLabel control={<Switch disabled={!editable} checked={nonBinary} onChange={handleChange(setNonBinary)} />} label="Non-Binary" />
          </>
          :
          <Box sx={{ paddingBottom: '10px' }}>
            {preferences}
          </Box>
        }
      </Paper>
    </Box>
  );
}

export default SexualPreferences;
