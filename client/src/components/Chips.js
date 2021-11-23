import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { Box, Chip, Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

const ListItem = styled('li')(({ theme }) => ({
	margin: theme.spacing(0.5),
}));

const filter = createFilterOptions();


export function ChipsAdder(props) {
	const [value, setValue] = React.useState(null);
	const [inputValue, setInputValue] = React.useState('');
	const [options, setOptions] = React.useState([]);
	const { handleChipArrayAdd, showChipAdd } =
		props;

	const fetchChipList = useCallback((letter) => {
		fetch("http://" + process.env.REACT_APP_API_URL + "tag/search/" + letter, {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((fetchData) => {
						setOptions(fetchData)
					})
				}
				else {
					console.log("Fail to get notifications");
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to fetch");
			})
	}, []);

	useEffect(() => {
		if (inputValue === '') {
			setOptions([]);
			return undefined;
		}
		if (inputValue.length === 1)
			fetchChipList(inputValue);
	}, [fetchChipList, inputValue])

	return (
		<Box sx={{ width: 200 }} display={props.display}>
			<Autocomplete
				id="free-solo-demo"
				autoComplete
				includeInputInList
				filterSelectedOptions
				value={value}
				onChange={(event, newValue) => {
					handleChipArrayAdd(newValue);
					showChipAdd();
					setValue(null);
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				options={options.map((option) => option.tag)}
				renderInput={(params) => <TextField variant="standard" {...params} inputProps={{ ...params.inputProps, maxLength: 30 }} label="Add Chip" />}
			/>
		</Box>
	)
}

const useStyles = makeStyles((theme) => ({
	root: {
		fontSize: '13px',
		background: '#fcddec',
		border: '1px solid #e5e8ec',
		borderRadius: '15px',
		padding: '6px 10px',
		color: '#20262d',
		width: 200,
		m: '5px'
	},
}));

export function ChipsAdderWithAddOption(props) {
	const classes = useStyles();
	const [value, setValue] = React.useState(null);
	const [inputValue, setInputValue] = React.useState('');
	const [options, setOptions] = React.useState([]);
	const { handleChipArrayAdd, inputRef } =
		props;

	const fetchChipList = useCallback((letter) => {
		fetch("http://" + process.env.REACT_APP_API_URL + "tag/search/" + letter, {
			method: 'GET',
			headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((fetchData) => {
						setOptions(fetchData)
					})
				}
				else {
					console.log("Fail to get notifications");
				}
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to fetch");
			})
	}, []);

	useEffect(() => {
		if (inputValue === '') {
			setOptions([]);
			return undefined;
		}
		if (inputValue.length === 1)
			fetchChipList(inputValue);
	}, [fetchChipList, inputValue])

	return (
		<Box sx={{ m: '10px' }} display={props.display}>
			<Autocomplete
				className={classes.root}
				value={value}
				onChange={(event, newValue) => {
					if (typeof newValue === 'string') {
						handleChipArrayAdd(newValue);
					} else if (newValue && newValue.inputValue) {
						// Create a new value from the user input
						handleChipArrayAdd(newValue.inputValue);
					} else {
						if (newValue)
							handleChipArrayAdd(newValue.tag);
					}
					setValue(null);
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				filterOptions={(options, params) => {
					const filtered = filter(options, params);

					const { inputValue } = params;
					// Suggest the creation of a new value
					const isExisting = options.some((option) => inputValue === option.tag);
					if (inputValue !== '' && !isExisting) {
						filtered.push({
							inputValue,
							tag: `Add "${inputValue}"`,
						});
					}

					return filtered;
				}}
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				id="free-solo-with-text-demo"
				options={options}
				getOptionLabel={(option) => {
					// Value selected with enter, right from the input
					if (typeof option === 'string') {
						return option;
					}
					// Add "xxx" option created dynamically
					if (option.inputValue) {
						return option.inputValue;
					}
					// Regular option
					return option.tag;
				}}
				size="small"
				renderOption={(props, option) => <li {...props}>{option.tag}</li>}
				freeSolo
				renderInput={(params) => <TextField inputRef={inputRef} variant="standard" {...params} inputProps={{ ...params.inputProps, maxLength: 30 }} label="Add Chip" />}
			/>
		</Box>
	)
}

export function ChipsArray(props) {
	const { chipData, handleChipDelete } =
		props;
	const [chipList, setChipList] = React.useState([]);

	useEffect(() => {
		setChipList(chipData);
	}, [chipData]);

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				listStyle: 'none',
				p: 0.5,
				m: 0,
			}}
			component="ul"
		>
			{chipList.map((data) => {
				return (
					<ListItem key={data.key}>
						<Chip
							label={data.label}
							onDelete={handleChipDelete ? handleChipDelete(data) : null}
							color="secondary"
						/>
					</ListItem>
				);
			})}
		</Box>
	);
}
