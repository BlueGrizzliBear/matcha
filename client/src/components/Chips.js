import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Chip, Paper, Autocomplete, TextField } from '@mui/material';

const ListItem = styled('li')(({ theme }) => ({
	margin: theme.spacing(0.5),
}));

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
				renderInput={(params) => <TextField variant="standard" {...params} label="Add Chip" />}
			/>
		</Box>
	)
}

export function ChipsArray(props) {
	const { chipData, handleChipDelete } =
		props;

	return (
		<Paper
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
			{chipData.map((data) => {
				return (
					<ListItem key={data.key}>
						<Chip
							label={data.label}
							onDelete={handleChipDelete(data)}
						/>
					</ListItem>
				);
			})}
		</Paper>
	);
}
