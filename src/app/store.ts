import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import channelsReducer from "../features/channels/channelsSlice";
import activeChannelReducer from "../features/active/activeSlice";
import postsReducer from "../features/posts/postsSlice";
import friendsReducer from "../features/friends/friendsSlice";
import serversReducer from "../features/servers/serversSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    channels: channelsReducer,
    active: activeChannelReducer,
    posts: postsReducer,
    friends: friendsReducer,
    servers: serversReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
