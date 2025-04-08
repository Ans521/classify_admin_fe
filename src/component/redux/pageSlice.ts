import { createSlice } from "@reduxjs/toolkit";
import { create } from "domain";

const pageSlice = createSlice({
    name : 'pages',
    initialState : {currentPage : 0},
    reducers : {
        prevPage : (state) => {
            state.currentPage = Math.max(state.currentPage - 1, 1);
            
        },
        nextPage : (state, action) => {
            state.currentPage = Math.min(state.currentPage + 1, action.payload);
        },
        setPage : (state, action) => {
            state.currentPage = action.payload

        }
    }
})
