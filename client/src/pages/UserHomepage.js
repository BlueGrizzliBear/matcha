import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Link, Box, TablePagination, MenuItem, Typography, Paper, List, ListItemButton, ListItemAvatar, Avatar, TextField, Slider, Button, Chip, Popover, Menu } from '@mui/material';
import { useHistory } from "react-router-dom";
import calculateAge from '../utility/utilities'
import ChipsArray from '../components/ChipsArray'

const year = new Date().getFullYear()

const ListItem = styled('li')(({ theme }) => ({
	margin: theme.spacing(0.5),
}));

function createData(id, username, firstname, lastname, birth_date, gender, preference, city, country, bio, img0_path, fame, tags, proximity, common_tags, match) {
	return {
		id,
		username,
		firstname,
		lastname,
		birth_date,
		gender,
		preference,
		city,
		country,
		bio,
		img0_path,
		fame,
		tags,
		proximity,
		common_tags,
		match
	};
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function valuetext(value) {
	return `${value}`;
}

function EnhancedSearchBar(props) {

	const [anchorAgeEl, setAnchorAgeEl] = React.useState(null);
	const [anchorSortEl, setAnchorSortEl] = React.useState(null);
	const [anchorFameEl, setAnchorFameEl] = React.useState(null);
	const [anchorLocationEl, setAnchorLocationEl] = React.useState(null);
	const [anchorInterestsEl, setAnchorInterestsEl] = React.useState(null);
	const [age, setAge] = React.useState(null)
	const [fame, setFame] = React.useState(null)
	const [location, setLocation] = React.useState(null)
	const [tags, setTags] = React.useState(null)
	const [inputValues, setInputValues] = useState({
		city: '',
		country: '',
	});

	const { onRequestSort } =
		props;
	const { fetchMatchUserList } =
		props;
	const createSortHandler = (property, orderProp) => (event) => {
		onRequestSort(event, property, orderProp);
		setAnchorSortEl(null);
		setSort(event.target.value);
	};
	const [ageValue, setAgeValue] = React.useState([18, 100]);
	const [fameValue, setFameValue] = React.useState([0.0, 1.0]);

	const handleAgeChange = (event, newValue) => {
		setAgeValue(newValue);
	};
	const handleFameChange = (event, newValue) => {
		setFameValue(newValue);
	};

	const [sort, setSort] = React.useState(null);

	const handleClick = (setAnchorEl) => (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (setAnchorEl) => (event) => {
		setAnchorEl(null);
	};

	const handleChipAgeDelete = () => {
		setAge(null);
		setAgeValue([18, 100]);
	};

	const handleAgeSearch = () => {
		setAge({ min: year - ageValue[0], max: year - ageValue[1] });
		setAnchorAgeEl(null);
	};

	const handleChipFameDelete = () => {
		setFame(null);
		setFameValue([0.0, 1.0]);
	};

	const handleFameSearch = () => {
		setFame({ min: fameValue[0], max: fameValue[1] });
		setAnchorFameEl(null);
	};

	const handleChipSortDelete = (event) => {
		onRequestSort(event, 'match', 'desc');
		setSort(null);
	};

	const handleLocationSearch = () => {
		setLocation({ city: inputValues.city, country: inputValues.country })
		setAnchorLocationEl(null);
	};

	const handleChipLocationDelete = (event) => {
		setLocation(null);
	};

	const openAge = Boolean(anchorAgeEl);
	const openSort = Boolean(anchorSortEl);
	const openFame = Boolean(anchorFameEl);
	const openLocation = Boolean(anchorLocationEl);
	const openInterests = Boolean(anchorInterestsEl);
	const idAge = openAge ? 'simple-age-popover' : undefined;
	const idFame = openFame ? 'simple-fame-popover' : undefined;
	const idLocation = openLocation ? 'simple-location-popover' : undefined;
	const idInterests = openInterests ? 'simple-interests-popover' : undefined;

	const handleInputChange = (prop) => (event) => {
		setInputValues({ ...inputValues, [prop]: event.target.value });
	};

	useEffect(() => {
		fetchMatchUserList(age, fame, location, tags);
	}, [fetchMatchUserList, age, fame, location, tags])

	return (
		<Paper sx={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			flexWrap: 'wrap',
			p: 0.5,
			m: '10px 0',
		}}>
			<Box sx={{
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				listStyle: 'none',
				p: 0.5,
				m: 0,
			}} component="ul"
			>
				<ListItem key='age-list-item'>
					<Chip label="Age" onClick={handleClick(setAnchorAgeEl)} onDelete={age && handleChipAgeDelete} />
				</ListItem>
				<Popover
					id={idAge}
					open={openAge}
					anchorEl={anchorAgeEl}
					onClose={handleClose(setAnchorAgeEl)}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<Box sx={{ m: 2 }} >
						<Slider
							sx={{ width: 200, m: '25px 10px' }}
							getAriaLabel={() => 'Age'}
							value={ageValue}
							step={1}
							min={18}
							max={100}
							onChange={handleAgeChange}
							valueLabelDisplay="on"
							getAriaValueText={valuetext}
						/>
						<Box />
						<Button variant="contained" onClick={handleAgeSearch} >OK</Button>
					</Box>
				</Popover>
				<ListItem key='fame-list-item'>
					<Chip label="Fame" onClick={handleClick(setAnchorFameEl)} onDelete={fame && handleChipFameDelete} />
				</ListItem>
				<Popover
					id={idFame}
					open={openFame}
					anchorEl={anchorFameEl}
					onClose={handleClose(setAnchorFameEl)}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<Box sx={{ m: 2 }} >
						<Slider
							sx={{ width: 200, m: '25px 10px' }}
							getAriaLabel={() => 'Fame'}
							value={fameValue}
							step={0.1}
							min={0.0}
							max={1.0}
							onChange={handleFameChange}
							valueLabelDisplay="on"
							getAriaValueText={valuetext}
						/>
						<Box />
						<Button variant="contained" onClick={handleFameSearch}>OK</Button>
					</Box>
				</Popover>
				<ListItem key='location-list-item'>
					<Chip label="Location" onClick={handleClick(setAnchorLocationEl)} onDelete={location && handleChipLocationDelete} />
				</ListItem>
				<Popover
					id={idLocation}
					open={openLocation}
					anchorEl={anchorLocationEl}
					onClose={handleClose(setAnchorLocationEl)}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<Box sx={{ m: 2 }} >
						<TextField id="outlined-basic" label="City" value={inputValues.city} onChange={handleInputChange('city')} variant="outlined" />
						<Box />
						<TextField id="outlined-basic" label="Country" value={inputValues.country} onChange={handleInputChange('country')} variant="outlined" />
						<Box />
						<Button variant="contained" onClick={handleLocationSearch}>OK</Button>
					</Box>
				</Popover>

				<ListItem key='interests-list-item'>
					<Chip label="Interests" onClick={handleClick(setAnchorInterestsEl)} />
				</ListItem>
				<Popover
					id={idInterests}
					open={openInterests}
					anchorEl={anchorInterestsEl}
					onClose={handleClose(setAnchorInterestsEl)}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<Box sx={{ m: 2 }} >
						<ChipsArray />
						<Box sx={{
							m: 2,
							display: 'flex',
							justifyContent: 'space-between',
							flexWrap: 'wrap'
						}} >
							<Link>+ Add interest</Link>
							<Button variant="contained" >OK</Button>
						</Box>
					</Box>

				</Popover>

				<ListItem key='sort-list-item'>
					<Chip label="Sort" onClick={handleClick(setAnchorSortEl)} onDelete={sort && handleChipSortDelete} />
				</ListItem>
				<Menu
					id="basic-menu"
					anchorEl={anchorSortEl}
					open={openSort}
					onClose={handleClose(setAnchorSortEl)}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem selected={sort === 1} onClick={createSortHandler('birth_date', 'desc')} value={1}>Age, low to high</MenuItem>
					<MenuItem selected={sort === 2} onClick={createSortHandler('birth_date', 'asc')} value={2}>Age, high to low</MenuItem>
					<MenuItem selected={sort === 3} onClick={createSortHandler('fame', 'asc')} value={3}>Fame, low to high</MenuItem>
					<MenuItem selected={sort === 4} onClick={createSortHandler('fame', 'desc')} value={4}>Fame, high to low</MenuItem>
					<MenuItem selected={sort === 5} onClick={createSortHandler('proximity', 'asc')} value={5}>Location, closer to farther</MenuItem>
					<MenuItem selected={sort === 6} onClick={createSortHandler('proximity', 'desc')} value={6}>Location, farther to closer</MenuItem>
					<MenuItem selected={sort === 7} onClick={createSortHandler('common_tags', 'desc')} value={7}>Common interests</MenuItem>
				</Menu>
			</Box >
			<Button sx={{ width: 200, alignSelf: 'center' }} variant="contained">Find Match</Button>
		</Paper >
	);
}

function UserHomepage() {
	const history = useHistory();
	const [order, setOrder] = React.useState('desc');
	const [rows, setRows] = React.useState([]);
	const [orderBy, setOrderBy] = React.useState('match');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (event, property, orderProp) => {
		setOrder(orderProp);
		setOrderBy(property);
	};

	const handleClick = (event, link) => {
		event.preventDefault();
		history.push(`/profile/` + link);

	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const fetchMatchUserList = useCallback((age = null, fame = null, location = null, tags = null) => {
		let set = {};
		if (age) {
			set.agemin = age.min;
			set.agemax = age.max;
		}
		if (fame) {
			set.famemin = fame.min;
			set.famemax = fame.max;
		}
		if (location) {
			set.city = location.city;
			set.country = location.country;
		}
		if (tags)
			set.tags = tags;
		fetch("http://" + process.env.REACT_APP_API_URL + "user/find_match", {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + localStorage.getItem("token") },
			body: JSON.stringify(set)
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((fetchData) => {
						let rowsData = [];
						for (const data of fetchData) {
							rowsData.push(createData(data.id, data.username, data.firstname, data.lastname, data.birth_date, data.gender, data.preference, data.city, data.country, data.bio, data.img0_path, data.fame, data.tags, data.proximity, data.common_tags, data.match_score))
						}
						setPage(0);
						setRows(rowsData);
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
	}, [])

	useEffect(() => {
		fetchMatchUserList()
	}, [fetchMatchUserList])

	// Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows =
	// 	page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<Box sx={{ margin: 2 }}>
			<EnhancedSearchBar
				onRequestSort={handleRequestSort}
				fetchMatchUserList={fetchMatchUserList}
			/>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<List>
					{stableSort(rows, getComparator(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row, index) => {

							return (
								<ListItemButton key={'list-item-button' + index} onClick={(event) => handleClick(event, row.username)}>
									<ListItemAvatar>
										<Avatar sx={{ width: 100, height: 100 }} alt={row.firstname + ' ' + row.lastname} src={row.img0_path} />
									</ListItemAvatar>
									<ListItem>
										<Box>
											<Typography>{row.firstname + ' ' + row.lastname + ', ' + calculateAge(row.birth_date)}</Typography>
											<Typography>{row.gender + ' interested in ' + row.preference}</Typography>
											<Typography>{'Lives in ' + row.city + ', ' + row.country}</Typography>
											<Typography>{row.bio}</Typography>
											<Typography>{row.tags && ('Interests: ' + row.tags)}</Typography>
											<Typography>{'Fame: ' + row.fame}</Typography>
										</Box>
									</ListItem>
								</ListItemButton>
							);
						})}
					{/* {emptyRows > 0 && (
						<TableRow
							style={{
								height: (dense ? 33 : 53) * emptyRows,
							}}
						>
							<TableCell colSpan={6} />
						</TableRow>
					)} */}
					{/* {!emptyRows && (
						<ListItem disablePadding>
							<p>No results</p>
						</ListItem>
					)} */}
				</List>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
}

export default UserHomepage;
