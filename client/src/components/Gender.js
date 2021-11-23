import React from 'react';
import { useEffect } from 'react';
import { Paper, Slider, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
  },
}));

const marks = [
  {
    value: 0,
    label: 'Man',
  },
  {
    value: 50,
    label: 'Woman',
  },
  {
    value: 100,
    label: 'Non-Binary',
  },
];

function valuetext(value) {
  return `${value}`;
}

function Gender(props) {
  const classes = useStyles();
  const { gender, editable } =
    props;
  const [value, setValue] = React.useState(100);


  const handleValueChange = (event, newValue) => {
    let newGender = '';
    if (newValue === 0)
      newGender = 'Man';
    else if (newValue === 50)
      newGender = 'Woman';
    else if (newValue === 100)
      newGender = 'NonBinary';
    fetch("http://" + process.env.REACT_APP_API_URL + 'user', {
      method: 'POST',
      headers: {
        'Authorization': "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gender: newGender,
      })
    })
      .then(res => {
        if (res.ok) {
          setValue(newValue);
        }
      })
      .catch(() => {
        console.log("Fail to add tag");
      })
  };

  useEffect(() => {
    if (gender === 'Man')
      setValue(0);
    else if (gender === 'Woman')
      setValue(50);
    else if (gender === 'NonBinary')
      setValue(100);
  }, [gender]);

  return (
    <Paper className={classes.root}>
      <h3>Gender :</h3>
      {editable ?
        <Slider
          sx={{ width: 200 }}
          track={false}
          onChange={handleValueChange}
          aria-label="Restricted values"
          value={value}
          getAriaValueText={valuetext}
          step={null}
          marks={marks}
        />
        :
        <Box sx={{ paddingBottom: '10px' }}>
          {gender}
        </Box>
      }
    </Paper>
  );
}

export default Gender;
