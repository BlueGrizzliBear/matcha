import { Component } from 'react';

import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const formStyle = makeStyles((theme) => ({
	root: {
	  border: '1px solid #e2e2e1',
	  overflow: 'hidden',
	  borderRadius: 10,
	  backgroundColor: '#fff',
	  '&:hover': {
		backgroundColor: '#fff',
	  },
	  '&$focused': {
		backgroundColor: '#fff',
		borderColor: theme.palette.primary.main,
	  },
	},
	focused: {},
}));

// function InputForm(props) {
class InputForm extends Component {

    constructor(props) {
    super(props);
  }
  
  
  render () {
  const classes = formStyle();
  return (
    <>
      <TextField	id="filled-required"
      required
      label={this.props.label}
      variant="filled"
      InputProps={{ classes, disableUnderline: true }}
      style={{ width: '90%', margin: "8px" }}/>
    </>
  );
}
}

export default InputForm;
