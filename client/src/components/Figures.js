import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Box, Chip, Stack, Tooltip, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LikeButton from './LikeButton';
import { Chat as ChatIcon, Visibility as VisibilityIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import Chat from './Chat'
import NameBirthEmail from './NameBirthEmail'
import Location from './Location'
import BlockReportMenu from './BlockReportMenu'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		overflow: 'hidden',
		margin: '0px 11px',
		'@media screen and (min-width: 768px)': {
			margin: '0px 18px',
		},
		'@media screen and (min-width: 1552px)': {
			margin: '0px auto',
		}
	},
	FigureRoot: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignItems: 'center',
		overflow: 'hidden',
	},
}));

function Figures({ user, editable, likeable, updateUser, ...props }) {

	const classes = useStyles();
	const [anchorChatEl, setAnchorChatEl] = useState(null);
	const openChat = Boolean(anchorChatEl);
	const [receiverId, setReceiverId] = useState(null);
	const [isOnline, setIsOnline] = useState({ id: null, online: false });
	const [mutualLike, setMutualLike] = useState(false);
	const [liking, setLiking] = useState(false);
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(0);
	const [watches, setWatches] = useState(0);

	const handleChatClick = (event) => {
		setAnchorChatEl(props.footerref.current);
		setReceiverId(user.id);
	};

	const handleChatClose = () => {
		setReceiverId(null);
		setAnchorChatEl(null);
	};

	useEffect(() => {
		if (user.liking)
			setLiking(user.liking);
	}, [user.liking]);

	useEffect(() => {
		if (user.liked)
			setLiked(user.liked);
	}, [user.liked]);

	useEffect(() => {
		if (liking && liked)
			setMutualLike(true);
		else
			setMutualLike(false);
	}, [liking, liked]);

	useEffect(() => {
		if (user.watches)
			setWatches(user.watches);
	}, [user.watches]);

	useEffect(() => {
		if (user.likes)
			setLikes(user.likes);
	}, [user.likes]);

	const listenMessages = useCallback((msg, isCancelled) => {
		msg = JSON.parse(msg.data);
		if (!isCancelled && msg && msg.type === "Online" && msg.user) {
			setIsOnline(msg);
		}
		if (!isCancelled && msg && msg.type === "Like") {
			setLikes(prevLikes => prevLikes + 1);
		}

		if (!isCancelled && msg && msg.type === "Like" && msg.from === user.id) {
			setLiked(true);
		}
		if (!isCancelled && msg && msg.type === "Unlike" && msg.from === user.id) {
			setLiked(false);
		}
		if (!isCancelled && msg && msg.type === "Unlike") {
			setLikes(prevLikes => prevLikes - 1);
		}
		if (!isCancelled && msg && msg.type === "Watches") {
			setWatches(prevWatches => prevWatches + 1);
		}
	}, [user.id])

	useEffect(() => {
		let isCancelled = false;
		if (props.websocket != null) {
			props.websocket.addEventListener('message', (event) => {
				listenMessages(event, isCancelled)
			});
		}
		if (user.id && props.websocket != null)
			props.websocket.send(JSON.stringify({ isUserOnline: user.id }))
		return () => {
			isCancelled = true;
		};
	}, [props.websocket, listenMessages, user.id]);

	return (
		<>
			<Box sx={{ maxWidth: 1552 }} className={classes.root}>
				<Stack direction="column" spacing={1}>
					<NameBirthEmail {...props} isOnline={isOnline} user={user} editable={editable} updateUser={updateUser} {...props} />
					<Location {...props} user={user} editable={editable} updateUser={updateUser} />
				</Stack>
				{likeable ?
					<Stack>
						<LikeButton liking={user.liking} setliking={setLiking} {...props} />
					</Stack>
					:
					<></>
				}
				<Stack sx={{ 'marginRight': '12px' }} direction="row" spacing={2} justifyContent='flex-start' alignItems="center">
					{editable ?
						<>
							<Tooltip title="Who liked you">
								<Chip icon={<FavoriteIcon />} color={"primary"} label={likes} clickable sx={{ fontSize: "20px" }} />
							</Tooltip>
							<Tooltip title="Who saw your profile">
								<Chip icon={<VisibilityIcon />} color="secondary" label={watches} clickable sx={{ fontSize: "20px" }} />
							</Tooltip>
						</>
						:
						<Box display='flex' direction="row">
							{mutualLike ?
								<Box>
									<IconButton
										aria-label="send messages"
										color="inherit"
										aria-controls="send-message"
										aria-haspopup="true"
										aria-expanded={openChat ? 'true' : undefined}
										onClick={handleChatClick}
									>
										<Tooltip title="Send Message">
											<ChatIcon />
										</Tooltip>
									</IconButton>
									<Chat
										anchorel={anchorChatEl}
										open={openChat}
										receiverid={receiverId}
										handleclose={handleChatClose}
										websocket={props.websocket}
									/>
								</Box>
								:
								<>
								</>
							}
							<BlockReportMenu {...props} user={user} updateUser={updateUser} />
						</Box>
					}
				</Stack>
			</Box>
		</>
	);
}

export default Figures;
