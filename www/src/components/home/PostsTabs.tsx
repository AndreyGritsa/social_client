import { useState } from "react";
import { Tab, Tabs, Box } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import NewPost from "./NewPost";
import Grid from "@mui/material/Grid2";
import SinglePost from "./SinglePost";
import {
  useGetPostsQuery,
  useClosePostsEventSourceMutation,
  useGetMyPostsQuery,
} from "../../services/endpoints/posts";
import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { postsEventSource } from "../../services/endpoints/posts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`posts-tabpanel-${index}`}
      aria-labelledby={`posts-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `posts-tab-${index}`,
    "aria-controls": `posts-tabpanel-${index}`,
  };
}

const PostsTabs = () => {
  const [value, setValue] = useState<number>(0);
  const user = useAppSelector((state) => state.user);
  const posts = useAppSelector((state) => state.posts.posts);
  const myPosts = useAppSelector((state) => state.posts.myPosts);
  const { refetch, isUninitialized } = useGetPostsQuery(
    user.id ? user.id : skipToken
  );
  const { refetch: refetchMyPosts, isUninitialized: isMyPostsUninitialized } =
    useGetMyPostsQuery(user.id ? user.id : skipToken);
  const [triggerClosePostsEventSource] = useClosePostsEventSourceMutation();

  // TODO: stupid so far, find working solution
  // useEffect(() => {
  //   if (!isUninitialized && !postsEventSource) {
  //     refetch();
  //   }
  //   if (!isMyPostsUninitialized) {
  //     refetchMyPosts();
  //   }

  //   return () => {
  //     triggerClosePostsEventSource();
  //   };
  // }, [
  //   user.id,
  //   refetch,
  //   refetchMyPosts,
  //   isUninitialized,
  //   isMyPostsUninitialized,
  //   triggerClosePostsEventSource,
  // ]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="posts tabs">
          <Tab label="Friends posts" {...a11yProps(0)} />
          <Tab label="My posts" {...a11yProps(1)} />
          <Tab label="Add new post" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid
          container
          spacing={2}
          sx={{
            height: "1dvh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {posts.map((element, index) => (
            <Grid key={index} size={{ xs: 12, md: 8 }}>
              <SinglePost {...element} />
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid
          container
          spacing={2}
          sx={{
            height: "1dvh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {myPosts.map((element, index) => (
            <Grid key={index} size={{ xs: 12, md: 8 }}>
              <SinglePost {...element} />
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <NewPost setValue={setValue} />
      </CustomTabPanel>
    </Box>
  );
};

export default PostsTabs;