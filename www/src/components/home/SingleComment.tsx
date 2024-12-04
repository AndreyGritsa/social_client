import { Comment } from "../../features/posts/postsSlice";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import React from "react";

const SingleComment = ({ ...props }: Comment) => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={props.author} src="/" />
      </ListItemAvatar>
      <ListItemText
        primary={props.author}
        secondary={<React.Fragment>{props.content}</React.Fragment>}
      />
    </ListItem>
  );
};

export default SingleComment;
