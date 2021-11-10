import React from 'react';
import { Box, TablePagination, MenuItem, Typography, Paper, InputLabel, Select, List, ListItem, ListItemButton, ListItemAvatar, Avatar, TextField, Slider, FormControl } from '@mui/material';
import { useHistory } from "react-router-dom";
import calculateAge from '../utility/utilities'

const fetchData = [
	{
		"id": 225,
		"username": "bpetti68",
		"firstname": "Blakelee",
		"lastname": "Petti",
		"birth_date": "1997-04-28T00:00:00.000Z",
		"gender": "Woman",
		"preference": "Man",
		"city": "Avignon",
		"country": "France",
		"gps_lat": 43.939352,
		"gps_long": 4.81568,
		"bio": "Grass-roots optimal utilisation",
		"complete": 1,
		"img0_path": "https://images.unsplash.com/photo-1584625881399-60d94b0e8890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bm9uYmluYXJ5fHx8fHx8MTYzNjQ3OTk4Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 176.29308287458545,
		"common_tags": 0,
		"fame": 0,
		"match_score": 56.723723001168345
	},
	{
		"id": 471,
		"username": "jsurmond2",
		"firstname": "Jacquette",
		"lastname": "Surmon",
		"birth_date": "1990-12-15T00:00:00.000Z",
		"gender": "Woman",
		"preference": "Man-Woman-NonBinary",
		"city": "Dijon",
		"country": "France",
		"gps_lat": 47.317743,
		"gps_long": 5.037793,
		"bio": "Configurable bandwidth-monitored solution",
		"complete": 1,
		"img0_path": "https://images.unsplash.com/photo-1584625881399-60d94b0e8890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bm9uYmluYXJ5fHx8fHx8MTYzNjQ4MDAwMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 199.81051236221478,
		"common_tags": 0,
		"fame": 0,
		"match_score": 50.0474168339656
	},
	{
		"id": 564,
		"username": "vkersleyfn",
		"firstname": "Viki",
		"lastname": "Kersley",
		"birth_date": "1994-11-19T00:00:00.000Z",
		"gender": "Woman",
		"preference": "Man-Woman",
		"city": "Lyon",
		"country": "France",
		"gps_lat": 45.732398,
		"gps_long": 4.835571,
		"bio": "Optional needs-based neural-net",
		"complete": 1,
		"img0_path": "https://images.unsplash.com/photo-1626199844140-b72d93057839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bm9uYmluYXJ5fHx8fHx8MTYzNjQ4MDA4Mg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 23.390968417376378,
		"common_tags": 0,
		"fame": 0,
		"match_score": 427.51543337433304
	},
	{
		"id": 1002,
		"username": "Olivier",
		"firstname": "Olivier",
		"lastname": "LIDON",
		"birth_date": "1989-08-03T00:00:00.000Z",
		"gender": "Man",
		"preference": "Man-Woman-NonBinary",
		"city": "Givors",
		"country": "France",
		"gps_lat": 45.5844238,
		"gps_long": 4.7696529,
		"bio": null,
		"complete": 1,
		"img0_path": "http://localhost:9000/upload/10021636044536129-341327870.jpg",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 10.790655213362438,
		"common_tags": 0,
		"fame": 0,
		"match_score": 926.7277845757371
	},
	{
		"id": 225,
		"username": "bpetti68",
		"firstname": "Blakelee",
		"lastname": "Petti",
		"birth_date": "1997-04-28T00:00:00.000Z",
		"gender": "Woman",
		"preference": "Man",
		"city": "Avignon",
		"country": "France",
		"gps_lat": 43.939352,
		"gps_long": 4.81568,
		"bio": "Grass-roots optimal utilisation",
		"complete": 1,
		"img0_path": "https://images.unsplash.com/photo-1584625881399-60d94b0e8890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bm9uYmluYXJ5fHx8fHx8MTYzNjQ3OTk4Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 176.29308287458545,
		"common_tags": 0,
		"fame": 0,
		"match_score": 56.723723001168345
	},
	{
		"id": 471,
		"username": "jsurmond2",
		"firstname": "Jacquette",
		"lastname": "Surmon",
		"birth_date": "1990-12-15T00:00:00.000Z",
		"gender": "Woman",
		"preference": "Man-Woman-NonBinary",
		"city": "Dijon",
		"country": "France",
		"gps_lat": 47.317743,
		"gps_long": 5.037793,
		"bio": "Configurable bandwidth-monitored solution",
		"complete": 1,
		"img0_path": "https://images.unsplash.com/photo-1584625881399-60d94b0e8890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bm9uYmluYXJ5fHx8fHx8MTYzNjQ4MDAwMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 199.81051236221478,
		"common_tags": 0,
		"fame": 0,
		"match_score": 50.0474168339656
	},
	{
		"id": 564,
		"username": "vkersleyfn",
		"firstname": "Viki",
		"lastname": "Kersley",
		"birth_date": "1994-11-19T00:00:00.000Z",
		"gender": "Woman",
		"preference": "Man-Woman",
		"city": "Lyon",
		"country": "France",
		"gps_lat": 45.732398,
		"gps_long": 4.835571,
		"bio": "Optional needs-based neural-net",
		"complete": 1,
		"img0_path": "https://images.unsplash.com/photo-1626199844140-b72d93057839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bm9uYmluYXJ5fHx8fHx8MTYzNjQ4MDA4Mg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 23.390968417376378,
		"common_tags": 0,
		"fame": 0,
		"match_score": 427.51543337433304
	},
	{
		"id": 1002,
		"username": "Olivier",
		"firstname": "Olivier",
		"lastname": "LIDON",
		"birth_date": "1989-08-03T00:00:00.000Z",
		"gender": "Man",
		"preference": "Man-Woman-NonBinary",
		"city": "Givors",
		"country": "France",
		"gps_lat": 45.5844238,
		"gps_long": 4.7696529,
		"bio": null,
		"complete": 1,
		"img0_path": "http://localhost:9000/upload/10021636044536129-341327870.jpg",
		"img1_path": null,
		"img2_path": null,
		"img3_path": null,
		"img4_path": null,
		"watches": 1,
		"likes": 0,
		"tags_id": null,
		"tags": null,
		"proximity": 10.790655213362438,
		"common_tags": 0,
		"fame": 0,
		"match_score": 926.7277845757371
	}
]

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

var rows = [];

for (const data of fetchData) {
	rows.push(createData(data.id, data.username, data.firstname, data.lastname, data.birth_date, data.gender, data.preference, data.city, data.country, data.bio, data.img0_path, data.fame, data.tags, data.proximity, data.common_tags, data.match_score))
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
	const { onRequestSort } =
		props;
	const createSortHandler = (property, orderProp) => (event) => {
		onRequestSort(event, property, orderProp);
	};
	const [ageValue, setAgeValue] = React.useState([18, 120]);
	const [fameValue, setFameValue] = React.useState([0, 1]);

	const handleAgeChange = (event, newValue) => {
		setAgeValue(newValue);
	};
	const handleFameChange = (event, newValue) => {
		setFameValue(newValue);
	};

	const [sort, setSort] = React.useState('');

	const handleSortChange = (event) => {
		setSort(event.target.value);
	};

	return (
		<Paper>
			<Box sx={{ m: 3 }} />
			<Typography gutterBottom>Age</Typography>
			<Slider
				getAriaLabel={() => 'Age'}
				value={ageValue}
				step={1}
				min={18}
				max={120}
				onChange={handleAgeChange}
				valueLabelDisplay="on"
				getAriaValueText={valuetext}
			/>
			<Box sx={{ m: 3 }} />
			<Typography gutterBottom>Fame</Typography>
			<Slider
				getAriaLabel={() => 'Fame'}
				value={fameValue}
				step={0.1}
				min={0.0}
				max={1}
				onChange={handleFameChange}
				valueLabelDisplay="on"
				getAriaValueText={valuetext}
			/>
			<TextField id="outlined-basic" label="City" variant="outlined" />
			<TextField id="outlined-basic" label="Country" variant="outlined" />
			<TextField id="outlined-basic" label="Interests" variant="outlined" />
			<FormControl fullWidth>

				<InputLabel id="simple-select-label">Sort</InputLabel>
				<Select
					labelId="simple-select-label"
					id="simple-select"
					value={sort}
					label="Sort"
					onChange={handleSortChange}
				>
					<MenuItem onClick={createSortHandler('birth_date', 'desc')} value={1}>Age, low to high</MenuItem>
					<MenuItem onClick={createSortHandler('birth_date', 'asc')} value={2}>Age, high to low</MenuItem>
					<MenuItem onClick={createSortHandler('fame', 'desc')} value={3}>Fame, low to high</MenuItem>
					<MenuItem onClick={createSortHandler('fame', 'asc')} value={4}>Fame, high to low</MenuItem>
					<MenuItem onClick={createSortHandler('proximity', 'asc')} value={5}>Location, closer to farther</MenuItem>
					<MenuItem onClick={createSortHandler('proximity', 'desc')} value={6}>Location, farther to closer</MenuItem>
					<MenuItem onClick={createSortHandler('common_tags', 'desc')} value={7}>Interests</MenuItem>
				</Select>
			</FormControl>
		</Paper>
	);

}

function UserHomepage() {
	const history = useHistory();
	const [order, setOrder] = React.useState('desc');
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

	// useEffect(() => {
	// 	for (const data of fetchData) {
	// 		rows.push(createData(data.id, data.username, data.firstname, data.lastname, data.birth_date, data.gender, data.preference, data.city, data.country, data.bio, data.img0_path, data.fame, data.tags))
	// 	}
	// })

	// Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows =
	// 	page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<Box sx={{ width: '100%' }}>
			<EnhancedSearchBar
				onRequestSort={handleRequestSort}
			/>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<List>
					{stableSort(rows, getComparator(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row, index) => {

							return (
								<ListItemButton disablePadding onClick={(event) => handleClick(event, row.username)}>
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
