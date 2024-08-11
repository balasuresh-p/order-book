import {  createSlice } from '@reduxjs/toolkit';
import { convertData, updateOrderBook } from '../utils/helper';

export const orderBookSlice = createSlice({
    name: 'orderBook',
    initialState: {
      orderBookData: [],
      loading: true,
    },
    reducers: {
      fetchOrderBookStart(state) {
        state.loading = true;
      },
      fetchOrderBookSuccess(state, action) {
        state.orderBookData = [convertData(action.payload)];
        state.loading = false;
      },
      fetchOrderBookFailure(state) {
        state.orderBookData = [];
        state.loading = false;
      },
      fetchOrderBookUpdate(state, action) {
        state.orderBookData = updateOrderBook(action.payload, state.orderBookData);
        state.loading = false;
      }
    },
  });

export const { fetchOrderBookStart, fetchOrderBookSuccess, fetchOrderBookUpdate, fetchOrderBookFailure } = orderBookSlice.actions;
