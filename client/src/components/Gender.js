import React from 'react';
import { useEffect } from 'react';
import { Paper, Slider, Box } from '@mui/material';
import { useHistory } from "react-router-dom";

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

  const history = useHistory();

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
        else if (res.status === 401) {
          props.logout();
          history.push(`/`);
        }
        else {
          console.log("Fail to change user gender");
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Fail to change user gender");
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
    <Box sx={{ maxWidth: 1552, m: '0px auto' }}>
      <Paper >
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
    </Box>
  );
}

export default Gender;
