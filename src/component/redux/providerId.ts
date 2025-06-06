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
