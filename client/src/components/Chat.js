import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { IconButton, Box, Paper, Popper, TextField, Typography, Chip, MenuItem, ListItem, ListItemText } from '@mui/material';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import { LoadingMenu } from './Loading';
import { sleep } from '../utility/utilities'

var parser = new DOMParser();
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

export default function Messages(props) {

    const data = [
        {
            "sender_user_id": null,
            "sender": null,
            "read": 1,
        }
    ];
    const messagesEndRef = React.useRef(null)

    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState(data);
    const [receiverName, setReceiverName] = useState('No messages');
    const [receiverId, setReceiverId] = useState(null);

    const scrollToBottom = () => {
        if (messagesEndRef)
            messagesEndRef.current.scrollIntoView(true);
    }

    function MenuItemLoad() {

        // const classes = formStyle(props)();
        return (
            <MenuItem
                sx={{ width: 328, whiteSpace: "normal", display: 'flex', justifyContent: 'center' }}
            >
                {LoadingMenu()}
            </MenuItem>
        );
    }

    function ListItemConversation(props) {

        // const classes = formStyle(props)();
        return (
            <ListItem
                key={props.keybis}
                sx={{ padding: "0 8px", width: 328, whiteSpace: "normal", justifyContent: props.item.sender_user_id === props.item.user_id ? "flex-start" : 'flex-end' }}
            >
                <Box >
                    <Typography
                        sx={{ maxWidth: "80%", fontSize: "10px", whiteSpace: "normal", marginLeft: "10px", marginRight: "10px" }}
                    >
                        {props.item.sender ? props.item.sender : props.item.receiver}
                    </Typography>
                    <Chip
                        color={props.item.sender_user_id === props.item.user_id ? 'primary' : 'secondary'}
                        sx={{ maxWidth: "80%", height: "100%", marginLeft: 0, marginRight: 0 }}
                        label={<Typography
                            sx={{ overflowWrap: "anywhere", whiteSpace: "normal" }}
                        >
                            {parser.parseFromString('<!doctype html><body>' + props.item.message, 'text/html').body.textContent}
                        </Typography>}
                    />
                    <Typography
                        sx={{ maxWidth: "80%", minWidth: "160px", fontSize: "10px", textAlign: "right", marginLeft: "10px", marginRight: "10px" }}
                    >
                        {new Date(props.item.sent_date).toLocaleDateString("en-US", dateOptions) + ' - ' + (props.item.read ? '✓' : 'Sent')}
                    </Typography>
                </Box>
            </ListItem>
        );
    }

    function ListItemHeader(props) {

        // const classes = formStyle(props)();
        return (

            <ListItem
                key={props.keybis}
                disableGutters
                sx={{ borderRadius: "4px 4px 0 0", zIndex: 5, whiteSpace: "normal", padding: "5px 15px", margin: 0, backgroundColor: "primary.main" }}
                secondaryAction={
                    <IconButton onClick={props.conversationclose}>
                        <CloseIcon />
                    </IconButton>
                }
            >
                <ListItemText primary={props.sendername} />
            </ListItem>
        );
    }

    function ListItemSendMessage(props) {

        const [values, setValues] = useState({
            message: '',
        });

        const handleChange = (prop) => (event) => {
            setValues({ ...values, [prop]: event.target.value });
        };

        const textFieldRef = React.useRef(null)

        const sendMessage = (event, senderId, fetchConversation) => {
            if (values.message) {
                fetch("http://" + process.env.REACT_APP_API_URL + "chat/" + (senderId).toString() + "/send", {
                    method: 'POST',
                    headers: {
                        'Authorization': "Bearer " + localStorage.getItem("token"),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: values.message,
                    })
                })
                    .then(res => {
                        if (res.ok && res.status === 200) {
                            fetchConversation(senderId);
                        }
                        else {
                            console.log("Fail to send message");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        console.log("Fail to fetch");
                    })
            }
        }

        // const classes = formStyle(props)();
        return (

            <ListItem
                key={props.keybis}
                disableGutters
                sx={{ borderRadius: "0 0 4px 4px", zIndex: 5, whiteSpace: "normal", padding: "5px 15px", margin: 0, backgroundColor: "primary.main" }}
                secondaryAction={
                    <IconButton
                        onClick={(e) => {
                            textFieldRef.current.focus();
                            sendMessage(e, props.senderid, props.fetchconversation);
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                }
            >
                <TextField
                    // classes={classes}
                    inputRef={textFieldRef}
                    size="small"
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    placeholder="Write a message"
                    multiline
                    maxRows={2}
                    onChange={handleChange('message')}
                    // InputProps={classes.input}
                    sx={{ width: "90%", backgroundColor: '#fff' }}
                />
            </ListItem>
        );
    }

    const fetchConversation = useCallback((senderId) => {
        setIsLoading(true);
        sleep(2000).then(() => {
            fetch("http://" + process.env.REACT_APP_API_URL + "chat/" + (senderId).toString(), {
                method: 'GET',
                headers: { 'Authorization': "Bearer " + localStorage.getItem("token") },
            })
                .then(res => {
                    if (res.ok && res.status === 200) {
                        return res.json().then((data) => {
                            if (data.length) {
                                setConversation(data);
                                setReceiverName(data[0].user_id === data[0].receiver_user_id ? data[0].sender : data[0].receiver);
                                setReceiverId(data[0].user_id === data[0].receiver_user_id ? data[0].sender_user_id : data[0].receiver_user_id);
                            }
                            setIsLoading(false);
                            scrollToBottom();

                        })
                    }
                    else {
                        console.log("Fail to get notifications");
                        setIsLoading(false);
                    }
                })
                .catch(error => {
                    console.log(error);
                    console.log("Fail to fetch");
                    setIsLoading(false);
                })
        })
    }, [])

    useEffect(() => {
        if (props.receiverid) {
            fetchConversation(props.receiverid)
        }
    }, [props.open, props.receiverid, fetchConversation]);

    return (
        <Popper
            key={"popper"}
            anchorEl={props.anchorel}
            open={props.open}
            id="conversation-menu"
            elevation={5}
            disablePortal={false}
            placement='bottom-end'
            modifiers={[
                {
                    name: 'flip',
                    enabled: true,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'viewport',
                        padding: 8,
                    },
                },
                {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                        altAxis: true,
                        altBoundary: true,
                        tether: true,
                        rootBoundary: 'viewport',
                        padding: 8,
                    },
                },
            ]}
            sx={{ zIndex: 4 }}
        >
            <Paper>
                {
                    isLoading === true ?
                        <MenuItemLoad key="1" />
                        :
                        [
                            <ListItemHeader key={"conversationHeader"} keybis={"conversationHeaderBis"} sendername={receiverName} conversationclose={props.handleclose} />,
                            <Box key="boxkey" sx={{ width: '100%', minWidth: 150, Width: 360, maxHeight: 450, overflow: "auto", }}>
                                {conversation.slice().reverse().map((item, i) => (
                                    <ListItemConversation
                                        key={i + "bis"}
                                        keybis={i}
                                        item={item}
                                    />
                                ))}
                                <div
                                    style={{ float: "left", clear: "both" }}
                                    ref={messagesEndRef}
                                >
                                </div>
                            </Box>,
                            <ListItemSendMessage key={"conversationSender"} keybis={"conversationSenderBis"} senderid={receiverId} fetchconversation={fetchConversation} scrollbottom={scrollToBottom} />
                        ]
                }
            </Paper>
        </Popper >
    )

}