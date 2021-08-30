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
  disableUnderline: true
}));

function InputForm(props) {
  const classes = formStyle();
  return (
    <>
      <TextField	id="filled-required"
                  required
                  label={ props.label}
                  type={ props.type ? props.type : "string"  }
                  variant="filled"
                  InputProps={{ classes, disableUnderline: true}}
                  style={{ width: '90%', margin: props.margin ? props.margin : "8px" }}/>
    </>
  );
}

export default InputForm;
