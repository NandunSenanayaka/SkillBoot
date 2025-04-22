import { configureStore } from "@reduxjs/toolkit";
import followingPostReducer from "../feature/followingPost/followingPostSlice";
import followingAccountReducer from "../feature/followingAccounts/followingAccountSlice";
import checkProfileReducer from "../feature/checkProfile/checkProfileSlice";
import jobReducer from "../feature/job/jobSlice";

export const store = configureStore({
    reducer: {
        followingPostReducer: followingPostReducer,
        followingAccountReducer: followingAccountReducer,
        checkProfileReducer: checkProfileReducer,
        jobReducer: jobReducer,
    },
});