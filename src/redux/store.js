import { configureStore } from '@reduxjs/toolkit';
import { orderBookSlice } from './reducer'

const store = configureStore({
    reducer: {
        orderBook: orderBookSlice.reducer,
    },
});

export default store