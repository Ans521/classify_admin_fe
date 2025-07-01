import { createSlice } from "@reduxjs/toolkit";

const image = createSlice({
    name : 'image',
    initialState : {image : undefined},
    reducers : {
        setImage : (state, action) => {
            state.image = action.payload;
        }
    }
})

export const { setImage } = image.actions;   // this is the action creator function that you can use to dispatch the action, ye function automatically create karta hai jo tu dispatch karega, jaise setProviderId(payload) karne par ye action dispatch hoga.
export default image.reducer;
