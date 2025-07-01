import { createSlice } from "@reduxjs/toolkit";

// jb mene createSlice kiye toh ye automatically do cheezein bana ke deta hai:
// Actions – Ye wo functions hote hain jo tu dispatch karta hai (setProviderId(payload)).

// Reducer – Ye wo function hai jo state update karta hai (switch-case ki jagah).

const providerId = createSlice({
    name : 'providerId',
    initialState : {providerId : undefined},
    reducers : {
        setProviderId : (state, action) => {
            state.providerId = action.payload;
        }
    }
})


export const { setProviderId } = providerId.actions;   // this is the action creator function that you can use to dispatch the action, ye function automatically create karta hai jo tu dispatch karega, jaise setProviderId(payload) karne par ye action dispatch hoga.
export default providerId.reducer;
