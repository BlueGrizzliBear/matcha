import { makeStyles } from '@mui/styles';
import { TextField, InputLabel, FilledInput, InputAdornment, IconButton, FormControl } from '@mui/material';

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

export default function InputForm(props) {
	const classes = formStyle();
	return (
		<>
			<TextField id={props.label}
				required
				label={props.label}
				value={props.values}
				onChange={props.onChange}
				autoFocus={props.autoFocus}
				autoComplete={props.label}
				type={props.type ? props.type : "text"}
				variant="filled"
				InputProps={{ classes, disableUnderline: true }}
				style={{ width: '90%', margin: props.margin ? props.margin : "8px" }} />
		</>
	);
}

export function PasswordInputForm(props) {
	const classes = formStyle();
	return (
		<>
			<FormControl
				variant="filled"
				style={{ width: '90%', margin: "8px" }}>
				<InputLabel htmlFor="filled-adornment-password" required>Password</InputLabel>
				<FilledInput
					classes={classes}
					disableUnderline={true}
					id="filled-adornment-password"
					autoComplete="current-password"
					type={props.type}
					value={props.value}
					onChange={props.onChange}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={props.onClick}
								onMouseDown={props.onMouseDown}
								edge="end"
							>
								{props.visibility}
							</IconButton>
						</InputAdornment>
					}
				/>
			</FormControl>
		</>
	);
}
