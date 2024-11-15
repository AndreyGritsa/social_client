import {
  Paper,
  Typography,
  List,
  TextField,
  ListItem,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { addMessage } from "../../features/channels/channelsSlice";
import { useEffect } from "react";
import { setActiveChannel } from "../../features/active/activeSlice";
import { format } from "date-fns";
import { reorderChannels } from "../../features/channels/channelsSlice";

const ChannelContainer = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const channel = useAppSelector((state) =>
    state.channels.channels.find((channel) => channel.id === channelId)
  );
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [messageInput, setMessageInput] = useState<string>("");

  useEffect(() => {
    // make sure the active channel is set when page is reloaded
    if (channelId) {
      dispatch(setActiveChannel(channelId));
    }
  }, [channelId, dispatch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!messageInput) {
      return;
    } else if (channelId) {
      dispatch(
        addMessage({ channelId, content: messageInput, author: { ...user } })
      );
      dispatch(reorderChannels(channelId));
      setMessageInput("");
    }
  };

  return (
    <Box
      sx={{
        p: 1,
        // TODO: couldn't figure out how to use 100% instead
        height: "95.3dvh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List
        sx={{
          flexDirection: "column-reverse",
          overflowY: "auto",
          overflowX: "clip",
          mt: 1,
          flexGrow: 1,
          overflowAnchor: "auto!important",
          display: "flex",
          scrollBehavior: "smooth",
        }}
      >
        {channel &&
          channel.messages.map((message) => (
            <ListItem
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              key={message.id}
            >
              <Paper sx={{ p: 1 }}>
                <Typography variant="body1">{message.content}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {message.author.name} -{" "}
                  {format(new Date(message.timestamp), "MMMM d, yyyy")}
                </Typography>
              </Paper>
            </ListItem>
          ))}
      </List>

      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyUp={handleKeyPress}
        sx={{
          flexShrink: 0,
          marginTop: "auto",
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSendMessage}>
                  <SendIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default ChannelContainer;
