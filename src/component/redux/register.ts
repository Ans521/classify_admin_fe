import { createSlice } from "@reduxjs/toolkit";

// jb mene createSlice kiye toh ye automatically do cheezein bana ke deta hai:
// Actions – Ye wo functions hote hain jo tu dispatch karta hai (setProviderId(payload)).

// Reducer – Ye wo function hai jo state update karta hai (switch-case ki jagah).

const register = createSlice({
    name : 'register',
    initialState : {phoneNumber : undefined, email : undefined},
    reducers : {
        setPhoneNumber : (state, action) => {
            state.phoneNumber = action.payload;
        },
        setEmail  : (state, action) => {
            state.email = action.payload;
        }
    }
})

export const { setPhoneNumber, setEmail } = register.actions;   // this is the action creator function that you can use to dispatch the action, ye function automatically create karta hai jo tu dispatch karega, jaise setProviderId(payload) karne par ye action dispatch hoga.
export default register.reducer;
