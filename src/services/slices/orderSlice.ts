import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '@api';

interface OrderState {
  orders: TOrder[];
  orderData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  orders: [],
  orderData: null,
  orderRequest: false,
  isLoading: false,
  error: null
};

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async () => await getOrdersApi()
);

export const getOrderData = createAsyncThunk(
  'order/getOrderData',
  async (number: number) => await getOrderByNumberApi(number)
);

export const createOrder = createAsyncThunk(
  'order/newOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    const response = await orderBurgerApi(ingredients);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return { order: response.order, name: response.name };
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData(state) {
      state.orderData = null;
    }
  },
  selectors: {
    selectOrdersList: (state) => state.orders,
    selectOrderData: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })
      .addCase(getOrderData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload.orders[0];
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error.message as string;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.orderData = action.payload.order;
        state.orders.push(action.payload.order);
      });
  }
});

export const { selectOrderData, selectOrderRequest, selectOrdersList } =
  orderSlice.selectors;
export const { clearOrderData } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
