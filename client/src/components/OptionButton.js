import React from 'react';

import { IconButton, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const options = ['Edit', 'Delete'];

const OptionButton = React.forwardRef((props, ref) => {

	const [open, setOpen] = React.useState(false);
	const [anchorRef, setAnchorRef] = React.useState(null);

	const handleMenuItemClick = (event, index) => {
		console.info(`You clicked ${options[index]}`);
		if (options[index] === 'Edit') {
			ref.current.click(ref.id);
		}
		if (options[index] === 'Delete') {
			props.handleFileDelete(props.item.title);
		}
		setOpen(false);
	};

	const handleToggle = (event) => {
		setAnchorRef(event.currentTarget);
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	return (
		<>
			<IconButton
				aria-controls={open ? 'split-button-menu' : undefined}
				aria-expanded={open ? 'true' : undefined}
				onClick={handleToggle}
				aria-label={`edit ${props.item.title}`}
				position="top"
				actionposition="right"
				style={{ background: 'rgba(229,230,235,0.1)', padding: '5px', margin: '7px 7px' }}
			>
				<MoreVertIcon style={{ color: 'rgba(5,5,5,1)', top: '0' }} />
			</IconButton>
			<Popper
				open={open}
				anchorEl={anchorRef}
				placement="bottom-end"
				transition
				disablePortal={false}
				modifiers={[
					{ name: 'flip', enabled: false },
					{ name: 'preventOverflow', enabled: true, options: { boundariesElement: 'scrollParent' }}
				]}
			>
				{({ TransitionProps }) => (
					<Grow {...TransitionProps} timeout={350}>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList id="split-button-menu">
									{options.map((option, index) => (
										<MenuItem key={option} onClick={(event) => handleMenuItemClick(event, index)}>
											{option}
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</>
	);
}
)
export default OptionButton;
