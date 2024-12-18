import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Post } from "../../features/posts/postsSlice";
import { useUpdatePostMutation } from "../../services/endpoints/posts";
import { useState, Dispatch, SetStateAction, Fragment, FormEvent } from "react";

type EditPostDialogProps = {
  setOpenPopper: Dispatch<SetStateAction<boolean>>;
  post: Post;
};

const EditPostDialog = ({ ...props }: EditPostDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [triggerUpdatePost] = useUpdatePostMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.setOpenPopper(false);
  };

  const handleUpdatePost = (data: Post) => {
    triggerUpdatePost(data)
      .unwrap()
      .catch((error) => console.error(error));
    handleClose();
  };

  return (
    <Fragment>
      <Button
        onClick={handleClickOpen}
        variant="outlined"
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(
              formData.entries()
            ) as unknown as Post;
            const updatedPost = {
              ...props.post,
              title: formJson.title,
              content: formJson.content,
            };
            handleUpdatePost(updatedPost);
          },
        }}
      >
        <DialogTitle>Edit post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={props.post.title}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="content"
            name="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            defaultValue={props.post.content}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Edit</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default EditPostDialog;
