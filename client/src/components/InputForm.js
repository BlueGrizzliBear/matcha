import { makeStyles } from '@mui/styles';
import { TextField, InputLabel, FilledInput, InputAdornment, IconButton, FormControl, FormHelperText } from '@mui/material';

const formStyle = (props) => makeStyles((theme) => ({
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
			borderColor: (props.error ? theme.palette.error.main : theme.palette.primary.main),
		},
	},
	focused: {},
}));

export default function InputForm(props) {
	const classes = formStyle(props)();
	return (
		<>
			<TextField
				{...props}
				required
				autoComplete={props.label}
				variant="filled"
				InputProps={{ classes, disableUnderline: true }}
				style={{
					width: '90%',
					margin: props.label === 'Firstname' ? "8px 8px 40px 8px" : "8px",
				}}
			/>
		</>
	);
}

export function PasswordInputForm(props) {
	const classes = formStyle(props)();
	return (
		<>
			<FormControl
				variant="filled"
				style={{ width: '90%', margin: "8px" }}
			>
				<InputLabel error={props.error} htmlFor="filled-adornment-password" required>Password</InputLabel>
				<FilledInput
					{...props.filledInputProps}
					classes={classes}
					// error={props.error}
					disableUnderline={true}
					autoComplete="current-password"
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								{...props.iconButtonProps}
								aria-label="toggle password visibility"
								edge="end"
							>
								{props.visibility}
							</IconButton>
						</InputAdornment>
					}
				/>
				{props.error && <FormHelperText error={props.error}>
					{props.helpertext}
				</FormHelperText>}
			</FormControl>
		</>
	);
}
