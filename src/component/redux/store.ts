import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer : {

    }
})

// ReturnType is a built-in TypeScript utility type that extracts the return type of a given function type.
// store.getState is a function that returns the entire Redux state object.

// RootState becomes the exact TypeScript type representing your Redux store’s state shape.

// dispatch is a function that sends actions to the Redux store to update the state.

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;