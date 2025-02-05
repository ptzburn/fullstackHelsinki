import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
    name: 'filter',
    initialState: 'ALL',
    reducers: {
        filterChange(state, action) {
            const filter = action.payload
            return filter
        }
    }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer