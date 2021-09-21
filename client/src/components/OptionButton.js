import React from 'react';

import { IconButton, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const options = ['Edit', 'Delete'];

const OptionButton = React.forwardRef((props, ref) => {
	// function OptionButton(props) {

	const [open, setOpen] = React.useState(false);
	const [anchorRef, setAnchorRef] = React.useState(null);

	const popperRef = React.createRef(null);

	const MyGrow = React.forwardRef((props, ref) => {
		return <Grow ref={ref} {...props} />;
	});

	const handleMenuItemClick = (event, index) => {
		console.info(`You clicked ${options[index]}`);
		if (index === 0) {
			ref.current.click(ref.id);
			// props.onClick();
			// props.myfunction(event, ref);
		}
		// props.handleFileUpload();
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
				style={{ background: 'rgba(229,230,235,0.1)', padding: '5px', margin: 'auto 7px' }}
			>
				<MoreVertIcon style={{ color: 'rgba(5,5,5,1)', top: '0' }} />
			</IconButton>
			<Popper
				open={open}
				anchorEl={anchorRef}
				role={undefined}
				placement={'bottom-end'}
				transition
				disablePortal={false}
				modifiers={{
					flip: {
						enabled: false
					},
					preventOverflow: {
						enabled: true,
						boundariesElement: 'scrollParent'
					}
				}}
				ref={popperRef}
				transitioncomponent={MyGrow}
			>
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
			</Popper>
		</>
	);
}
)
export default OptionButton;
